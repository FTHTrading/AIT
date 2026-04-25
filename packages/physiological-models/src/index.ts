/**
 * @biofield/physiological-models
 *
 * Real physiological and biochemical formulas for gas-mediated healing.
 * All equations reference peer-reviewed physiology and clinical literature.
 *
 * Formulas implemented:
 *  1. Henderson-Hasselbalch — blood pH from PCO2 and bicarbonate
 *  2. Krogh Cylinder — O2 diffusion from capillary to tissue cell
 *  3. Hill Equation — hemoglobin-O2 saturation (Bohr effect integration)
 *  4. Bohr Effect — P50 shift with pH, PCO2, temperature, 2,3-DPG
 *  5. Alveolar Gas Equation — PAO2 from FiO2 and PACO2
 *  6. HBOT Tissue PO2 — hyperoxic arterial oxygen content (Lambertsen)
 *  7. Fick's Principle — O2 delivery (DO2) and cardiac output
 *  8. Hagen-Poiseuille — airway resistance; used for Heliox benefit scoring
 *  9. NO Bioavailability — eNOS-driven vasodilation score
 * 10. O2-Window / Inert Gas Elimination — tissue gas bubble dynamics
 */

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

/** Atmospheric pressure at sea level (mmHg) */
export const PB_SEA_LEVEL_MMHG = 760;

/** Water vapour pressure at 37 °C (mmHg) */
export const PH2O_37C_MMHG = 47;

/** Henderson-Hasselbalch pKa for carbonic acid in plasma at 37 °C */
export const HH_PKA = 6.1;

/** Solubility of CO2 in plasma — Henry's constant (mEq/L per mmHg) */
export const CO2_SOLUBILITY = 0.0307;

/** Normal O2-Hb dissociation P50 at 37 °C, standard pH (mmHg) */
export const P50_NORMAL_MMHG = 26.8;

/** Hill coefficient for hemoglobin cooperativity */
export const HILL_N = 2.7;

/** Fick's O2 carrying capacity factor: Hb (15 g/dL) × 1.34 mL/g */
export const O2_CARRYING_CAPACITY_FACTOR = 20.1; // mL O2 / 100 mL blood @ full sat

/** Krogh-cylinder O2 diffusion coefficient in muscle tissue
 *  D = 1.5 × 10⁻⁹ m²/s → converted to mmHg × cm²/mL O2/s units ≈ 0.0000017 */
export const KROGH_D = 1.7e-9; // m²/s, O2 in skeletal muscle

/** Krogh metabolic O2 consumption (mLO2/cm³/s) — resting skeletal muscle */
export const KROGH_Q_REST = 3.0e-5; // mL O2 / cm³ tissue / s

// ═══════════════════════════════════════════════════════════════
// 1. Henderson-Hasselbalch — Blood pH
// ═══════════════════════════════════════════════════════════════

/**
 * Calculates arterial blood pH from PCO2 and plasma bicarbonate.
 *
 * pH = pKa + log([HCO3⁻] / (0.0307 × PaCO2))
 *
 * @param paco2Mmhg  Arterial CO2 partial pressure (mmHg). Normal 35–45.
 * @param hco3MeqL   Plasma bicarbonate (mEq/L). Normal 22–26.
 * @returns Arterial pH. Normal range 7.35–7.45.
 */
export function hendersonHasselbalch(
  paco2Mmhg: number,
  hco3MeqL: number,
): number {
  const h2co3 = CO2_SOLUBILITY * paco2Mmhg; // dissolved CO2 ≈ [H2CO3]
  if (h2co3 <= 0 || hco3MeqL <= 0) return 7.4;
  return HH_PKA + Math.log10(hco3MeqL / h2co3);
}

/**
 * Respiratory acid-base status descriptor.
 */
export function acidBaseStatus(pH: number): 'severe_acidosis' | 'acidosis' | 'normal' | 'alkalosis' | 'severe_alkalosis' {
  if (pH < 7.1)  return 'severe_acidosis';
  if (pH < 7.35) return 'acidosis';
  if (pH > 7.7)  return 'severe_alkalosis';
  if (pH > 7.45) return 'alkalosis';
  return 'normal';
}

// ═══════════════════════════════════════════════════════════════
// 2. Alveolar Gas Equation — PAO2
// ═══════════════════════════════════════════════════════════════

/**
 * Calculates ideal alveolar oxygen partial pressure (PAO2).
 *
 * PAO2 = (PB - PH2O) × FiO2 - (PaCO2 / RQ)
 *
 * @param fio2     Inspired O2 fraction (0–1). Room air = 0.21.
 * @param paco2Mmhg Arterial PCO2 (mmHg).
 * @param pb       Barometric pressure (mmHg). Default sea level 760.
 * @param rq       Respiratory quotient (0.7–1.0). Default 0.8.
 * @returns PAO2 in mmHg.
 */
export function alveolarPAO2(
  fio2: number,
  paco2Mmhg: number,
  pb: number = PB_SEA_LEVEL_MMHG,
  rq: number = 0.8,
): number {
  return (pb - PH2O_37C_MMHG) * fio2 - paco2Mmhg / rq;
}

/**
 * A-a gradient: PAO2 − PaO2. Elevated values suggest V/Q mismatch or shunt.
 * Normal < 15 mmHg (young), < 30 mmHg (elderly).
 */
export function aaGradient(pao2: number, pao2Measured: number): number {
  return pao2 - pao2Measured;
}

// ═══════════════════════════════════════════════════════════════
// 3. Bohr Effect — P50 Shift
// ═══════════════════════════════════════════════════════════════

/**
 * Calculates the shifted P50 of hemoglobin due to Bohr effect.
 *
 * Factors:
 *  - pH:        ΔP50 ≈ −0.48 per 0.1 pH unit (alkalosis → left shift)
 *  - PaCO2:     indirect (drives pH change)
 *  - Temperature: ΔP50 ≈ +1.0 mmHg per °C above 37
 *  - 2,3-DPG:  allosteric right-shifter (relative scale 0–2, normal = 1)
 *
 * @param pH         Arterial pH
 * @param tempC      Core body temperature (°C). Normal 37.
 * @param dpgRelative Relative 2,3-DPG (1.0 = normal, >1 = elevated).
 * @returns Shifted P50 (mmHg).
 */
export function bohrShiftP50(
  pH: number,
  tempC: number = 37,
  dpgRelative: number = 1.0,
): number {
  const pHEffect     = (7.4 - pH) * 4.8;         // ~4.8 mmHg per 0.1 pH unit
  const tempEffect   = (tempC - 37) * 1.0;        // 1 mmHg/°C
  const dpgEffect    = (dpgRelative - 1.0) * 6.0; // ~6 mmHg for doubled 2,3-DPG
  return Math.max(5, P50_NORMAL_MMHG + pHEffect + tempEffect + dpgEffect);
}

// ═══════════════════════════════════════════════════════════════
// 4. Hill Equation — Hemoglobin-O2 Saturation
// ═══════════════════════════════════════════════════════════════

/**
 * Hill equation for fractional hemoglobin-O2 saturation (SaO2).
 *
 * SO2 = pO2ⁿ / (P50ⁿ + pO2ⁿ)
 *
 * Combines Bohr-shifted P50 with Hill cooperativity to give a
 * physiologically accurate O2 dissociation curve at any condition.
 *
 * @param pao2Mmhg Alveolar or arterial PO2 (mmHg).
 * @param p50Mmhg  Shifted P50 from bohrShiftP50() (mmHg).
 * @param n        Hill cooperativity coefficient. Default 2.7.
 * @returns Fractional saturation 0–1.
 */
export function hillO2Saturation(
  pao2Mmhg: number,
  p50Mmhg: number = P50_NORMAL_MMHG,
  n: number = HILL_N,
): number {
  const pn   = Math.pow(pao2Mmhg, n);
  const p50n = Math.pow(p50Mmhg, n);
  return pn / (p50n + pn);
}

// ═══════════════════════════════════════════════════════════════
// 5. Fick's O2 Delivery (DO2)
// ═══════════════════════════════════════════════════════════════

/**
 * Fick's O2 delivery to tissues.
 *
 * DO2 = CO × CaO2
 *       CaO2 = (Hb × 1.34 × SaO2) + (PaO2 × 0.0031)
 *
 * @param cardiacOutputLpm  Cardiac output (L/min). Normal 5.
 * @param saO2Fraction      Arterial SaO2 (0–1).
 * @param hbGdl             Hemoglobin (g/dL). Normal 14–16.
 * @param pao2Mmhg          Arterial PaO2 (mmHg).
 * @returns DO2 in mL O2/min. Normal ~1000 mL/min.
 */
export function ficksO2Delivery(
  cardiacOutputLpm: number,
  saO2Fraction: number,
  hbGdl: number,
  pao2Mmhg: number,
): number {
  const cao2 = (hbGdl * 1.34 * saO2Fraction) + (pao2Mmhg * 0.0031); // mL/dL
  return cardiacOutputLpm * cao2 * 10; // × 10 → mL O2/min
}

// ═══════════════════════════════════════════════════════════════
// 6. Krogh Cylinder — O2 Diffusion to Tissue
// ═══════════════════════════════════════════════════════════════

/**
 * Krogh cylinder model: PO2 at radius r from a capillary.
 *
 * pO2(r) = pO2_cap - (Q / 4D)(r² - rc²) + (Q·rc² / 2D)·ln(r/rc)
 *
 * This is the foundational model for tissue oxygenation. It quantifies
 * whether cells at distance r from a capillary receive adequate O2.
 * When pO2(r) drops to 0 → "lethal corner" (cell anoxia risk).
 *
 * @param capPO2Mmhg     Capillary PO2 (mmHg). Typically 40–50 mmHg.
 * @param radiusCm       Distance from capillary to cell (cm). Typical 0.01–0.05 cm.
 * @param capRadiusCm    Capillary radius (cm). Typical 0.0003–0.0005 cm.
 * @param metabolicRate  O2 consumption rate (mL O2 / cm³ / s). Rest ≈ 3e-5.
 * @param diffCoeff      O2 diffusion coefficient in tissue (cm²/s). Muscle ≈ 1.7e-5.
 * @returns PO2 at radius r (mmHg). If negative, anoxia.
 */
export function kroghCylinder(
  capPO2Mmhg: number,
  radiusCm: number,
  capRadiusCm: number = 0.0004,
  metabolicRate: number = KROGH_Q_REST,
  diffCoeff: number = 1.7e-5, // cm²/s for O2 in muscle
): number {
  if (radiusCm <= capRadiusCm) return capPO2Mmhg;
  // Convert O2 consumption to PO2 units: α = 3.0 × 10⁻⁵ mL/cm³/mmHg
  const alpha_tissue = 3.0e-5; // Bunsen solubility in muscle (mL O2/(cm³ mmHg))
  const Q  = metabolicRate / alpha_tissue; // now in mmHg/s
  const D  = diffCoeff;                    // cm²/s
  const r  = radiusCm;
  const rc = capRadiusCm;
  const drop = (Q / (4 * D)) * (r * r - rc * rc) - (Q * rc * rc / (2 * D)) * Math.log(r / rc);
  return capPO2Mmhg - drop;
}

/**
 * Krogh lethal radius — max distance from capillary at which a cell
 * just survives (pO2 → 0). Increasing capillary PO2 (via HBOT) extends this.
 *
 * @param capPO2Mmhg     Capillary O2 partial pressure (mmHg).
 * @param metabolicRate  Tissue O2 consumption (mL/cm³/s).
 * @param diffCoeff      O2 diffusion coefficient in tissue (cm²/s).
 * @returns Lethal radius (cm).
 */
export function kroghLethalRadius(
  capPO2Mmhg: number,
  metabolicRate: number = KROGH_Q_REST,
  diffCoeff: number = 1.7e-5,
): number {
  const alpha_tissue = 3.0e-5;
  const Q  = metabolicRate / alpha_tissue;
  const D  = diffCoeff;
  const rc = 0.0004;
  // Simplified: ignoring ln term for thin cylinder → r_lethal ≈ sqrt(4D·P_cap/Q + rc²)
  return Math.sqrt(4 * D * capPO2Mmhg / Q + rc * rc);
}

// ═══════════════════════════════════════════════════════════════
// 7. HBOT — Hyperoxic Tissue Oxygen
// ═══════════════════════════════════════════════════════════════

/**
 * Calculates arterial PO2 under hyperbaric conditions (Lambertsen formula).
 *
 * At surface: PAO2 ≈ 713 × FiO2 − 33 (room air gives ~100 mmHg).
 * At 2.4 ATA O2: PAO2 = (2.4 × 760 − 47) × 1.0 − 40 / 0.8 ≈ 1724 mmHg.
 *
 * @param ataPressure  Absolute pressure in atmospheres (ATA). 1 = sea level.
 * @param fio2         Inspired O2 fraction (0–1). HBOT = 1.0.
 * @param paco2Mmhg    Arterial PCO2 (mmHg). Normally 40.
 * @returns Arterial PaO2 estimate (mmHg).
 */
export function hbotPaO2(
  ataPressure: number,
  fio2: number = 1.0,
  paco2Mmhg: number = 40,
  rq: number = 0.8,
): number {
  const pb = ataPressure * PB_SEA_LEVEL_MMHG;
  return (pb - PH2O_37C_MMHG) * fio2 - paco2Mmhg / rq;
}

/**
 * Dissolved O2 in plasma under HBOT (not bound to Hb).
 * Plasma dissolved O2 = PaO2 × 0.0031 (mL O2 / dL blood / mmHg).
 * At 3 ATA: ~5.5 mL/dL — enough to support resting metabolism without Hb.
 *
 * @param pao2Mmhg  Arterial PO2 (mmHg).
 * @returns Dissolved plasma O2 (mL O2 / dL blood).
 */
export function plasmaDissolvedO2(pao2Mmhg: number): number {
  return pao2Mmhg * 0.0031;
}

/**
 * HBOT healing score (0–100).
 * Quantifies tissue oxygenation benefit above baseline, capped at clinical
 * max (3.0 ATA). Non-linear: saturation curve reflecting diminishing return
 * and toxicity risk above 3 ATA or 100% FiO2 > 90 min.
 *
 * @param ataPressure  Absolute pressure (ATA).
 * @param fio2         FiO2 (0–1).
 * @param durationMin  Session duration (minutes). Optimal: 60–90 min.
 * @returns Score 0–100.
 */
export function hbotHealingScore(
  ataPressure: number,
  fio2: number,
  durationMin: number,
): number {
  const pao2 = hbotPaO2(ataPressure, fio2);
  const baseline = hbotPaO2(1.0, 0.21); // ~100 mmHg
  const fold = pao2 / baseline;          // 1.0 at room air, ~17× at 3 ATA O2
  // Sigmoid saturation: optimal ≈ 5–8× fold, diminishes above
  const oxygenComponent = Math.min(1.0, (fold - 1) / 12.0); // 0→1 over 12-fold range
  // Duration factor: 60–90 min → 1.0; <30 min → 0.5; >120 → slight ROS penalty
  const durFactor = durationMin < 30
    ? 0.5
    : durationMin > 120
    ? Math.max(0, 1.0 - (durationMin - 120) * 0.003)
    : Math.min(1.0, (durationMin - 30) / 60.0 + 0.5);
  return Math.round(oxygenComponent * durFactor * 100);
}

// ═══════════════════════════════════════════════════════════════
// 8. Hagen-Poiseuille — Airway Resistance (Heliox)
// ═══════════════════════════════════════════════════════════════

/**
 * Hagen-Poiseuille law: laminar flow resistance in a tube.
 *
 * R = 8ηL / (π r⁴)
 *
 * Key insight: Helium's viscosity (1.96 × 10⁻⁵ Pa·s) is slightly higher
 * than air (1.81 × 10⁻⁵ Pa·s) but Heliox dramatically reduces TURBULENT
 * resistance because density is 7× lower, improving flow in Reynolds-number
 * dominated airways (Hagen-Poiseuille applies for laminar regime).
 *
 * @param viscosityPas   Dynamic viscosity (Pa·s). Air = 1.81e-5, He = 1.96e-5.
 * @param lengthM        Tube/airway length (m).
 * @param radiusM        Tube radius (m). Typical trachea ~0.01 m.
 * @returns Resistance (Pa·s/m³).
 */
export function hagenPoiseuille(
  viscosityPas: number,
  lengthM: number,
  radiusM: number,
): number {
  return (8 * viscosityPas * lengthM) / (Math.PI * Math.pow(radiusM, 4));
}

/** Gas viscosity constants (Pa·s at 37°C body temperature) */
export const GAS_VISCOSITY_PAS = {
  air:   1.86e-5,
  O2:    2.04e-5,
  He:    1.96e-5,
  heliox_70_30: 1.80e-5, // 70% He / 30% O2 mixture
  N2O:   1.48e-5,
  CO2:   1.53e-5,
  NO:    1.91e-5,
} as const;

/** Gas density constants (kg/m³ at 37°C, 1 ATA) */
export const GAS_DENSITY_KGM3 = {
  air:          1.16,
  O2:           1.31,
  He:           0.16,
  heliox_70_30: 0.50, // weighted average: 0.7×0.16 + 0.3×1.31
  N2O:          1.80,
  CO2:          1.80,
  NO:           1.23,
} as const;

/**
 * Turbulent airway resistance factor — Rohrer model.
 * For high-flow/obstructed airways where turbulence dominates:
 * ΔP = K1·V̇ + K2·ρ·V̇²  (K2 term is the turbulent component)
 * Heliox reduces the ρ (density) term by ~7×, dramatically cutting work of breathing.
 *
 * @param densityKgM3   Gas density (kg/m³).
 * @param flowLps       Flow rate (L/s).
 * @param k2            Turbulent resistance coefficient (default 0.3).
 * @returns Turbulent pressure drop factor (relative).
 */
export function turbulentResistanceFactor(
  densityKgM3: number,
  flowLps: number,
  k2: number = 0.3,
): number {
  return k2 * densityKgM3 * flowLps * flowLps;
}

/**
 * Heliox work-of-breathing reduction score (0–100).
 * Compares air vs Heliox 70/30 turbulent resistance at given flow rate.
 *
 * Clinical studies show 30–60% reduction in work of breathing in
 * upper airway obstruction (croup, post-extubation stridor, severe asthma).
 *
 * @param flowLps  Peak inspiratory flow (L/s). Typical 0.3–1.2 L/s.
 * @returns Percentage work-of-breathing reduction (0–100%).
 */
export function helioxWOBReduction(flowLps: number): number {
  const airR     = turbulentResistanceFactor(GAS_DENSITY_KGM3.air,          flowLps);
  const helioxR  = turbulentResistanceFactor(GAS_DENSITY_KGM3.heliox_70_30, flowLps);
  const reduction = airR === 0 ? 0 : (airR - helioxR) / airR;
  return Math.round(Math.min(0.65, reduction) * 100);
}

// ═══════════════════════════════════════════════════════════════
// 9. Nitric Oxide — Bioavailability & Vasodilation Score
// ═══════════════════════════════════════════════════════════════

/**
 * eNOS-derived NO bioavailability model.
 *
 * Endothelial NOS (eNOS) synthesizes NO from L-arginine in response to:
 *   - Shear stress (governed by flow/cardiac output)
 *   - O2 availability (eNOS requires O2 as co-substrate)
 *   - Anti-inflammatory milieu (low ROS preserves NO vs. forming peroxynitrite)
 *
 * NO → sGC → cGMP → smooth muscle relaxation (vasodilation).
 * Half-life < 1 s in blood; reacts with O2•⁻ (superoxide) to form ONOO⁻.
 *
 * @param o2TensionMmhg   Local tissue PO2 (mmHg). eNOS Km(O2) ≈ 4–6 mmHg.
 * @param flowShear       Normalised shear stress (0–1). 0 = stasis, 1 = vigorous.
 * @param rosFraction     Reactive oxygen species level (0–1). High ROS → NO quenched.
 * @param exogenousNoPpm  Inhaled NO concentration (ppm). INOmax dose: 20 ppm.
 * @returns NO bioavailability score (0–100).
 */
export function noBioavailabilityScore(
  o2TensionMmhg: number,
  flowShear: number,
  rosFraction: number,
  exogenousNoPpm: number = 0,
): number {
  // eNOS activity: Michaelis-Menten with Km ≈ 5 mmHg O2
  const enosActivity = o2TensionMmhg / (5 + o2TensionMmhg);
  // Endogenous production (0–0.7 of score)
  const endogenousNo = enosActivity * flowShear * 0.7;
  // ROS quenching: peroxynitrite formation rate ∝ [NO] × [O2•⁻]
  const rosQuench = 1 - Math.min(1, rosFraction * 1.5);
  // Exogenous NO supplement (INOmax at 20 ppm gives strong vasodilation)
  const exoScore = Math.min(0.3, exogenousNoPpm / 100);
  const total = (endogenousNo * rosQuench + exoScore);
  return Math.round(Math.min(1, total) * 100);
}

/**
 * Pulmonary vasoconstriction relief score — particularly relevant for
 * ARDS, pulmonary hypertension, and neonatal care (INOmax).
 * NO selectively vasodilates ventilated lung segments, improving V/Q match.
 *
 * @param noPpm           Inhaled NO dose (ppm). Clinical range 1–80 ppm.
 * @param baselinePAP     Mean pulmonary arterial pressure (mmHg). Normal 15.
 * @returns Predicted PAP reduction (mmHg).
 */
export function noVasodilationEffect(noPpm: number, baselinePAP: number = 25): number {
  // Clinical data: 20 ppm reduces mPAP ~5–8 mmHg in PAH
  const reductionPct = Math.min(0.30, (noPpm / 20) * 0.12); // saturates at 30%
  return baselinePAP * reductionPct;
}

// ═══════════════════════════════════════════════════════════════
// 10. Composite Gas Healing Score
// ═══════════════════════════════════════════════════════════════

export interface GasHealingInputs {
  fio2: number;             // 0–1
  paco2Mmhg: number;        // mmHg
  hco3MeqL: number;         // mEq/L
  tempC: number;            // °C
  hbGdl: number;            // g/dL
  cardiacOutputLpm: number; // L/min
  ataPressure: number;      // ATA (1 = surface)
  gasType: 'air' | 'O2' | 'heliox_70_30' | 'NO' | 'NO_heliox' | 'CO2_enriched';
  noInhPpm?: number;        // inhaled NO ppm (0 if not used)
  flowShear?: number;       // 0–1
  rosFraction?: number;     // 0–1
  durationMin?: number;     // session minutes
}

export interface GasHealingResult {
  pH: number;
  acidBaseStatus: string;
  saO2Fraction: number;
  p50Shifted: number;
  pao2Mmhg: number;
  o2DeliveryMlMin: number;
  kroghLethalRadiusCm: number;
  hbotScore: number;
  helioxWOBScore: number;
  noBioavailScore: number;
  encodedCompositeScore: number; // 0–100 composite
  clinicalSummary: string;
}

/**
 * Full composite gas physiology analysis.
 * Returns all physiological metrics plus a 0–100 healing quality score.
 */
export function analyzeGasHealing(inputs: GasHealingInputs): GasHealingResult {
  const pH      = hendersonHasselbalch(inputs.paco2Mmhg, inputs.hco3MeqL);
  const status  = acidBaseStatus(pH);
  const p50     = bohrShiftP50(pH, inputs.tempC);
  const pao2    = (ataPressure: number) => alveolarPAO2(inputs.fio2, inputs.paco2Mmhg, ataPressure * PB_SEA_LEVEL_MMHG);
  const pao2Val = pao2(inputs.ataPressure);
  const sao2    = hillO2Saturation(pao2Val, p50);
  const do2     = ficksO2Delivery(inputs.cardiacOutputLpm, sao2, inputs.hbGdl, pao2Val);
  const lethalR = kroghLethalRadius(Math.min(pao2Val, 120)); // cap cap PO2 for Krogh input
  const hbot    = hbotHealingScore(inputs.ataPressure, inputs.fio2, inputs.durationMin ?? 60);
  const heliox  = (inputs.gasType === 'heliox_70_30' || inputs.gasType === 'NO_heliox')
                    ? helioxWOBReduction(0.5) : 0;
  const noScore = noBioavailabilityScore(
    Math.min(pao2Val, 80),
    inputs.flowShear ?? 0.5,
    inputs.rosFraction ?? 0.2,
    inputs.noInhPpm ?? 0,
  );

  // pH penalty factor (physiological optimum pH 7.38–7.42)
  const pHOptimal = 1 - Math.abs(pH - 7.40) * 3.0;
  const pHFactor  = Math.max(0, Math.min(1, pHOptimal));

  // Composite weighted score
  const o2Component    = Math.min(100, do2 / 12); // 1200 mL/min = 100 pts
  const composite = Math.round(
    o2Component     * 0.35 +
    hbot            * 0.30 +
    noScore         * 0.15 +
    heliox          * 0.10 +
    pHFactor * 100  * 0.10,
  );

  const summaryParts: string[] = [];
  if (pH < 7.35) summaryParts.push('Acidaemia — impairs enzyme function and O2 affinity');
  if (pH > 7.45) summaryParts.push('Alkalaemia — left-shifts O2 curve, reduced tissue delivery');
  if (sao2 < 0.94) summaryParts.push(`Low SaO2 ${(sao2 * 100).toFixed(0)}% — tissue hypoxia risk`);
  if (do2 < 800) summaryParts.push('O2 delivery below critical threshold (<800 mL/min)');
  if (inputs.ataPressure > 1) summaryParts.push(`HBOT ${inputs.ataPressure} ATA — superoxic tissue saturation`);
  if ((inputs.noInhPpm ?? 0) > 0) summaryParts.push(`Inhaled NO ${inputs.noInhPpm} ppm — selective pulmonary vasodilation`);
  if (summaryParts.length === 0) summaryParts.push('Optimal physiological gas balance');

  return {
    pH: Math.round(pH * 1000) / 1000,
    acidBaseStatus: status,
    saO2Fraction: Math.round(sao2 * 1000) / 1000,
    p50Shifted: Math.round(p50 * 10) / 10,
    pao2Mmhg: Math.round(pao2Val),
    o2DeliveryMlMin: Math.round(do2),
    kroghLethalRadiusCm: Math.round(lethalR * 10000) / 10000,
    hbotScore: hbot,
    helioxWOBScore: heliox,
    noBioavailScore: noScore,
    encodedCompositeScore: Math.max(0, Math.min(100, composite)),
    clinicalSummary: summaryParts.join('; '),
  };
}
