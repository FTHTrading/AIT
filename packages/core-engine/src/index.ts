// ─── BIOFIELD OS — Core Engine ───
// Simulation clock, tick loop, event bus, session lifecycle.

import type {
  SimulationMode,
  SessionStatus,
  OrganSystem,
  OrganState,
  GasCircuitState,
} from '@biofield/types';

// ═══════════════════════════════════════════════
// Event Bus — in-process pub/sub
// ═══════════════════════════════════════════════

export type EventHandler<T = unknown> = (payload: T) => void | Promise<void>;

export class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  on<T>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    const set = this.handlers.get(event)!;
    set.add(handler as EventHandler);
    return () => { set.delete(handler as EventHandler); };
  }

  async emit<T>(event: string, payload: T): Promise<void> {
    const set = this.handlers.get(event);
    if (!set) return;
    const promises: Promise<void>[] = [];
    for (const handler of set) {
      const result = handler(payload);
      if (result instanceof Promise) promises.push(result);
    }
    if (promises.length) await Promise.all(promises);
  }

  clear(): void {
    this.handlers.clear();
  }
}

// ═══════════════════════════════════════════════
// Simulation Clock
// ═══════════════════════════════════════════════

export interface ClockConfig {
  tickIntervalMs: number;      // default 10
  speedMultiplier: number;     // 1.0 = real time
  maxTicksPerFrame: number;    // prevent runaway
}

export interface TickContext {
  tickNumber: number;
  elapsedMs: number;           // simulated elapsed
  wallClockMs: number;         // real wall clock
  deltaMs: number;             // simulated delta for this tick
}

export class SimulationClock {
  private tickNumber = 0;
  private elapsedMs = 0;
  private wallStart = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private _status: SessionStatus = 'idle';
  private config: ClockConfig;
  private onTick: (ctx: TickContext) => Promise<void>;

  constructor(config: Partial<ClockConfig>, onTick: (ctx: TickContext) => Promise<void>) {
    this.config = {
      tickIntervalMs: config.tickIntervalMs ?? 10,
      speedMultiplier: config.speedMultiplier ?? 1.0,
      maxTicksPerFrame: config.maxTicksPerFrame ?? 5,
    };
    this.onTick = onTick;
  }

  get status(): SessionStatus { return this._status; }
  get currentTick(): number { return this.tickNumber; }
  get currentElapsedMs(): number { return this.elapsedMs; }

  start(): void {
    if (this._status === 'running') return;
    this._status = 'running';
    this.wallStart = Date.now();
    this.timer = setInterval(() => this.tick(), this.config.tickIntervalMs);
  }

  pause(): void {
    if (this._status !== 'running') return;
    this._status = 'paused';
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  resume(): void {
    if (this._status !== 'paused') return;
    this._status = 'running';
    this.timer = setInterval(() => this.tick(), this.config.tickIntervalMs);
  }

  stop(): void {
    this._status = 'completed';
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  abort(): void {
    this._status = 'aborted';
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  setSpeed(multiplier: number): void {
    this.config.speedMultiplier = multiplier;
  }

  private async tick(): Promise<void> {
    if (this._status !== 'running') return;
    const deltaMs = this.config.tickIntervalMs * this.config.speedMultiplier;
    this.tickNumber++;
    this.elapsedMs += deltaMs;
    const ctx: TickContext = {
      tickNumber: this.tickNumber,
      elapsedMs: this.elapsedMs,
      wallClockMs: Date.now() - this.wallStart,
      deltaMs,
    };
    await this.onTick(ctx);
  }
}

// ═══════════════════════════════════════════════
// Engine Registry — plug-in point for sub-engines
// ═══════════════════════════════════════════════

export interface SubEngine {
  name: string;
  initialize(): Promise<void>;
  tick(ctx: TickContext): Promise<void>;
  shutdown(): Promise<void>;
}

// ═══════════════════════════════════════════════
// Simulation Session Controller
// ═══════════════════════════════════════════════

export class SimulationController {
  readonly bus: EventBus;
  private clock: SimulationClock;
  private engines: SubEngine[] = [];
  private _sessionId: string;

  constructor(sessionId: string, config?: Partial<ClockConfig>) {
    this._sessionId = sessionId;
    this.bus = new EventBus();
    this.clock = new SimulationClock(config ?? {}, (ctx) => this.onTick(ctx));
  }

  get sessionId(): string { return this._sessionId; }
  get status(): SessionStatus { return this.clock.status; }
  get tickNumber(): number { return this.clock.currentTick; }
  get elapsedMs(): number { return this.clock.currentElapsedMs; }

  registerEngine(engine: SubEngine): void {
    this.engines.push(engine);
  }

  async initialize(): Promise<void> {
    for (const eng of this.engines) {
      await eng.initialize();
    }
    await this.bus.emit('session.initialized', { sessionId: this._sessionId });
  }

  async start(): Promise<void> {
    await this.initialize();
    this.clock.start();
    await this.bus.emit('session.state.changed', { sessionId: this._sessionId, from: 'idle', to: 'running' });
  }

  async pause(): Promise<void> {
    this.clock.pause();
    await this.bus.emit('session.state.changed', { sessionId: this._sessionId, from: 'running', to: 'paused' });
  }

  async resume(): Promise<void> {
    this.clock.resume();
    await this.bus.emit('session.state.changed', { sessionId: this._sessionId, from: 'paused', to: 'running' });
  }

  async stop(): Promise<void> {
    this.clock.stop();
    for (const eng of this.engines) {
      await eng.shutdown();
    }
    await this.bus.emit('session.state.changed', { sessionId: this._sessionId, from: 'running', to: 'completed' });
    this.bus.clear();
  }

  async emergencyStop(reason: string, triggeredBy: string): Promise<void> {
    this.clock.abort();
    await this.bus.emit('emergency.stop', { sessionId: this._sessionId, reason, triggeredBy });
    for (const eng of this.engines) {
      await eng.shutdown();
    }
    this.bus.clear();
  }

  setSpeed(multiplier: number): void {
    this.clock.setSpeed(multiplier);
  }

  private async onTick(ctx: TickContext): Promise<void> {
    for (const eng of this.engines) {
      await eng.tick(ctx);
    }
    await this.bus.emit('tick', ctx);
  }
}

export { SimulationClock as Clock };
