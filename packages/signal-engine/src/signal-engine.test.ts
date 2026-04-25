import { describe, it, expect } from 'vitest';
import { SignalEngine, BUILTIN_GENERATORS } from './index.js';
import { EventBus } from '@biofield/core-engine';

describe('SignalEngine', () => {
  it('should create with default bus', () => {
    const engine = new SignalEngine();
    expect(engine).toBeDefined();
    expect(engine.name).toBe('signal-engine');
  });

  it('should initialize and shutdown', async () => {
    const engine = new SignalEngine();
    await engine.initialize();
    await engine.shutdown();
  });

  it('should register builtin generators', async () => {
    const engine = new SignalEngine();
    await engine.initialize();
    for (const gen of BUILTIN_GENERATORS.values()) {
      engine.registerGenerator(gen);
    }
    await engine.shutdown();
  });

  it('should have at least 5 builtin generators', () => {
    expect(BUILTIN_GENERATORS.size).toBeGreaterThanOrEqual(5);
  });
});
