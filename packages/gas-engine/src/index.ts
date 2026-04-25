// ─── BIOFIELD OS — Gas Engine ───
// Gas circuit modeling, multi-channel mixing, flow calculations,
// command execution with ramp support.

import type {
  GasType,
  GasCircuitState,
  GasChannelReading,
  GasCommand,
} from '@biofield/types';
import type { SubEngine, TickContext, EventBus } from '@biofield/core-engine';

// ═══════════════════════════════════════════════
// Channel — individual gas flow channel
// ═══════════════════════════════════════════════

interface ChannelState {
  gasType: GasType;
  flowLpm: number;
  concentrationPct: number;
  pressureKpa: number;
  valvePositionPct: number;
}

interface ActiveRamp {
  channelIndex: number;
  startFlowLpm: number;
  targetFlowLpm: number;
  startConcentrationPct: number;
  targetConcentrationPct: number;
  startMs: number;
  durationMs: number;
}

// ═══════════════════════════════════════════════
// Gas Engine
// ═══════════════════════════════════════════════

export class GasEngine implements SubEngine {
  readonly name = 'gas-engine';
  private channels: ChannelState[] = [];
  private ramps: ActiveRamp[] = [];
  private bus: EventBus | null = null;
  private profileId = '';

  // Default channel preset: O2 + Air
  private static DEFAULT_CHANNELS: ChannelState[] = [
    { gasType: 'O2', flowLpm: 0, concentrationPct: 21, pressureKpa: 101.3, valvePositionPct: 0 },
    { gasType: 'air', flowLpm: 0, concentrationPct: 79, pressureKpa: 101.3, valvePositionPct: 0 },
  ];

  constructor(bus?: EventBus) {
    this.bus = bus ?? null;
  }

  setProfile(profileId: string): void {
    this.profileId = profileId;
  }

  async initialize(): Promise<void> {
    this.channels = GasEngine.DEFAULT_CHANNELS.map((ch) => ({ ...ch }));
    this.ramps = [];
  }

  async tick(ctx: TickContext): Promise<void> {
    this.advanceRamps(ctx.elapsedMs);
    this.recalcMixture();
    if (this.bus) {
      await this.bus.emit('gas.state.updated', this.getState(ctx.elapsedMs));
    }
  }

  async shutdown(): Promise<void> {
    this.ramps = [];
  }

  // ── Command Execution ──

  executeCommand(cmd: GasCommand, currentMs: number): boolean {
    const idx = this.findOrCreateChannel(cmd.gasType);
    if (cmd.rampDurationMs <= 0) {
      // Instant set
      this.channels[idx].flowLpm = cmd.targetFlowLpm;
      this.channels[idx].concentrationPct = cmd.targetConcentrationPct;
      this.channels[idx].valvePositionPct = cmd.targetFlowLpm > 0 ? 100 : 0;
    } else {
      // Ramp
      this.ramps.push({
        channelIndex: idx,
        startFlowLpm: this.channels[idx].flowLpm,
        targetFlowLpm: cmd.targetFlowLpm,
        startConcentrationPct: this.channels[idx].concentrationPct,
        targetConcentrationPct: cmd.targetConcentrationPct,
        startMs: currentMs,
        durationMs: cmd.rampDurationMs,
      });
    }
    return true;
  }

  // ── Queries ──

  getState(timestampMs: number): GasCircuitState {
    const channelReadings: GasChannelReading[] = this.channels.map((ch) => ({
      gasType: ch.gasType,
      flowLpm: ch.flowLpm,
      concentrationPct: ch.concentrationPct,
      pressureKpa: ch.pressureKpa,
      valvePositionPct: ch.valvePositionPct,
    }));
    const totalFlow = this.channels.reduce((s, ch) => s + ch.flowLpm, 0);
    return {
      id: '',
      profileId: this.profileId,
      timestampMs,
      channels: channelReadings,
      totalFlowLpm: totalFlow,
      mixturePct: this.calculateMixture(),
      deliveryPressureKpa: this.avgPressure(),
      humidityPct: 100,
      temperatureC: 37,
    };
  }

  getChannelByGas(gasType: GasType): ChannelState | undefined {
    return this.channels.find((ch) => ch.gasType === gasType);
  }

  // ── Internal ──

  private advanceRamps(currentMs: number): void {
    const completed: number[] = [];
    for (let i = 0; i < this.ramps.length; i++) {
      const r = this.ramps[i];
      const elapsed = currentMs - r.startMs;
      const t = Math.min(elapsed / r.durationMs, 1);
      const ch = this.channels[r.channelIndex];
      ch.flowLpm = r.startFlowLpm + (r.targetFlowLpm - r.startFlowLpm) * t;
      ch.concentrationPct = r.startConcentrationPct + (r.targetConcentrationPct - r.startConcentrationPct) * t;
      ch.valvePositionPct = ch.flowLpm > 0 ? Math.min(100, (ch.flowLpm / 15) * 100) : 0;
      if (t >= 1) completed.push(i);
    }
    for (let i = completed.length - 1; i >= 0; i--) {
      this.ramps.splice(completed[i], 1);
    }
  }

  private recalcMixture(): void {
    // Valve positions track flow proportionately
    const totalFlow = this.channels.reduce((s, ch) => s + ch.flowLpm, 0);
    if (totalFlow === 0) return;
    for (const ch of this.channels) {
      ch.valvePositionPct = (ch.flowLpm / totalFlow) * 100;
    }
  }

  private calculateMixture(): Record<GasType, number> {
    const totalFlow = this.channels.reduce((s, ch) => s + ch.flowLpm, 0);
    const mix: Partial<Record<GasType, number>> = {};
    for (const ch of this.channels) {
      const pct = totalFlow > 0 ? (ch.flowLpm / totalFlow) * 100 : 0;
      mix[ch.gasType] = (mix[ch.gasType] ?? 0) + pct;
    }
    return mix as Record<GasType, number>;
  }

  private avgPressure(): number {
    if (this.channels.length === 0) return 101.3;
    return this.channels.reduce((s, ch) => s + ch.pressureKpa, 0) / this.channels.length;
  }

  private findOrCreateChannel(gasType: GasType): number {
    const idx = this.channels.findIndex((ch) => ch.gasType === gasType);
    if (idx >= 0) return idx;
    this.channels.push({
      gasType,
      flowLpm: 0,
      concentrationPct: 0,
      pressureKpa: 101.3,
      valvePositionPct: 0,
    });
    return this.channels.length - 1;
  }
}
