// ─── BIOFIELD OS — Safety Engine ───
// Constraint evaluation, alarm management, SafetyLock escalation,
// pre-flight gas command validation, emergency stop.

import type {
  AlarmSeverity,
  LockLevel,
  OrganSystem,
  GasType,
  GasCommand,
  SafetyLock,
  AlarmEvent,
  OrganState,
  GasCircuitState,
  SignalConstraint,
} from '@biofield/types';
import type { SubEngine, TickContext, EventBus } from '@biofield/core-engine';

// ═══════════════════════════════════════════════
// Safety Constraint Definition
// ═══════════════════════════════════════════════

export interface SafetyConstraintRule {
  id: string;
  parameterPath: string;       // e.g. "lung.spo2Pct"
  organ?: OrganSystem;
  minValue?: number;
  maxValue?: number;
  alarmSeverity: AlarmSeverity;
  lockOnViolation: boolean;
  lockLevel: LockLevel;
  description: string;
}

// ═══════════════════════════════════════════════
// Gas Pre-flight Check
// ═══════════════════════════════════════════════

export interface PreflightResult {
  approved: boolean;
  violations: string[];
  lockId?: string;
}

// ═══════════════════════════════════════════════
// Safety Engine
// ═══════════════════════════════════════════════

let alarmSeq = 0;
let lockSeq = 0;

export class SafetyEngine implements SubEngine {
  readonly name = 'safety-engine';
  private constraints: SafetyConstraintRule[] = [];
  private activeLocks: SafetyLock[] = [];
  private activeAlarms: AlarmEvent[] = [];
  private bus: EventBus | null = null;
  private emergencyStopped = false;
  private profileId = '';

  // Parameter resolver: caller provides a function that
  // resolves "organ.paramName" to a numeric value.
  private paramResolver: ((path: string) => number | undefined) | null = null;

  constructor(bus?: EventBus) {
    this.bus = bus ?? null;
  }

  setProfile(profileId: string): void {
    this.profileId = profileId;
  }

  setParameterResolver(fn: (path: string) => number | undefined): void {
    this.paramResolver = fn;
  }

  async initialize(): Promise<void> {
    this.activeLocks = [];
    this.activeAlarms = [];
    this.emergencyStopped = false;
    this.loadDefaultConstraints();
  }

  async tick(ctx: TickContext): Promise<void> {
    if (this.emergencyStopped) return;
    this.evaluateConstraints(ctx.elapsedMs);
  }

  async shutdown(): Promise<void> {
    // Leave locks/alarms intact for audit trail
  }

  // ── Constraint Management ──

  addConstraint(rule: SafetyConstraintRule): void {
    this.constraints.push(rule);
  }

  removeConstraint(id: string): void {
    this.constraints = this.constraints.filter((c) => c.id !== id);
  }

  getConstraints(): SafetyConstraintRule[] {
    return [...this.constraints];
  }

  // ── Pre-flight Validation ──

  preflightCheck(cmd: GasCommand): PreflightResult {
    const violations: string[] = [];

    // Emergency stop blocks everything
    if (this.emergencyStopped) {
      return { approved: false, violations: ['Emergency stop is active — all commands blocked'] };
    }

    // Check active locks that affect this gas type
    for (const lock of this.activeLocks) {
      if (lock.affectedGasTypes.includes(cmd.gasType)) {
        if (lock.level === 'emergency_stop') {
          violations.push(`Emergency lock ${lock.id}: ${lock.reason}`);
        } else if (lock.level === 'enforced') {
          violations.push(`Enforced lock ${lock.id}: ${lock.reason}`);
        }
        // Advisory locks don't block, just warn
      }
    }

    // FiO2 safety bounds
    if (cmd.gasType === 'O2') {
      if (cmd.targetConcentrationPct > 100) violations.push('O2 concentration cannot exceed 100%');
      if (cmd.targetFlowLpm > 15) violations.push('O2 flow > 15 LPM exceeds safe limit');
    }

    // N2O safety: never without adequate O2
    if (cmd.gasType === 'N2O' && cmd.targetConcentrationPct > 70) {
      violations.push('N2O > 70% risks hypoxic mixture');
    }

    if (violations.length > 0) {
      return { approved: false, violations };
    }
    return { approved: true, violations: [] };
  }

  // ── Emergency Stop ──

  async emergencyStop(reason: string, triggeredBy: string): Promise<SafetyLock> {
    this.emergencyStopped = true;
    const lock = this.createLock('emergency_stop', reason, triggeredBy, [], []);
    if (this.bus) {
      await this.bus.emit('emergency.stop', {
        lockId: lock.id,
        reason,
        triggeredBy,
        profileId: this.profileId,
      });
    }
    return lock;
  }

  async resolveEmergencyStop(resolvedBy: string): Promise<void> {
    this.emergencyStopped = false;
    // Deactivate all emergency locks
    for (const lock of this.activeLocks) {
      if (lock.level === 'emergency_stop' && !lock.deactivatedAt) {
        lock.deactivatedAt = new Date();
        lock.deactivatedBy = resolvedBy;
      }
    }
    if (this.bus) {
      await this.bus.emit('emergency.resolved', { resolvedBy, profileId: this.profileId });
    }
  }

  get isEmergencyStopped(): boolean {
    return this.emergencyStopped;
  }

  // ── Locks ──

  getActiveLocks(): SafetyLock[] {
    return this.activeLocks.filter((l) => !l.deactivatedAt);
  }

  deactivateLock(lockId: string, deactivatedBy: string): boolean {
    const lock = this.activeLocks.find((l) => l.id === lockId && !l.deactivatedAt);
    if (!lock) return false;
    lock.deactivatedAt = new Date();
    lock.deactivatedBy = deactivatedBy;
    if (this.bus) {
      this.bus.emit('safety.lock.deactivated', { lockId, deactivatedBy });
    }
    return true;
  }

  // ── Alarms ──

  getActiveAlarms(): AlarmEvent[] {
    return this.activeAlarms.filter((a) => !a.resolvedAt);
  }

  acknowledgeAlarm(alarmId: string, acknowledgedBy: string): boolean {
    const alarm = this.activeAlarms.find((a) => a.id === alarmId);
    if (!alarm) return false;
    alarm.acknowledged = true;
    alarm.acknowledgedBy = acknowledgedBy;
    alarm.acknowledgedAt = new Date();
    return true;
  }

  resolveAlarm(alarmId: string): boolean {
    const alarm = this.activeAlarms.find((a) => a.id === alarmId);
    if (!alarm) return false;
    alarm.resolvedAt = new Date();
    if (this.bus) {
      this.bus.emit('alarm.resolved', { alarmId });
    }
    return true;
  }

  // ── Internal ──

  private evaluateConstraints(timestampMs: number): void {
    if (!this.paramResolver) return;

    for (const rule of this.constraints) {
      const value = this.paramResolver(rule.parameterPath);
      if (value === undefined) continue;

      let violated = false;
      if (rule.minValue !== undefined && value < rule.minValue) violated = true;
      if (rule.maxValue !== undefined && value > rule.maxValue) violated = true;

      if (violated) {
        // Check if alarm already active for this rule
        const existing = this.activeAlarms.find(
          (a) => a.parameterName === rule.parameterPath && !a.resolvedAt,
        );
        if (!existing) {
          this.fireAlarm(rule, value, timestampMs);
          if (rule.lockOnViolation) {
            this.createLock(
              rule.lockLevel,
              `Constraint violated: ${rule.description}`,
              'safety-engine',
              rule.organ ? [rule.organ] : [],
              [],
            );
          }
        }
      } else {
        // Auto-resolve alarm if parameter returns to safe range
        const existing = this.activeAlarms.find(
          (a) => a.parameterName === rule.parameterPath && !a.resolvedAt,
        );
        if (existing) {
          this.resolveAlarm(existing.id);
        }
      }
    }
  }

  private fireAlarm(rule: SafetyConstraintRule, currentValue: number, _timestampMs: number): void {
    const alarm: AlarmEvent = {
      id: `alarm-${++alarmSeq}`,
      profileId: this.profileId,
      severity: rule.alarmSeverity,
      source: 'safety-engine',
      organ: rule.organ,
      parameterName: rule.parameterPath,
      currentValue,
      thresholdValue: rule.minValue ?? rule.maxValue ?? 0,
      message: `${rule.description}: value=${currentValue}`,
      acknowledged: false,
      firedAt: new Date(),
    };
    this.activeAlarms.push(alarm);
    if (this.bus) {
      this.bus.emit('alarm.fired', alarm);
    }
  }

  private createLock(
    level: LockLevel,
    reason: string,
    triggeredBy: string,
    affectedSystems: OrganSystem[],
    affectedGasTypes: GasType[],
  ): SafetyLock {
    const lock: SafetyLock = {
      id: `lock-${++lockSeq}`,
      profileId: this.profileId,
      level,
      reason,
      triggeredBy,
      affectedSystems,
      affectedGasTypes,
      overrideRequiresApproval: level !== 'advisory',
      activatedAt: new Date(),
    };
    this.activeLocks.push(lock);
    if (this.bus) {
      this.bus.emit('safety.lock.activated', lock);
    }
    return lock;
  }

  private loadDefaultConstraints(): void {
    this.constraints = [
      // Lung
      { id: 'spo2-low', parameterPath: 'lung.spo2Pct', organ: 'lung', minValue: 88, alarmSeverity: 'high', lockOnViolation: false, lockLevel: 'advisory', description: 'SpO2 below 88%' },
      { id: 'spo2-critical', parameterPath: 'lung.spo2Pct', organ: 'lung', minValue: 75, alarmSeverity: 'critical', lockOnViolation: true, lockLevel: 'enforced', description: 'SpO2 critically low (<75%)' },
      { id: 'plateau-high', parameterPath: 'lung.plateauPressureCmH2O', organ: 'lung', maxValue: 30, alarmSeverity: 'high', lockOnViolation: true, lockLevel: 'enforced', description: 'Plateau pressure > 30 cmH2O' },
      // Cardiac
      { id: 'map-low', parameterPath: 'cardiac.meanArterialPressureMmhg', organ: 'cardiac', minValue: 60, alarmSeverity: 'high', lockOnViolation: false, lockLevel: 'advisory', description: 'MAP below 60 mmHg' },
      { id: 'hr-high', parameterPath: 'cardiac.heartRateBpm', organ: 'cardiac', maxValue: 150, alarmSeverity: 'high', lockOnViolation: false, lockLevel: 'advisory', description: 'Heart rate > 150 bpm' },
      // Metabolic
      { id: 'ph-low', parameterPath: 'metabolic.phArterial', organ: 'metabolic', minValue: 7.20, alarmSeverity: 'critical', lockOnViolation: true, lockLevel: 'enforced', description: 'Arterial pH < 7.20' },
      { id: 'lactate-high', parameterPath: 'metabolic.lactateMmolL', organ: 'metabolic', maxValue: 4, alarmSeverity: 'medium', lockOnViolation: false, lockLevel: 'advisory', description: 'Lactate > 4 mmol/L' },
      // Renal
      { id: 'uo-low', parameterPath: 'renal.urineOutputMlHr', organ: 'renal', minValue: 20, alarmSeverity: 'medium', lockOnViolation: false, lockLevel: 'advisory', description: 'Urine output < 20 mL/hr' },
      // Inflammatory
      { id: 'sofa-high', parameterPath: 'inflammatory.sofaScore', organ: 'inflammatory', maxValue: 10, alarmSeverity: 'high', lockOnViolation: false, lockLevel: 'advisory', description: 'SOFA score > 10' },
    ];
  }
}
