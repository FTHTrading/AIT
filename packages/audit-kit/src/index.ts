// ─── BIOFIELD OS — Audit Kit ───
// Content-addressed immutable event logging, session playback
// reconstruction, hash verification, and approval workflow.

import type {
  AuditEvent,
  SessionPlayback,
  OperatorAction,
  ActionOutcome,
} from '@biofield/types';
import type { SubEngine, TickContext, EventBus } from '@biofield/core-engine';

// ═══════════════════════════════════════════════
// Content-Addressed Hashing (SHA-256 via Web Crypto)
// ═══════════════════════════════════════════════

async function sha256(data: string): Promise<string> {
  // Use Node.js crypto if available, otherwise fallback
  if (typeof globalThis.crypto?.subtle !== 'undefined') {
    const encoder = new TextEncoder();
    const buf = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(data));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback: simple hash for environments without Web Crypto
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// ═══════════════════════════════════════════════
// Audit Log — append-only event store
// ═══════════════════════════════════════════════

let auditSeq = 0;

export class AuditLog {
  private events: AuditEvent[] = [];
  private lastHash = '';

  async append(event: Omit<AuditEvent, 'id' | 'contentHash' | 'timestamp'>): Promise<AuditEvent> {
    const id = `audit-${++auditSeq}`;
    const timestamp = new Date();

    // Chain hash: hash = SHA256(prevHash + eventData)
    const payload = JSON.stringify({
      prev: this.lastHash,
      id,
      sessionId: event.sessionId,
      eventType: event.eventType,
      actor: event.actor,
      actorType: event.actorType,
      entityType: event.entityType,
      entityId: event.entityId,
      description: event.description,
      timestamp: timestamp.toISOString(),
    });
    const contentHash = await sha256(payload);

    const full: AuditEvent = {
      ...event,
      id,
      contentHash,
      timestamp,
    };
    this.events.push(full);
    this.lastHash = contentHash;
    return full;
  }

  getEvents(filter?: { sessionId?: string; eventType?: string; actor?: string }): AuditEvent[] {
    let result = this.events;
    if (filter?.sessionId) result = result.filter((e) => e.sessionId === filter.sessionId);
    if (filter?.eventType) result = result.filter((e) => e.eventType === filter.eventType);
    if (filter?.actor) result = result.filter((e) => e.actor === filter.actor);
    return result;
  }

  getEventById(id: string): AuditEvent | undefined {
    return this.events.find((e) => e.id === id);
  }

  /** Verify the hash chain integrity */
  async verify(): Promise<{ valid: boolean; brokenAt?: number }> {
    let prevHash = '';
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];
      const payload = JSON.stringify({
        prev: prevHash,
        id: event.id,
        sessionId: event.sessionId,
        eventType: event.eventType,
        actor: event.actor,
        actorType: event.actorType,
        entityType: event.entityType,
        entityId: event.entityId,
        description: event.description,
        timestamp: event.timestamp instanceof Date ? event.timestamp.toISOString() : event.timestamp,
      });
      const expected = await sha256(payload);
      if (expected !== event.contentHash) {
        return { valid: false, brokenAt: i };
      }
      prevHash = event.contentHash;
    }
    return { valid: true };
  }

  get length(): number {
    return this.events.length;
  }

  clear(): void {
    this.events = [];
    this.lastHash = '';
  }
}

// ═══════════════════════════════════════════════
// Session Playback Reconstructor
// ═══════════════════════════════════════════════

export interface PlaybackFrame {
  tickNumber: number;
  timestampMs: number;
  events: AuditEvent[];
}

export class PlaybackReconstructor {
  /** Build ordered playback frames from audit events for a session. */
  reconstruct(events: AuditEvent[], tickIntervalMs: number): PlaybackFrame[] {
    if (events.length === 0) return [];

    const sorted = [...events].sort((a, b) => {
      const ta = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
      const tb = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
      return ta - tb;
    });

    const baseTime = sorted[0].timestamp instanceof Date
      ? sorted[0].timestamp.getTime()
      : new Date(sorted[0].timestamp).getTime();

    const frames: PlaybackFrame[] = [];
    let currentFrame: PlaybackFrame | null = null;

    for (const event of sorted) {
      const eventTime = event.timestamp instanceof Date
        ? event.timestamp.getTime()
        : new Date(event.timestamp).getTime();
      const elapsedMs = eventTime - baseTime;
      const tickNumber = Math.floor(elapsedMs / tickIntervalMs);

      if (!currentFrame || currentFrame.tickNumber !== tickNumber) {
        currentFrame = { tickNumber, timestampMs: elapsedMs, events: [] };
        frames.push(currentFrame);
      }
      currentFrame.events.push(event);
    }

    return frames;
  }
}

// ═══════════════════════════════════════════════
// Operator Action Logger
// ═══════════════════════════════════════════════

let actionSeq = 0;

export class OperatorActionLog {
  private actions: OperatorAction[] = [];
  private auditLog: AuditLog;
  private sessionId: string;

  constructor(auditLog: AuditLog, sessionId: string) {
    this.auditLog = auditLog;
    this.sessionId = sessionId;
  }

  async logAction(
    profileId: string,
    operatorId: string,
    actionType: string,
    description: string,
    targetEntity: string,
    targetEntityId: string,
    payload: Record<string, unknown>,
    outcome: ActionOutcome,
    resultNotes: string,
  ): Promise<OperatorAction> {
    const action: OperatorAction = {
      id: `action-${++actionSeq}`,
      profileId,
      operatorId,
      actionType,
      description,
      targetEntity,
      targetEntityId,
      payload,
      outcome,
      resultNotes,
      performedAt: new Date(),
    };
    this.actions.push(action);

    // Mirror to audit log
    await this.auditLog.append({
      sessionId: this.sessionId,
      profileId,
      eventType: 'operator.action',
      actor: operatorId,
      actorType: 'operator',
      description: `${actionType}: ${description}`,
      entityType: targetEntity,
      entityId: targetEntityId,
      beforeState: undefined,
      afterState: payload,
    });

    return action;
  }

  getActions(): OperatorAction[] {
    return [...this.actions];
  }
}

// ═══════════════════════════════════════════════
// Audit Engine — SubEngine that auto-logs bus events
// ═══════════════════════════════════════════════

export class AuditEngine implements SubEngine {
  readonly name = 'audit-engine';
  readonly log: AuditLog;
  readonly playback = new PlaybackReconstructor();
  private bus: EventBus | null = null;
  private sessionId: string;
  private unsubscribers: (() => void)[] = [];

  constructor(sessionId: string, bus?: EventBus) {
    this.sessionId = sessionId;
    this.log = new AuditLog();
    this.bus = bus ?? null;
  }

  async initialize(): Promise<void> {
    if (!this.bus) return;

    // Subscribe to key events and auto-log them
    const events = [
      'session.state.changed',
      'emergency.stop',
      'emergency.resolved',
      'alarm.fired',
      'alarm.resolved',
      'safety.lock.activated',
      'safety.lock.deactivated',
      'gas.command.executed',
      'recommendation.new',
      'operator.action',
    ];

    for (const eventType of events) {
      const unsub = this.bus.on(eventType, async (payload: unknown) => {
        await this.log.append({
          sessionId: this.sessionId,
          eventType,
          actor: 'system',
          actorType: 'system',
          description: eventType,
          entityType: eventType.split('.')[0],
          entityId: '',
          afterState: payload as Record<string, unknown>,
        });
      });
      this.unsubscribers.push(unsub);
    }
  }

  async tick(_ctx: TickContext): Promise<void> {
    // Audit doesn't need per-tick work — events are captured via bus subscriptions
  }

  async shutdown(): Promise<void> {
    for (const unsub of this.unsubscribers) unsub();
    this.unsubscribers = [];
  }

  getSessionPlayback(tickIntervalMs = 10): PlaybackFrame[] {
    const events = this.log.getEvents({ sessionId: this.sessionId });
    return this.playback.reconstruct(events, tickIntervalMs);
  }

  async verifyIntegrity(): Promise<{ valid: boolean; brokenAt?: number }> {
    return this.log.verify();
  }
}
