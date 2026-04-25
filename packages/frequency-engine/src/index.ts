/**
 * @biofield/frequency-engine
 * Solfeggio, Schumann resonance, brainwave band analysis
 * and binaural beat generation for BIOFIELD OS.
 */

// ═══════════════════════════════════════════════════════════
// Solfeggio Frequencies
// ═══════════════════════════════════════════════════════════

export const SOLFEGGIO: Record<string, number> = {
  Foundation:       174,
  QuantumCognition: 285,
  Liberation:       396,
  Transformation:   417,
  DNARepair:        528,
  Connection:       639,
  Expression:       741,
  Intuition:        852,
  Crown:            963,
} as const;

export type SolfeggioName = keyof typeof SOLFEGGIO;

/** All 9 solfeggio frequencies in ascending Hz order */
export const SOLFEGGIO_FREQS = Object.values(SOLFEGGIO).sort((a, b) => a - b);


// ═══════════════════════════════════════════════════════════
// Schumann Resonances
// ═══════════════════════════════════════════════════════════

export const SCHUMANN = [7.83, 14.3, 20.8, 27.3, 33.8] as const;
export type SchumannHarmonic = (typeof SCHUMANN)[number];


// ═══════════════════════════════════════════════════════════
// Brainwave Bands
// ═══════════════════════════════════════════════════════════

export interface BrainwaveBand {
  name: string;
  minHz: number;
  maxHz: number;
  description: string;
  associatedStates: string[];
  healingRelevance: string;
}

export const BRAINWAVE_BANDS: BrainwaveBand[] = [
  {
    name: "delta",
    minHz: 0.5, maxHz: 4.0,
    description: "Deep sleep and healing",
    associatedStates: ["deep sleep", "unconscious healing", "immune boost"],
    healingRelevance: "Growth hormone release, cellular repair, memory consolidation",
  },
  {
    name: "theta",
    minHz: 4.0, maxHz: 8.0,
    description: "Meditation and creativity",
    associatedStates: ["deep meditation", "REM sleep", "creative flow", "emotional processing"],
    healingRelevance: "Pain relief, trauma processing, access to subconscious",
  },
  {
    name: "alpha",
    minHz: 8.0, maxHz: 13.0,
    description: "Relaxed focus and flow",
    associatedStates: ["eyes closed relaxation", "light meditation", "calm focus"],
    healingRelevance: "Stress reduction, serotonin production, mental clarity",
  },
  {
    name: "beta",
    minHz: 13.0, maxHz: 30.0,
    description: "Active thinking and engagement",
    associatedStates: ["normal waking consciousness", "active problem solving", "anxiety"],
    healingRelevance: "Alertness, logical thinking; excess linked to stress",
  },
  {
    name: "gamma",
    minHz: 30.0, maxHz: 100.0,
    description: "Peak performance and insight",
    associatedStates: ["peak performance", "high cognitive processing", "spiritual states"],
    healingRelevance: "Memory binding, consciousness expansion, compassion (40Hz link)",
  },
];

export function classifyBrainwaveBand(hz: number): BrainwaveBand | null {
  return BRAINWAVE_BANDS.find(b => hz >= b.minHz && hz < b.maxHz) ?? null;
}


// ═══════════════════════════════════════════════════════════
// Waveform Generators
// ═══════════════════════════════════════════════════════════

/**
 * Generate a solfeggio frequency sample (fundamental + 2 harmonics).
 * @param freqHz  Solfeggio frequency in Hz
 * @param timeMs  Position in time (milliseconds)
 * @param amplitudeDb  Gain in dB (default 0 = unity)
 */
export function solfeggio(freqHz: number, timeMs: number, amplitudeDb = 0): number {
  const t = timeMs / 1000;
  const a = 10 ** (amplitudeDb / 20);
  return a * (
    Math.sin(2 * Math.PI * freqHz * t) +
    0.25 * Math.sin(2 * Math.PI * 3 * freqHz * t) +
    0.125 * Math.sin(2 * Math.PI * 5 * freqHz * t)
  );
}

/**
 * Composite Schumann resonance signal (all 5 harmonics).
 */
export function schumannSignal(timeMs: number, amplitude = 1.0): number {
  const t = timeMs / 1000;
  return SCHUMANN.reduce((sum, f, i) => {
    const decay = 0.65 ** i;
    return sum + decay * amplitude * Math.sin(2 * Math.PI * f * t);
  }, 0);
}

/**
 * Binaural beat — returns left or right channel sample.
 * Left: baseHz, Right: baseHz + beatHz.
 * @param channel "left" | "right"
 */
export function binauralBeat(
  baseHz: number,
  beatHz: number,
  timeMs: number,
  channel: "left" | "right" = "left",
): number {
  const t = timeMs / 1000;
  const freq = channel === "left" ? baseHz : baseHz + beatHz;
  return Math.sin(2 * Math.PI * freq * t);
}


// ═══════════════════════════════════════════════════════════
// EEG / Coherence Analysis
// ═══════════════════════════════════════════════════════════

export interface EEGReading {
  hz: number;
  amplitudeUv: number;
  channel?: string;
}

/** Power (μV²) in each brainwave band, as percentage of total power */
export function computeBandPower(readings: EEGReading[]): Record<string, number> {
  const power: Record<string, number> = { delta: 0, theta: 0, alpha: 0, beta: 0, gamma: 0, other: 0 };
  let total = 0;

  for (const r of readings) {
    const p = r.amplitudeUv ** 2;
    total += p;
    const band = classifyBrainwaveBand(r.hz)?.name ?? "other";
    power[band] = (power[band] ?? 0) + p;
  }

  if (total === 0) return power;
  return Object.fromEntries(Object.entries(power).map(([k, v]) => [k, Math.round((v / total) * 1000) / 10]));
}

/** Returns the dominant brainwave band name */
export function dominantBand(readings: EEGReading[]): string {
  const powers = computeBandPower(readings);
  return Object.entries(powers)
    .filter(([k]) => k !== "other")
    .sort(([, a], [, b]) => b - a)[0]?.[0] ?? "alpha";
}

/**
 * Schumann coherence score (0–100):
 * Measures how much EEG power aligns with Schumann harmonics (±0.5 Hz).
 */
export function schumannCoherence(readings: EEGReading[]): number {
  if (readings.length === 0) return 0;
  const totalPower = readings.reduce((s, r) => s + r.amplitudeUv ** 2, 0);
  if (totalPower === 0) return 0;

  const alignedPower = readings
    .filter(r => SCHUMANN.some(f => Math.abs(r.hz - f) <= 0.5))
    .reduce((s, r) => s + r.amplitudeUv ** 2, 0);

  return Math.round((alignedPower / totalPower) * 100);
}

/**
 * HRV coherence score (0–100) from R-R intervals (ms).
 * Simple LF/HF ratio proxy using inter-beat variability.
 */
export function hrvCoherence(rrIntervalsMs: number[]): number {
  if (rrIntervalsMs.length < 4) return 50;
  const mean = rrIntervalsMs.reduce((s, v) => s + v, 0) / rrIntervalsMs.length;
  const sdnn = Math.sqrt(rrIntervalsMs.reduce((s, v) => s + (v - mean) ** 2, 0) / rrIntervalsMs.length);
  // SDNN 50ms = coherence ~60%, 100ms = ~90%, linear interpolation up to 100
  return Math.min(100, Math.round(40 + sdnn * 0.6));
}

/**
 * Solfeggio alignment score (0–100):
 * How much of the reading power falls on known solfeggio frequencies (±3 Hz).
 */
export function solfeggioAlignmentScore(readings: EEGReading[]): number {
  if (readings.length === 0) return 0;
  const total = readings.reduce((s, r) => s + r.amplitudeUv ** 2, 0);
  if (total === 0) return 0;
  const aligned = readings
    .filter(r => SOLFEGGIO_FREQS.some(f => Math.abs(r.hz - f) <= 3))
    .reduce((s, r) => s + r.amplitudeUv ** 2, 0);
  return Math.round((aligned / total) * 100);
}


// ═══════════════════════════════════════════════════════════
// Binaural Presets
// ═══════════════════════════════════════════════════════════

export interface BinauralPreset {
  id: string;
  name: string;
  baseHz: number;
  beatHz: number;
  targetBand: string;
  solfeggioCarrier?: number;
  description: string;
  useCase: string;
}

export const BINAURAL_PRESETS: BinauralPreset[] = [
  {
    id: "deep-healing-sleep",
    name: "Deep Healing Sleep",
    baseHz: 200, beatHz: 2,
    targetBand: "delta",
    description: "2 Hz delta beat for deep restorative sleep",
    useCase: "Recovery, immune boost, injury healing",
  },
  {
    id: "meditative-flow",
    name: "Meditative Flow",
    baseHz: 200, beatHz: 6,
    targetBand: "theta",
    description: "6 Hz theta beat for deep meditation",
    useCase: "Emotional processing, creative insight, pain relief",
  },
  {
    id: "relaxed-performance",
    name: "Relaxed Performance",
    baseHz: 528, beatHz: 10,
    targetBand: "alpha",
    solfeggioCarrier: 528,
    description: "10 Hz alpha beat on DNA Repair (528 Hz) carrier",
    useCase: "Pre-game calm focus, flow state entry",
  },
  {
    id: "peak-focus",
    name: "Peak Focus",
    baseHz: 741, beatHz: 20,
    targetBand: "beta",
    solfeggioCarrier: 741,
    description: "20 Hz beta beat on Expression (741 Hz) carrier",
    useCase: "Strategic analysis, in-game concentration",
  },
  {
    id: "gamma-peak-state",
    name: "Gamma Peak State",
    baseHz: 963, beatHz: 40,
    targetBand: "gamma",
    solfeggioCarrier: 963,
    description: "40 Hz gamma on Crown frequency (963 Hz)",
    useCase: "Peak cognitive performance, pattern recognition",
  },
  {
    id: "earth-resonance",
    name: "Earth Resonance",
    baseHz: 200, beatHz: 7.83,
    targetBand: "theta",
    description: "7.83 Hz Schumann fundamental as binaural beat",
    useCase: "Grounding, nervous system regulation, recovery",
  },
];

export function getBinauralPreset(id: string): BinauralPreset | undefined {
  return BINAURAL_PRESETS.find(p => p.id === id);
}
