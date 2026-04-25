import { describe, it, expect } from 'vitest';
import { SafetyEngine } from './index.js';
import { EventBus } from '@biofield/core-engine';

describe('SafetyEngine', () => {
  it('should create with default bus', () => {
    const engine = new SafetyEngine();
    expect(engine).toBeDefined();
    expect(engine.name).toBe('safety-engine');
  });

  it('should initialize and shutdown', async () => {
    const engine = new SafetyEngine();
    await engine.initialize();
    await engine.shutdown();
  });

  it('should add and remove constraints', async () => {
    const engine = new SafetyEngine();
    await engine.initialize();
    engine.addConstraint({
      id: 'test-rule',
      parameterPath: 'gas.O2.flowRate',
      minValue: 0,
      maxValue: 15,
      alarmSeverity: 'high',
      lockOnViolation: false,
      lockLevel: 'advisory',
      description: 'O2 flow rate test constraint',
    });
    engine.removeConstraint('test-rule');
    await engine.shutdown();
  });

  it('should preflight check a gas command', async () => {
    const engine = new SafetyEngine();
    await engine.initialize();
    const result = engine.preflightCheck({
      id: 'cmd-1',
      profileId: 'sess-1',
      gasType: 'O2',
      targetFlowLpm: 5,
      targetConcentrationPct: 21,
      rampDurationMs: 1000,
      source: 'operator',
      approved: false,
      issuedAt: new Date(),
    });
    expect(result).toBeDefined();
    expect(result).toHaveProperty('approved');
    await engine.shutdown();
  });

  it('should emergency stop and resolve', async () => {
    const engine = new SafetyEngine();
    await engine.initialize();
    const lock = await engine.emergencyStop('test', 'operator');
    expect(lock).toBeDefined();
    await engine.resolveEmergencyStop('admin');
    await engine.shutdown();
  });
});
