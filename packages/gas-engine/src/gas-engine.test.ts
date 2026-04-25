import { describe, it, expect } from 'vitest';
import { GasEngine } from './index.js';
import { EventBus } from '@biofield/core-engine';

describe('GasEngine', () => {
  it('should create with default bus', () => {
    const engine = new GasEngine();
    expect(engine).toBeDefined();
    expect(engine.name).toBe('gas-engine');
  });

  it('should create with custom bus', () => {
    const bus = new EventBus();
    const engine = new GasEngine(bus);
    expect(engine).toBeDefined();
  });

  it('should initialize and shutdown', async () => {
    const engine = new GasEngine();
    await engine.initialize();
    await engine.shutdown();
  });

  it('should set a profile', async () => {
    const engine = new GasEngine();
    await engine.initialize();
    engine.setProfile('adult-default');
    await engine.shutdown();
  });

  it('should return state with channels', async () => {
    const engine = new GasEngine();
    await engine.initialize();
    const state = engine.getState(0);
    expect(state).toBeDefined();
    expect(state).toHaveProperty('channels');
    await engine.shutdown();
  });
});
