import { describe, it, expect, vi } from 'vitest';
import { EventBus, SimulationClock, SimulationController } from './index.js';

describe('EventBus', () => {
  it('should emit and receive events', async () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on('test', handler);
    await bus.emit('test', { value: 42 });
    expect(handler).toHaveBeenCalledWith({ value: 42 });
  });

  it('should support unsubscribe', async () => {
    const bus = new EventBus();
    const handler = vi.fn();
    const unsub = bus.on('test', handler);
    unsub();
    await bus.emit('test', { value: 1 });
    expect(handler).not.toHaveBeenCalled();
  });

  it('should clear all handlers', async () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on('test', handler);
    bus.clear();
    await bus.emit('test', {});
    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle multiple handlers for same event', async () => {
    const bus = new EventBus();
    const h1 = vi.fn();
    const h2 = vi.fn();
    bus.on('data', h1);
    bus.on('data', h2);
    await bus.emit('data', 'hello');
    expect(h1).toHaveBeenCalledWith('hello');
    expect(h2).toHaveBeenCalledWith('hello');
  });
});

describe('SimulationClock', () => {
  it('should create with default config', () => {
    const clock = new SimulationClock({}, async () => {});
    expect(clock).toBeDefined();
  });

  it('should create with custom speed', () => {
    const clock = new SimulationClock(
      { speedMultiplier: 2 },
      async () => {},
    );
    expect(clock).toBeDefined();
  });
});

describe('SimulationController', () => {
  it('should create with session id', () => {
    const ctrl = new SimulationController('test-session');
    expect(ctrl).toBeDefined();
  });

  it('should initialize and stop cleanly', async () => {
    const ctrl = new SimulationController('test-session');
    await ctrl.initialize();
    await ctrl.stop();
  });

  it('should register a sub-engine', async () => {
    const ctrl = new SimulationController('test-session');
    const engine = {
      name: 'mock-engine',
      initialize: vi.fn().mockResolvedValue(undefined),
      tick: vi.fn().mockResolvedValue(undefined),
      shutdown: vi.fn().mockResolvedValue(undefined),
    };
    ctrl.registerEngine(engine);
    await ctrl.initialize();
    expect(engine.initialize).toHaveBeenCalled();
    await ctrl.stop();
    expect(engine.shutdown).toHaveBeenCalled();
  });
});
