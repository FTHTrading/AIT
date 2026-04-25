// ─── BIOFIELD OS — Organ Models ───
// ODE-based organ system models: lung, cardiac, renal, metabolic, inflammatory.
// Each model advances its state per tick based on gas inputs, signals, and
// cross-organ coupling.

import type {
  OrganSystem,
  OrganState,
  LungState,
  CardiacState,
  RenalState,
  MetabolicState,
  InflammatoryState,
  GasCircuitState,
} from '@biofield/types';
import type { SubEngine, TickContext, EventBus } from '@biofield/core-engine';

// ═══════════════════════════════════════════════
// ODE Integration — simple Euler step
// ═══════════════════════════════════════════════

function eulerStep(state: number, derivative: number, dtSeconds: number): number {
  return state + derivative * dtSeconds;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// ═══════════════════════════════════════════════
// Organ Model Interface
// ═══════════════════════════════════════════════

export interface OrganModel {
  organ: OrganSystem;
  state: OrganState;
  /** Advance one tick. dtMs is simulated delta. */
  step(dtMs: number, coupling: CrossOrganCoupling): void;
  /** Determine trending direction from recent parameter changes. */
  computeTrending(): OrganState['trending'];
  reset(profileId: string): void;
}

/** Cross-organ coupling inputs provided to each organ model per tick. */
export interface CrossOrganCoupling {
  gasState: GasCircuitState | null;
  lungState: LungState | null;
  cardiacState: CardiacState | null;
  renalState: RenalState | null;
  metabolicState: MetabolicState | null;
  inflammatoryState: InflammatoryState | null;
}

// ═══════════════════════════════════════════════
// Lung Model
// ═══════════════════════════════════════════════

function makeLungState(profileId: string): LungState {
  return {
    id: '', profileId, organ: 'lung', timestampMs: 0, notes: '', trending: 'stable',
    derivedMetrics: {},
    parameters: {
      tidalVolumeMl: 500, respiratoryRate: 14, peepCmH2O: 5, fio2Pct: 21,
      plateauPressureCmH2O: 18, complianceMlCmH2O: 50, pao2Mmhg: 95,
      paco2Mmhg: 40, spo2Pct: 98, etco2Mmhg: 35, minuteVentilationLpm: 7,
    },
  };
}

export class LungModel implements OrganModel {
  organ: OrganSystem = 'lung';
  state: LungState;
  private prev: LungState;

  constructor(profileId: string) {
    this.state = makeLungState(profileId);
    this.prev = makeLungState(profileId);
  }

  step(dtMs: number, c: CrossOrganCoupling): void {
    this.prev = structuredClone(this.state);
    const dt = dtMs / 1000;
    const p = this.state.parameters;
    const gas = c.gasState;

    // FiO2 drives PaO2 via simplified alveolar gas equation
    if (gas) {
      const deliveredFio2 = gas.mixturePct.O2 ?? 21;
      p.fio2Pct = eulerStep(p.fio2Pct, (deliveredFio2 - p.fio2Pct) * 0.5, dt);
    }
    // PaO2 tracks FiO2 with lag  (simplified: PaO2 ≈ FiO2 * 5 - paco2/0.8)
    const targetPao2 = clamp(p.fio2Pct * 5 - p.paco2Mmhg / 0.8, 40, 600);
    p.pao2Mmhg = eulerStep(p.pao2Mmhg, (targetPao2 - p.pao2Mmhg) * 0.2, dt);

    // SpO2 from PaO2 (Hill equation approximation)
    const targetSpo2 = 100 / (1 + Math.pow(26 / Math.max(p.pao2Mmhg, 1), 2.7));
    p.spo2Pct = eulerStep(p.spo2Pct, (targetSpo2 - p.spo2Pct) * 0.3, dt);
    p.spo2Pct = clamp(p.spo2Pct, 0, 100);

    // Minute ventilation = Vt × RR
    p.minuteVentilationLpm = (p.tidalVolumeMl / 1000) * p.respiratoryRate;

    // EtCO2 tracks PaCO2 with small offset
    p.etco2Mmhg = eulerStep(p.etco2Mmhg, (p.paco2Mmhg - 2 - p.etco2Mmhg) * 0.4, dt);

    // Compliance → plateau pressure
    p.plateauPressureCmH2O = p.peepCmH2O + p.tidalVolumeMl / Math.max(p.complianceMlCmH2O, 1);

    // Metabolic coupling: VO2 affects PaCO2
    if (c.metabolicState) {
      const targetCo2 = 40 + (c.metabolicState.parameters.vco2MlMin - 200) * 0.02;
      p.paco2Mmhg = eulerStep(p.paco2Mmhg, (targetCo2 - p.paco2Mmhg) * 0.1, dt);
    }

    this.state.trending = this.computeTrending();
  }

  computeTrending(): OrganState['trending'] {
    const curr = this.state.parameters;
    const prev = this.prev.parameters;
    if (curr.spo2Pct < 85) return 'critical';
    if (curr.spo2Pct < prev.spo2Pct - 1) return 'deteriorating';
    if (curr.spo2Pct > prev.spo2Pct + 0.5) return 'improving';
    return 'stable';
  }

  reset(profileId: string): void {
    this.state = makeLungState(profileId);
    this.prev = makeLungState(profileId);
  }
}

// ═══════════════════════════════════════════════
// Cardiac Model
// ═══════════════════════════════════════════════

function makeCardiacState(profileId: string): CardiacState {
  return {
    id: '', profileId, organ: 'cardiac', timestampMs: 0, notes: '', trending: 'stable',
    derivedMetrics: {},
    parameters: {
      heartRateBpm: 72, systolicMmhg: 120, diastolicMmhg: 80,
      meanArterialPressureMmhg: 93, cardiacOutputLpm: 5.0, strokeVolumeMl: 70,
      svri: 1500, cvpMmhg: 6, ejectionFractionPct: 60,
    },
  };
}

export class CardiacModel implements OrganModel {
  organ: OrganSystem = 'cardiac';
  state: CardiacState;
  private prev: CardiacState;

  constructor(profileId: string) {
    this.state = makeCardiacState(profileId);
    this.prev = makeCardiacState(profileId);
  }

  step(dtMs: number, c: CrossOrganCoupling): void {
    this.prev = structuredClone(this.state);
    const dt = dtMs / 1000;
    const p = this.state.parameters;

    // Cardiac output = HR × SV
    p.cardiacOutputLpm = (p.heartRateBpm * p.strokeVolumeMl) / 1000;

    // MAP = DBP + (SBP - DBP)/3
    p.meanArterialPressureMmhg = p.diastolicMmhg + (p.systolicMmhg - p.diastolicMmhg) / 3;

    // SVRI from MAP, CVP, CO
    if (p.cardiacOutputLpm > 0) {
      p.svri = ((p.meanArterialPressureMmhg - p.cvpMmhg) / p.cardiacOutputLpm) * 80;
    }

    // Hypoxia coupling: low SpO2 → tachycardia
    if (c.lungState) {
      const spo2 = c.lungState.parameters.spo2Pct;
      if (spo2 < 90) {
        const stressHR = 72 + (90 - spo2) * 2;
        p.heartRateBpm = eulerStep(p.heartRateBpm, (stressHR - p.heartRateBpm) * 0.3, dt);
      }
    }

    // Inflammatory coupling: sepsis → vasodilation → lower SVRI, lower MAP
    if (c.inflammatoryState && c.inflammatoryState.parameters.sofaScore > 4) {
      const mapDrop = (c.inflammatoryState.parameters.sofaScore - 4) * 2;
      const targetMAP = 93 - mapDrop;
      p.meanArterialPressureMmhg = eulerStep(
        p.meanArterialPressureMmhg,
        (targetMAP - p.meanArterialPressureMmhg) * 0.15,
        dt,
      );
      p.systolicMmhg = p.meanArterialPressureMmhg * 1.29;
      p.diastolicMmhg = p.meanArterialPressureMmhg * 0.71;
    }

    this.state.trending = this.computeTrending();
  }

  computeTrending(): OrganState['trending'] {
    const p = this.state.parameters;
    if (p.meanArterialPressureMmhg < 60) return 'critical';
    if (p.meanArterialPressureMmhg < this.prev.parameters.meanArterialPressureMmhg - 5) return 'deteriorating';
    if (p.meanArterialPressureMmhg > this.prev.parameters.meanArterialPressureMmhg + 2) return 'improving';
    return 'stable';
  }

  reset(profileId: string): void {
    this.state = makeCardiacState(profileId);
    this.prev = makeCardiacState(profileId);
  }
}

// ═══════════════════════════════════════════════
// Renal Model
// ═══════════════════════════════════════════════

function makeRenalState(profileId: string): RenalState {
  return {
    id: '', profileId, organ: 'renal', timestampMs: 0, notes: '', trending: 'stable',
    derivedMetrics: {},
    parameters: {
      urineOutputMlHr: 50, creatinineMgDl: 1.0, bunMgDl: 15, gfrMlMin: 90,
      serumPotassiumMeqL: 4.0, serumSodiumMeqL: 140, fluidBalanceMl: 0,
    },
  };
}

export class RenalModel implements OrganModel {
  organ: OrganSystem = 'renal';
  state: RenalState;
  private prev: RenalState;

  constructor(profileId: string) {
    this.state = makeRenalState(profileId);
    this.prev = makeRenalState(profileId);
  }

  step(dtMs: number, c: CrossOrganCoupling): void {
    this.prev = structuredClone(this.state);
    const dt = dtMs / 1000;
    const p = this.state.parameters;

    // Renal perfusion depends on MAP (below 65 → AKI risk)
    if (c.cardiacState) {
      const map = c.cardiacState.parameters.meanArterialPressureMmhg;
      if (map < 65) {
        const dropFactor = (65 - map) / 65;
        p.urineOutputMlHr = eulerStep(p.urineOutputMlHr, -p.urineOutputMlHr * dropFactor * 0.05, dt);
        p.gfrMlMin = eulerStep(p.gfrMlMin, -p.gfrMlMin * dropFactor * 0.02, dt);
      } else {
        // Recovery tendency
        p.urineOutputMlHr = eulerStep(p.urineOutputMlHr, (50 - p.urineOutputMlHr) * 0.01, dt);
        p.gfrMlMin = eulerStep(p.gfrMlMin, (90 - p.gfrMlMin) * 0.005, dt);
      }
    }

    // Creatinine rises as GFR drops
    const targetCr = clamp(90 / Math.max(p.gfrMlMin, 1) * 1.0, 0.5, 12);
    p.creatinineMgDl = eulerStep(p.creatinineMgDl, (targetCr - p.creatinineMgDl) * 0.01, dt);

    // Fluid balance accumulates
    p.fluidBalanceMl += (0 - p.urineOutputMlHr / 3600) * dtMs;

    p.urineOutputMlHr = clamp(p.urineOutputMlHr, 0, 300);
    p.gfrMlMin = clamp(p.gfrMlMin, 0, 200);

    this.state.trending = this.computeTrending();
  }

  computeTrending(): OrganState['trending'] {
    const p = this.state.parameters;
    if (p.urineOutputMlHr < 5 || p.creatinineMgDl > 4) return 'critical';
    if (p.gfrMlMin < this.prev.parameters.gfrMlMin - 2) return 'deteriorating';
    if (p.gfrMlMin > this.prev.parameters.gfrMlMin + 1) return 'improving';
    return 'stable';
  }

  reset(profileId: string): void {
    this.state = makeRenalState(profileId);
    this.prev = makeRenalState(profileId);
  }
}

// ═══════════════════════════════════════════════
// Metabolic Model
// ═══════════════════════════════════════════════

function makeMetabolicState(profileId: string): MetabolicState {
  return {
    id: '', profileId, organ: 'metabolic', timestampMs: 0, notes: '', trending: 'stable',
    derivedMetrics: {},
    parameters: {
      glucoseMgDl: 100, lactateMmolL: 1.0, phArterial: 7.40, hco3MeqL: 24,
      baseExcess: 0, temperatureC: 37.0, vo2MlMin: 250, vco2MlMin: 200,
      respiratoryQuotient: 0.8,
    },
  };
}

export class MetabolicModel implements OrganModel {
  organ: OrganSystem = 'metabolic';
  state: MetabolicState;
  private prev: MetabolicState;

  constructor(profileId: string) {
    this.state = makeMetabolicState(profileId);
    this.prev = makeMetabolicState(profileId);
  }

  step(dtMs: number, c: CrossOrganCoupling): void {
    this.prev = structuredClone(this.state);
    const dt = dtMs / 1000;
    const p = this.state.parameters;

    // RQ = VCO2/VO2
    p.respiratoryQuotient = p.vo2MlMin > 0 ? p.vco2MlMin / p.vo2MlMin : 0.8;

    // Hypoperfusion → lactate rise
    if (c.cardiacState && c.cardiacState.parameters.cardiacOutputLpm < 3.5) {
      const deficit = 3.5 - c.cardiacState.parameters.cardiacOutputLpm;
      p.lactateMmolL = eulerStep(p.lactateMmolL, deficit * 0.5, dt);
    } else {
      // Lactate clearance
      p.lactateMmolL = eulerStep(p.lactateMmolL, (1.0 - p.lactateMmolL) * 0.02, dt);
    }
    p.lactateMmolL = clamp(p.lactateMmolL, 0.3, 20);

    // Lactic acidosis → pH drop
    if (p.lactateMmolL > 2) {
      const acidLoad = (p.lactateMmolL - 2) * 0.015;
      p.phArterial = eulerStep(p.phArterial, -acidLoad, dt);
    } else {
      p.phArterial = eulerStep(p.phArterial, (7.40 - p.phArterial) * 0.01, dt);
    }
    p.phArterial = clamp(p.phArterial, 6.8, 7.8);

    // HCO3 buffering
    p.hco3MeqL = eulerStep(p.hco3MeqL, (24 - p.hco3MeqL) * 0.005, dt);
    p.baseExcess = (p.hco3MeqL - 24) * 1.2;

    this.state.trending = this.computeTrending();
  }

  computeTrending(): OrganState['trending'] {
    const p = this.state.parameters;
    if (p.phArterial < 7.20 || p.lactateMmolL > 8) return 'critical';
    if (p.lactateMmolL > this.prev.parameters.lactateMmolL + 0.5) return 'deteriorating';
    if (p.lactateMmolL < this.prev.parameters.lactateMmolL - 0.2) return 'improving';
    return 'stable';
  }

  reset(profileId: string): void {
    this.state = makeMetabolicState(profileId);
    this.prev = makeMetabolicState(profileId);
  }
}

// ═══════════════════════════════════════════════
// Inflammatory Model
// ═══════════════════════════════════════════════

function makeInflammatoryState(profileId: string): InflammatoryState {
  return {
    id: '', profileId, organ: 'inflammatory', timestampMs: 0, notes: '', trending: 'stable',
    derivedMetrics: {},
    parameters: {
      wbcK: 8.0, cReactiveProteinMgL: 3, procalcitoninNgMl: 0.1, il6PgMl: 5,
      tnfAlphaPgMl: 10, dDimerNgMl: 250, ferritinNgMl: 100, sofaScore: 0,
    },
  };
}

export class InflammatoryModel implements OrganModel {
  organ: OrganSystem = 'inflammatory';
  state: InflammatoryState;
  private prev: InflammatoryState;

  constructor(profileId: string) {
    this.state = makeInflammatoryState(profileId);
    this.prev = makeInflammatoryState(profileId);
  }

  step(dtMs: number, c: CrossOrganCoupling): void {
    this.prev = structuredClone(this.state);
    const dt = dtMs / 1000;
    const p = this.state.parameters;

    // SOFA score composite (simplified: sum of organ dysfunction markers)
    let sofa = 0;
    if (c.lungState && c.lungState.parameters.pao2Mmhg < 200) sofa += 2;
    if (c.cardiacState && c.cardiacState.parameters.meanArterialPressureMmhg < 70) sofa += 2;
    if (c.renalState && c.renalState.parameters.creatinineMgDl > 2) sofa += 2;
    if (c.metabolicState && c.metabolicState.parameters.lactateMmolL > 4) sofa += 2;
    if (p.wbcK > 15 || p.wbcK < 4) sofa += 1;
    p.sofaScore = eulerStep(p.sofaScore, (sofa - p.sofaScore) * 0.1, dt);
    p.sofaScore = clamp(Math.round(p.sofaScore), 0, 24);

    // Inflammatory markers naturally decay toward baseline
    p.cReactiveProteinMgL = eulerStep(p.cReactiveProteinMgL, (3 - p.cReactiveProteinMgL) * 0.005, dt);
    p.procalcitoninNgMl = eulerStep(p.procalcitoninNgMl, (0.1 - p.procalcitoninNgMl) * 0.003, dt);
    p.il6PgMl = eulerStep(p.il6PgMl, (5 - p.il6PgMl) * 0.01, dt);
    p.tnfAlphaPgMl = eulerStep(p.tnfAlphaPgMl, (10 - p.tnfAlphaPgMl) * 0.008, dt);

    this.state.trending = this.computeTrending();
  }

  computeTrending(): OrganState['trending'] {
    const p = this.state.parameters;
    if (p.sofaScore >= 10) return 'critical';
    if (p.sofaScore > this.prev.parameters.sofaScore + 1) return 'deteriorating';
    if (p.sofaScore < this.prev.parameters.sofaScore - 1) return 'improving';
    return 'stable';
  }

  reset(profileId: string): void {
    this.state = makeInflammatoryState(profileId);
    this.prev = makeInflammatoryState(profileId);
  }
}

// ═══════════════════════════════════════════════
// Organ System Engine — wraps all 5 models as SubEngine
// ═══════════════════════════════════════════════

export class OrganSystemEngine implements SubEngine {
  readonly name = 'organ-system';
  readonly lung: LungModel;
  readonly cardiac: CardiacModel;
  readonly renal: RenalModel;
  readonly metabolic: MetabolicModel;
  readonly inflammatory: InflammatoryModel;
  private bus: EventBus | null = null;
  private gasStateFn: (() => GasCircuitState | null) | null = null;

  constructor(profileId: string, bus?: EventBus) {
    this.lung = new LungModel(profileId);
    this.cardiac = new CardiacModel(profileId);
    this.renal = new RenalModel(profileId);
    this.metabolic = new MetabolicModel(profileId);
    this.inflammatory = new InflammatoryModel(profileId);
    this.bus = bus ?? null;
  }

  /** Provide a function that returns current gas circuit state for coupling. */
  setGasStateProvider(fn: () => GasCircuitState | null): void {
    this.gasStateFn = fn;
  }

  async initialize(): Promise<void> {
    // Models are ready at construction
  }

  async tick(ctx: TickContext): Promise<void> {
    const coupling: CrossOrganCoupling = {
      gasState: this.gasStateFn ? this.gasStateFn() : null,
      lungState: this.lung.state as LungState,
      cardiacState: this.cardiac.state as CardiacState,
      renalState: this.renal.state as RenalState,
      metabolicState: this.metabolic.state as MetabolicState,
      inflammatoryState: this.inflammatory.state as InflammatoryState,
    };

    // Step order: lung → cardiac → renal → metabolic → inflammatory
    this.lung.step(ctx.deltaMs, coupling);
    coupling.lungState = this.lung.state as LungState;

    this.cardiac.step(ctx.deltaMs, coupling);
    coupling.cardiacState = this.cardiac.state as CardiacState;

    this.renal.step(ctx.deltaMs, coupling);
    coupling.renalState = this.renal.state as RenalState;

    this.metabolic.step(ctx.deltaMs, coupling);
    coupling.metabolicState = this.metabolic.state as MetabolicState;

    this.inflammatory.step(ctx.deltaMs, coupling);

    // Update timestamps
    for (const model of [this.lung, this.cardiac, this.renal, this.metabolic, this.inflammatory]) {
      model.state.timestampMs = ctx.elapsedMs;
    }

    if (this.bus) {
      await this.bus.emit('organ.states.updated', {
        timestampMs: ctx.elapsedMs,
        lung: this.lung.state,
        cardiac: this.cardiac.state,
        renal: this.renal.state,
        metabolic: this.metabolic.state,
        inflammatory: this.inflammatory.state,
      });
    }
  }

  async shutdown(): Promise<void> {
    // No cleanup needed
  }

  getState(organ: OrganSystem): OrganState {
    switch (organ) {
      case 'lung': return this.lung.state;
      case 'cardiac': return this.cardiac.state;
      case 'renal': return this.renal.state;
      case 'metabolic': return this.metabolic.state;
      case 'inflammatory': return this.inflammatory.state;
    }
  }

  getAllStates(): Record<OrganSystem, OrganState> {
    return {
      lung: this.lung.state,
      cardiac: this.cardiac.state,
      renal: this.renal.state,
      metabolic: this.metabolic.state,
      inflammatory: this.inflammatory.state,
    };
  }
}
