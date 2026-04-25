import { describe, it, expect } from 'vitest';
import { AuditLog, AuditEngine } from './index.js';
import { createHash } from 'node:crypto';

describe('sha256 (via Node crypto)', () => {
  it('should produce a 64-char hex hash', () => {
    const hash = createHash('sha256').update('hello world').digest('hex');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('should be deterministic', () => {
    const a = createHash('sha256').update('test-input').digest('hex');
    const b = createHash('sha256').update('test-input').digest('hex');
    expect(a).toBe(b);
  });
});

describe('AuditLog', () => {
  it('should append events and track length', async () => {
    const log = new AuditLog();
    await log.append({
      sessionId: 'sess-1',
      eventType: 'gas_command',
      actor: 'operator',
      actorType: 'operator',
      description: 'Set O2 flow rate to 5 L/min',
      entityType: 'gas_channel',
      entityId: 'O2',
    });
    expect(log.length).toBe(1);
  });

  it('should retrieve events by id', async () => {
    const log = new AuditLog();
    const event = await log.append({
      sessionId: 'sess-1',
      eventType: 'safety',
      actor: 'system',
      actorType: 'system',
      description: 'Emergency stop triggered',
      entityType: 'safety_lock',
      entityId: 'lock-1',
    });
    const found = log.getEventById(event.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(event.id);
  });

  it('should verify integrity of empty log', async () => {
    const log = new AuditLog();
    const result = await log.verify();
    expect(result.valid).toBe(true);
  });

  it('should verify integrity after appending', async () => {
    const log = new AuditLog();
    await log.append({ sessionId: 's', eventType: 'test', actor: 'x', actorType: 'operator', description: 'a', entityType: 'test', entityId: 'e1' });
    await log.append({ sessionId: 's', eventType: 'test', actor: 'x', actorType: 'operator', description: 'b', entityType: 'test', entityId: 'e2' });
    const result = await log.verify();
    expect(result.valid).toBe(true);
  });

  it('should clear all events', async () => {
    const log = new AuditLog();
    await log.append({ sessionId: 's', eventType: 'test', actor: 'x', actorType: 'operator', description: 'a', entityType: 'test', entityId: 'e1' });
    log.clear();
    expect(log.length).toBe(0);
  });
});

describe('AuditEngine', () => {
  it('should create with session id', () => {
    const engine = new AuditEngine('test-session');
    expect(engine).toBeDefined();
    expect(engine.name).toBe('audit-engine');
  });

  it('should initialize and shutdown', async () => {
    const engine = new AuditEngine('test-session');
    await engine.initialize();
    await engine.shutdown();
  });

  it('should verify integrity', async () => {
    const engine = new AuditEngine('test-session');
    await engine.initialize();
    const result = await engine.verifyIntegrity();
    expect(result.valid).toBe(true);
    await engine.shutdown();
  });
});
