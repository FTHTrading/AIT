// ─── BIOFIELD OS — Signal Engine ───
// Waveform generation, signal program playback, channel management.
// Generates physiological waveforms per tick: ECG, SpO2, capnography, EEG,
// ventilator pressure, EMG, PPG, and custom.

import type {
  SignalType,
  SignalProgram,
  SignalChannel,
  SignalConstraint,
} from '@biofield/types';
import type { SubEngine, TickContext, EventBus } from '@biofield/core-engine';

// ═══════════════════════════════════════════════
// Waveform Generator Interface
// ═══════════════════════════════════════════════

export interface WaveformGenerator {
  id: string;
  signalType: SignalType;
  /** Generate a single sample at the given simulation time. */
  sample(timeMs: number, params: WaveformParams): number;
}

export interface WaveformParams {
  sampleRateHz: number;
  amplitudeRange: [number, number];
  baselineValue: number;
  noiseLevel: number;
  /** Derived from organ states — injected per-tick. */
  heartRateBpm?: number;
  respiratoryRate?: number;
  spo2Pct?: number;
}

// ═══════════════════════════════════════════════
// Built-in Waveform Generators
// ═══════════════════════════════════════════════

function clampToRange(val: number, range: [number, number]): number {
  return Math.max(range[0], Math.min(range[1], val));
}

function noise(level: number): number {
  return (Math.random() - 0.5) * 2 * level;
}

/** Simplified ECG-like waveform (PQRST morphology). */
const ecgGenerator: WaveformGenerator = {
  id: 'ecg-pqrst',
  signalType: 'ecg',
  sample(timeMs, p) {
    const bpm = p.heartRateBpm ?? 72;
    const periodMs = 60000 / bpm;
    const phase = (timeMs % periodMs) / periodMs;
    let v = p.baselineValue;
    // P wave ~0.08-0.12
    if (phase > 0.08 && phase < 0.12) v += (p.amplitudeRange[1] - p.baselineValue) * 0.15;
    // QRS complex ~0.16-0.22
    if (phase > 0.16 && phase < 0.18) v -= (p.baselineValue - p.amplitudeRange[0]) * 0.2;
    if (phase > 0.18 && phase < 0.20) v += (p.amplitudeRange[1] - p.baselineValue) * 1.0;
    if (phase > 0.20 && phase < 0.22) v -= (p.baselineValue - p.amplitudeRange[0]) * 0.3;
    // T wave ~0.30-0.40
    if (phase > 0.30 && phase < 0.40) v += (p.amplitudeRange[1] - p.baselineValue) * 0.25;
    return clampToRange(v + noise(p.noiseLevel), p.amplitudeRange);
  },
};

/** SpO2 plethysmograph — sinusoidal with dicrotic notch. */
const spo2Generator: WaveformGenerator = {
  id: 'spo2-pleth',
  signalType: 'spo2',
  sample(timeMs, p) {
    const bpm = p.heartRateBpm ?? 72;
    const periodMs = 60000 / bpm;
    const phase = (timeMs % periodMs) / periodMs;
    const amp = p.amplitudeRange[1] - p.amplitudeRange[0];
    // Systolic upstroke + dicrotic notch
    let v = p.amplitudeRange[0] + amp * Math.pow(Math.sin(Math.PI * phase), 2);
    if (phase > 0.4 && phase < 0.5) v -= amp * 0.08;
    return clampToRange(v + noise(p.noiseLevel), p.amplitudeRange);
  },
};

/** Capnography — CO2 waveform linked to respiratory cycle. */
const capnographyGenerator: WaveformGenerator = {
  id: 'capno-co2',
  signalType: 'capnography',
  sample(timeMs, p) {
    const rr = p.respiratoryRate ?? 14;
    const periodMs = 60000 / rr;
    const phase = (timeMs % periodMs) / periodMs;
    const amp = p.amplitudeRange[1] - p.amplitudeRange[0];
    let v = p.amplitudeRange[0];
    // Expiratory upstroke
    if (phase > 0.1 && phase < 0.25) v += amp * ((phase - 0.1) / 0.15);
    // Alveolar plateau
    else if (phase > 0.25 && phase < 0.55) v += amp * 0.95;
    // Inspiratory downstroke
    else if (phase > 0.55 && phase < 0.65) v += amp * (1 - (phase - 0.55) / 0.10);
    return clampToRange(v + noise(p.noiseLevel), p.amplitudeRange);
  },
};

/** EEG — band-limited random oscillation. */
const eegGenerator: WaveformGenerator = {
  id: 'eeg-alpha',
  signalType: 'eeg',
  sample(timeMs, p) {
    const freqHz = 10; // alpha band
    const t = timeMs / 1000;
    const v = p.baselineValue + (p.amplitudeRange[1] - p.baselineValue) * 0.5
      * (Math.sin(2 * Math.PI * freqHz * t)
       + 0.3 * Math.sin(2 * Math.PI * 22 * t)
       + 0.15 * Math.sin(2 * Math.PI * 3 * t));
    return clampToRange(v + noise(p.noiseLevel), p.amplitudeRange);
  },
};

/** Ventilator pressure waveform — square/ramp inspiration, passive expiration. */
const ventilatorGenerator: WaveformGenerator = {
  id: 'vent-pressure',
  signalType: 'ventilator_waveform',
  sample(timeMs, p) {
    const rr = p.respiratoryRate ?? 14;
    const periodMs = 60000 / rr;
    const phase = (timeMs % periodMs) / periodMs;
    const pip = p.amplitudeRange[1];
    const peep = p.amplitudeRange[0];
    const ieRatio = 0.33; // I:E = 1:2
    let v: number;
    if (phase < ieRatio) {
      v = peep + (pip - peep) * (phase / ieRatio);
    } else {
      const expPhase = (phase - ieRatio) / (1 - ieRatio);
      v = pip - (pip - peep) * (1 - Math.exp(-3 * expPhase));
    }
    return clampToRange(v + noise(p.noiseLevel), p.amplitudeRange);
  },
};

/** EMG — burst noise pattern. */
const emgGenerator: WaveformGenerator = {
  id: 'emg-burst',
  signalType: 'emg',
  sample(timeMs, p) {
    const v = p.baselineValue + noise(p.amplitudeRange[1] - p.baselineValue);
    return clampToRange(v, p.amplitudeRange);
  },
};

/** PPG — photoplethysmogram, similar to SpO2 but analog. */
const ppgGenerator: WaveformGenerator = {
  id: 'ppg-analog',
  signalType: 'ppg',
  sample(timeMs, p) {
    return spo2Generator.sample(timeMs, p); // Same morphology
  },
};

// Generator registry
const BUILTIN_GENERATORS = new Map<string, WaveformGenerator>([
  [ecgGenerator.id, ecgGenerator],
  [spo2Generator.id, spo2Generator],
  [capnographyGenerator.id, capnographyGenerator],
  [eegGenerator.id, eegGenerator],
  [ventilatorGenerator.id, ventilatorGenerator],
  [emgGenerator.id, emgGenerator],
  [ppgGenerator.id, ppgGenerator],
]);

// ═══════════════════════════════════════════════
// Active Channel — runtime state per channel
// ═══════════════════════════════════════════════

interface ActiveChannel {
  config: SignalChannel;
  generator: WaveformGenerator;
  params: WaveformParams;
  lastSample: number;
  buffer: Float64Array;
  bufferWriteIdx: number;
}

// ═══════════════════════════════════════════════
// Signal Engine
// ═══════════════════════════════════════════════

export class SignalEngine implements SubEngine {
  readonly name = 'signal-engine';
  private activeChannels: ActiveChannel[] = [];
  private activeProgram: SignalProgram | null = null;
  private programStartMs = 0;
  private bus: EventBus | null = null;
  private customGenerators = new Map<string, WaveformGenerator>();

  /** Buffer size per channel (rolling window at 500Hz = 5s ~2500 samples) */
  static BUFFER_SIZE = 2500;

  constructor(bus?: EventBus) {
    this.bus = bus ?? null;
  }

  registerGenerator(gen: WaveformGenerator): void {
    this.customGenerators.set(gen.id, gen);
  }

  async initialize(): Promise<void> {
    this.activeChannels = [];
    this.activeProgram = null;
  }

  async tick(ctx: TickContext): Promise<void> {
    // Check program duration
    if (this.activeProgram && !this.activeProgram.looping) {
      const elapsed = ctx.elapsedMs - this.programStartMs;
      if (elapsed >= this.activeProgram.durationMs) {
        this.activeProgram = null;
        this.activeChannels = [];
        if (this.bus) await this.bus.emit('signal.program.completed', {});
        return;
      }
    }

    for (const ch of this.activeChannels) {
      ch.lastSample = ch.generator.sample(ctx.elapsedMs, ch.params);
      ch.buffer[ch.bufferWriteIdx % SignalEngine.BUFFER_SIZE] = ch.lastSample;
      ch.bufferWriteIdx++;
    }

    if (this.bus) {
      await this.bus.emit('signal.samples', {
        timestampMs: ctx.elapsedMs,
        channels: this.activeChannels.map((ch) => ({
          channelId: ch.config.id,
          signalType: ch.config.signalType,
          value: ch.lastSample,
        })),
      });
    }
  }

  async shutdown(): Promise<void> {
    this.activeChannels = [];
    this.activeProgram = null;
  }

  // ── Program Management ──

  loadProgram(program: SignalProgram, startMs: number): void {
    this.activeProgram = program;
    this.programStartMs = startMs;
    this.activeChannels = program.channels.map((ch) => {
      const gen = this.resolveGenerator(ch.waveformGeneratorId, ch.signalType);
      return {
        config: ch,
        generator: gen,
        params: {
          sampleRateHz: ch.sampleRateHz,
          amplitudeRange: ch.amplitudeRange,
          baselineValue: ch.baselineValue,
          noiseLevel: ch.noiseLevel,
        },
        lastSample: ch.baselineValue,
        buffer: new Float64Array(SignalEngine.BUFFER_SIZE),
        bufferWriteIdx: 0,
      };
    });
  }

  /** Inject organ-derived parameters (heart rate, resp rate, etc.) */
  updatePhysiologicalParams(params: Partial<WaveformParams>): void {
    for (const ch of this.activeChannels) {
      Object.assign(ch.params, params);
    }
  }

  getActiveChannelSamples(): { channelId: string; signalType: SignalType; value: number }[] {
    return this.activeChannels.map((ch) => ({
      channelId: ch.config.id,
      signalType: ch.config.signalType,
      value: ch.lastSample,
    }));
  }

  getChannelBuffer(channelId: string): Float64Array | undefined {
    const ch = this.activeChannels.find((c) => c.config.id === channelId);
    return ch?.buffer;
  }

  private resolveGenerator(generatorId: string, signalType: SignalType): WaveformGenerator {
    const custom = this.customGenerators.get(generatorId);
    if (custom) return custom;

    const builtin = BUILTIN_GENERATORS.get(generatorId);
    if (builtin) return builtin;

    // Fallback: pick a default by signal type
    for (const gen of BUILTIN_GENERATORS.values()) {
      if (gen.signalType === signalType) return gen;
    }

    // Last resort: sine wave
    return {
      id: 'fallback-sine',
      signalType,
      sample(timeMs, p) {
        const v = p.baselineValue + (p.amplitudeRange[1] - p.baselineValue) * 0.5
          * Math.sin(2 * Math.PI * timeMs / 1000);
        return clampToRange(v + noise(p.noiseLevel), p.amplitudeRange);
      },
    };
  }
}

export { BUILTIN_GENERATORS };
