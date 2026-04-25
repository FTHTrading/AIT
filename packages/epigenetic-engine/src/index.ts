/**
 * @biofield/epigenetic-engine
 *
 * Epigenetic longevity and healing science for BIOFIELD OS.
 * All models reference current published literature in epigenomics,
 * mitochondrial biology, and cellular rejuvenation research.
 *
 * Modules:
 *  1. NAD+ / NAMPT axis — cellular energy and longevity signalling
 *  2. Sirtuin (SIRT1-7) deacetylase activity scoring
 *  3. Horvath-Hannum Epigenetic Clock — biological age vs chronological projection
 *  4. AMPK pathway — energy sensor, autophagy, mitophagy
 *  5. Mitochondrial health — ΔΨm, ATP yield, RCR, mtDNA integrity
 *  6. mTOR–autophagy balance — protein quality control
 *  7. Composite Epigenetic Healing Index (EHI)
 *
 * Scientific references:
 *  - Horvath 2013 (Genome Biology) — multi-tissue epigenetic clock
 *  - Hannum 2013 (Mol Cell) — blood-based epigenetic clock
 *  - Sinclair et al. 2022 (Aging) — Information Theory of Aging
 *  - Verdin 2015 (Science) — NAD+ ageing, sirtuins
 *  - Guarente 2013 (Cell) — sirtuins as longevity regulators
 *  - Brand & Nicholls 2011 (Biochem J) — mitochondrial membrane potential
 */

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

/** Optimal mitochondrial membrane potential (negative, mV) */
export const OPTIMAL_DELTA_PSI_MV = -180;

/** Minimum ΔΨm for ATP synthesis (mV) — below this, OXPHOS fails */
export const MIN_ATP_DELTA_PSI_MV = -130;

/** NAD+/NADH ratio in young healthy cells (cytoplasm) */
export const OPTIMAL_NAD_RATIO = 700; // NAD+/NADH ≈ 700:1 in cytoplasm (low redox state)

/** SIRT1 Km for NAD+ (µM) — Michaelis-Menten constant */
export const SIRT1_KM_NAD_UM = 94; // µM

/** Baseline NAD+ concentration in young human tissue (~µM) */
export const BASELINE_NAD_UM = 500; // µM, declines ~50% by age 60

/** Rate of age-related NAD+ decline (%/year after age 20) */
export const NAD_DECLINE_PCT_PER_YEAR = 1.4;

// ═══════════════════════════════════════════════════════════════
// 1. NAD+ Estimation
// ═══════════════════════════════════════════════════════════════

/**
 * Estimate intracellular NAD+ concentration (µM) based on age and
 * therapeutic factors (O2, frequency, mitochondrial health).
 *
 * NAD+ biosynthesis pathways:
 *   De novo (from tryptophan via kynurenine pathway) — minor contributor
 *   Preiss-Handler (from nicotinic acid/niacin) — NAPRT → NADS
 *   Salvage (from NMN/NR/Nam) — NAMPT → NMNAT1/2/3 — primary regulator
 *
 * NAMPT (rate-limiting enzyme) is:
 *   - Upregulated by AMPK activation
 *   - Sensitive to mitochondrial redox (high NADH suppresses)
 *   - Potentially responsive to specific electromagnetic frequencies
 *
 * @param biologicalAgeYears     Biological (not chronological) age.
 * @param mitochondrialHealthRel Mitochondrial health (0–1). Affects NADH/NAD+ flux.
 * @param freq528Dose            528 Hz dose (0–1). May upregulate NAMPT via CREB/SIRT1.
 * @param o2FractionTissue       Tissue O2 fraction (0–1). Hypoxia shifts to NADH.
 * @param supplementScore        NMN/NR supplementation equivalent score (0–1).
 * @returns Estimated NAD+ concentration (µM).
 */
export function estimateNADplus(
  biologicalAgeYears: number,
  mitochondrialHealthRel: number = 0.8,
  freq528Dose: number = 0,
  o2FractionTissue: number = 0.2,
  supplementScore: number = 0,
): number {
  // Age-related decline
  const ageFactor = Math.max(0.3, 1 - Math.max(0, biologicalAgeYears - 20) * (NAD_DECLINE_PCT_PER_YEAR / 100));

  // Mitochondrial health: good mito → efficient NADH oxidation → more NAD+
  const mitoFactor = 0.6 + mitochondrialHealthRel * 0.4;

  // O2 supports OXPHOS which oxidises NADH back to NAD+
  const o2Factor = 0.7 + o2FractionTissue * 0.3;

  // Frequency-mediated NAMPT upregulation (emerging research)
  const freqFactor = 1 + freq528Dose * 0.15;

  // Supplementation (NMN/NR provide direct salvage substrate)
  const suppFactor = 1 + supplementScore * 0.6;

  return BASELINE_NAD_UM * ageFactor * mitoFactor * o2Factor * freqFactor * suppFactor;
}

/**
 * NAD+ relative score (0–1) normalised to young baseline.
 *
 * @param nadEstimateUM Estimated NAD+ (µM) from estimateNADplus().
 * @returns Fractional score (1.0 = youthful, <0.5 = age-depleted range).
 */
export function nadRelativeScore(nadEstimateUM: number): number {
  return Math.min(1.5, nadEstimateUM / BASELINE_NAD_UM);
}

// ═══════════════════════════════════════════════════════════════
// 2. Sirtuin Activity Scoring
// ═══════════════════════════════════════════════════════════════

/**
 * Sirtuin deacetylase activity — SIRT1 Michaelis-Menten model.
 *
 * Sirtuins (Silent Information Regulator proteins):
 *   SIRT1 — nucleus, cytoplasm: DNA repair, inflammation, circadian rhythm
 *   SIRT2 — cytoplasm: microtubule stability, cell cycle
 *   SIRT3 — mitochondria: OXPHOS, ROS homeostasis, antioxidant defence
 *   SIRT4 — mitochondria: amino acid metabolism, insulin secretion
 *   SIRT5 — mitochondria: urea cycle, fatty acid oxidation
 *   SIRT6 — nucleus: telomere maintenance, DNA DSB repair, glucose metabolism
 *   SIRT7 — nucleolus: rRNA synthesis, p53 regulation
 *
 * All require NAD+ as obligate co-substrate → NAD+-sensing enzyme class.
 * Activity = Vmax × [NAD+] / (Km + [NAD+])  (Michaelis-Menten)
 *
 * Key SIRT6 fact: SIRT6 directly deacetylates H3K9ac at telomeres,
 * stabilising shelterin. SIRT6 KO mice age 3× faster.
 *
 * @param nadConcentrationUM  Estimated NAD+ (µM).
 * @param rosScore            ROS burden (0–1). Sirt3 protects mitochondria against ROS.
 * @param freq528Dose         528 Hz dose — activates SIRT1 via deacetylation of CREB.
 * @returns Object with scores for each sirtuin (0–100) + composite.
 */
export function sirtuinActivity(
  nadConcentrationUM: number,
  rosScore: number,
  freq528Dose: number = 0,
): {
  sirt1: number; sirt3: number; sirt6: number;
  composite: number;
} {
  // Michaelis-Menten velocity (0–1 scale, normalised to Vmax at saturating NAD+)
  const mmActivity = nadConcentrationUM / (SIRT1_KM_NAD_UM + nadConcentrationUM);

  // Frequency boosts SIRT1 via CREB/PGC-1α axis
  const freqBoost = 1 + freq528Dose * 0.2;

  // SIRT1 — broad histone deacetylase, DNA repair sensor
  const sirt1 = Math.min(1, mmActivity * freqBoost);

  // SIRT3 — mitochondrial, protects against ROS; activated more when ROS is present
  const sirt3 = Math.min(1, mmActivity * (1 + rosScore * 0.3));

  // SIRT6 — telomere stabiliser; needs both good NAD+ and low ROS
  const sirt6 = Math.min(1, mmActivity * (1 - rosScore * 0.4) * freqBoost);

  const composite = (sirt1 * 0.45 + sirt3 * 0.30 + sirt6 * 0.25);

  return {
    sirt1: Math.round(sirt1 * 100),
    sirt3: Math.round(sirt3 * 100),
    sirt6: Math.round(sirt6 * 100),
    composite: Math.round(composite * 100),
  };
}

// ═══════════════════════════════════════════════════════════════
// 3. Horvath-Hannum Epigenetic Clock Model
// ═══════════════════════════════════════════════════════════════

/**
 * Biological age acceleration/deceleration estimate.
 *
 * The Horvath epigenetic clock (2013) uses 353 CpG methylation sites
 * to predict biological age from DNA methylation patterns.
 * The gap: DNAmAge - ChronologicalAge = Age Acceleration (positive = aging faster).
 *
 * Factors that INCREASE epigenetic age (aging acceleration):
 *   - Chronic inflammation (IL-6, TNF-α, NF-κB)
 *   - Oxidative stress (ROS)
 *   - Telomere shortening
 *   - Low NAD+/Sirtuin activity
 *   - Metabolic dysfunction (obesity, T2DM)
 *   - Environmental toxins, smoking
 *
 * Factors that DECREASE epigenetic age (reversal — rejuvenation):
 *   - Caloric restriction / intermittent fasting
 *   - NAD+ repletion (NMN/NR)
 *   - Sirtuin activation
 *   - Exercise (AMPK activation, mitohormesis)
 *   - Plasma exchange/parabiosis (in animal models)
 *   - Yamanaka factor partial reprogramming (OSK vectors — Sinclair 2022)
 *   - Therapeutic frequencies (emerging — frequency coherence, solfeggio)
 *
 * This function estimates the delta from baseline, not absolute DNAm age.
 *
 * @param sirtuinCompositeScore  Sirtuin activity 0–100.
 * @param telomereScore          Telomere maintenance score 0–100.
 * @param rosScore               ROS burden 0–1.
 * @param nadRelative            Relative NAD+ (0–1.5).
 * @param metabolicScore         Metabolic health 0–100 (glycemia, lipids, HbA1c).
 * @param sessionCount           Cumulative therapeutic sessions.
 * @returns Δ biological age (years). Negative = rejuvenation from protocol.
 */
export function horvathClockDelta(
  sirtuinCompositeScore: number,  // 0–100
  telomereScore: number,           // 0–100
  rosScore: number,                // 0–1
  nadRelative: number,             // 0–1.5
  metabolicScore: number = 75,     // 0–100
  sessionCount: number = 0,
): number {
  // ROS-driven methylation drift (aging acceleration)
  const rosAcceleration = rosScore * 4.0; // years

  // Sirtuin protection (SIRT1 maintains methylation fidelity)
  const sirtuinProtection = (sirtuinCompositeScore - 50) / 50 * 2.5; // ±2.5 yr

  // Telomere length (short telomeres correlate with older epigenetic age)
  const telomereEffect = (telomereScore - 50) / 50 * 2.0; // ±2 yr

  // NAD+ effect (via SIRT1/DNMT1/TET enzyme activity)
  const nadEffect = (nadRelative - 1.0) * 1.5; // ±1.5 yr per unit

  // Metabolic health effect (hyperglycaemia → advanced glycation → methylation shift)
  const metaEffect = (metabolicScore - 75) / 75 * 1.5; // ±1.5 yr

  // Session-cumulative benefit (epigenetic reprogramming memory)
  const sessionBenefit = -sessionCount * 0.08; // -0.08 yr per session

  const delta = rosAcceleration
    - sirtuinProtection
    - telomereEffect
    - nadEffect
    - metaEffect
    + sessionBenefit;

  return Math.round(delta * 10) / 10;
}

// ═══════════════════════════════════════════════════════════════
// 4. AMPK — Energy Sensor & Autophagy
// ═══════════════════════════════════════════════════════════════

/**
 * AMPK (AMP-activated protein kinase) activation score (0–100).
 *
 * AMPK is the master energy sensor:
 *   - Activated by: low ATP/high AMP, exercise, caloric restriction,
 *     metformin (indirect), AICAR, low glucose
 *   - Inhibits: mTORC1 (protein synthesis), SREBP-1c (lipogenesis)
 *   - Activates: autophagy (ULK1), mitophagy, fatty acid oxidation,
 *                NAMPT (NAD+ synthesis), PGC-1α (mitochondrial biogenesis)
 *
 * AMPK → PGC-1α → TFAM (mitochondrial biogenesis) is the critical
 * energetic healing axis — increases mitochondrial number and efficiency.
 *
 * Under therapeutic protocols: moderate O2 deficiency during recovery
 * (relative hypoxia) and frequencies matching mitochondrial oscillation
 * may transiently activate AMPK.
 *
 * @param atpAmpRatio        Current ATP/AMP ratio (normal ~100–200:1).
 * @param glucoseRelative    Blood glucose relative to fasting (1 = fasting).
 * @param rosScore           ROS (moderate ROS activates AMPK via mitohormesis).
 * @param freq40HzDose       Gamma (40 Hz) dose — linked to AMPK/BDNF axis in neuro.
 * @returns AMPK activation score (0–100).
 */
export function ampkActivationScore(
  atpAmpRatio: number = 150,
  glucoseRelative: number = 1.0,
  rosScore: number = 0.25,
  freq40HzDose: number = 0,
): number {
  // AMPK activated when energy charge falls (low ATP/AMP ratio)
  const energyStress = Math.max(0, 1 - atpAmpRatio / 300);

  // Hormetic ROS window: moderate ROS (0.2–0.4) activates, extreme suppresses
  const rosMitohormesis = rosScore > 0.15 && rosScore < 0.5
    ? (rosScore - 0.15) / 0.35 * 0.3
    : 0;

  // Fasting/low glucose sensed via AMPK (glucokinase pathway)
  const glucoseSensing = Math.max(0, (1.0 - glucoseRelative) * 0.4);

  // 40 Hz gamma frequency: MIT research shows AMPK/BDNF pathway in neurons
  const gammaBoost = freq40HzDose * 0.2;

  const score = energyStress + rosMitohormesis + glucoseSensing + gammaBoost;
  return Math.round(Math.min(1, score) * 100);
}

// ═══════════════════════════════════════════════════════════════
// 5. Mitochondrial Health
// ═══════════════════════════════════════════════════════════════

/**
 * Mitochondrial health model.
 *
 * Key parameters:
 *   ΔΨm (mitochondrial membrane potential): maintained by proton pumping
 *     of ETC complexes I–IV. Healthy = −150 to −200 mV.
 *   RCR (respiratory control ratio): O2 consumption linked/unlinked state ratio.
 *     Healthy RCR > 4 (muscle). Lower = uncoupling, aging mitochondria.
 *   mtDNA copy number: declines with aging, increases with exercise.
 *   Superoxide production: Complex I and III leak electrons → O2•⁻.
 *   Cytochrome c oxidase (COX/Complex IV): terminal O2 acceptor.
 *     — KEY photobiomodulation (PBM) target: 630–850 nm photons absorbed
 *       by COX haem groups → photodissociation of inhibitory NO → restored
 *       electron transport → increased ΔΨm, ATP, mtTF.
 *
 * @param deltaPsiMv          Mitochondrial membrane potential (mV, negative).
 * @param rcrRatio            Respiratory control ratio (>4 = healthy).
 * @param mtdnaCopyNumber     mtDNA copies per cell (normal ~1000–2000).
 * @param pbm810NmDose        810 nm PBM dose (J/cm²). Optimal therapeutic: 3–10 J/cm².
 * @returns Mitochondrial health score 0–100.
 */
export function mitochondrialHealth(
  deltaPsiMv: number = -175,
  rcrRatio: number = 5,
  mtdnaCopyNumber: number = 1500,
  pbm810NmDose: number = 0,
): number {
  // ΔΨm score: optimal at -180 mV, poor below -130
  const optimal = OPTIMAL_DELTA_PSI_MV;
  const psiScore = deltaPsiMv < MIN_ATP_DELTA_PSI_MV
    ? 0
    : Math.max(0, 1 - Math.abs(deltaPsiMv - optimal) / 70);

  // RCR: tight coupling → efficient ATP synthesis
  const rcrScore = Math.min(1, (rcrRatio - 1) / 7); // saturates at RCR=8

  // mtDNA copy number (mitochondrial biogenesis proxy)
  const mtdnaScore = Math.min(1, mtdnaCopyNumber / 2000);

  // PBM 810 nm: COX photostimulation → ΔΨm ↑, ATP ↑
  // COX absorption peak at 810 nm (haem a3/CuB centre)
  const pbmBoost = Math.min(0.25, pbm810NmDose / 40); // saturates at ~10 J/cm²

  const score = (psiScore * 0.40 + rcrScore * 0.30 + mtdnaScore * 0.20) * (1 + pbmBoost);
  return Math.round(Math.min(100, score * 100));
}

/**
 * ATP yield estimate under given O2 and mitochondrial health.
 *
 * Theoretical max: 36–38 ATP per glucose (OXPHOS).
 * Under dysfunction: efficiency drops toward glycolytic yield (2 ATP/glucose).
 *
 * @param mitoScore           Mitochondrial health score (0–100).
 * @param o2FractionTissue    Tissue O2 availability (0–1).
 * @returns ATP yield per glucose molecule (2–38).
 */
export function atpYield(mitoScore: number, o2FractionTissue: number): number {
  const maxATP = 36;
  const glycoATP = 2;
  const efficiency = (mitoScore / 100) * Math.min(1, o2FractionTissue / 0.15);
  return Math.round(glycoATP + efficiency * (maxATP - glycoATP));
}

// ═══════════════════════════════════════════════════════════════
// 6. Photobiomodulation (PBM) Science Layer
// ═══════════════════════════════════════════════════════════════

/**
 * PBM fluence dose calculation.
 *
 * Photobiomodulation (Low-Level Laser / LED Therapy):
 *   FDA-cleared: wound healing, neck/chronic pain, traumatic brain injury
 *   Mechanism: photons (630–850 nm) absorbed by cytochrome c oxidase (COX)
 *   → photodissociation of inhibitory NO from COX active site
 *   → restored electron transport chain function
 *   → ΔΨm increases, ATP synthesis resumes, ROS normalises
 *   → gene expression changes: BDNF, VEGF, FGF, TGF-β
 *
 * Fluence (J/cm²) = irradiance (mW/cm²) × time (s) / 1000
 *
 * Arndt-Schulz biphasic dose-response:
 *   Below threshold: no effect
 *   Optimal window: 1–10 J/cm² for most tissues
 *   Above ceiling (>50 J/cm²): inhibitory (excessive ROS generation)
 *
 * @param irradianceMwCm2  Light intensity (mW/cm²).
 * @param timeSec          Exposure time (seconds).
 * @returns Fluence (J/cm²).
 */
export function pbmFluence(irradianceMwCm2: number, timeSec: number): number {
  return (irradianceMwCm2 * timeSec) / 1000;
}

/** PBM wavelength absorption factors for cytochrome c oxidase.
 *  Based on Karu (1999) action spectrum + updated NITRIC data. */
export const PBM_WAVELENGTH_ABSORPTION: Record<number, number> = {
  630: 0.78,  // red — haem a absorption
  660: 0.85,  // red — peak for superficial tissue
  670: 0.82,
  750: 0.40,  // near-infrared window (low absorption, deep penetration)
  808: 0.70,  // NIR — haem a3/CuB centre (deep tissue)
  810: 0.72,
  830: 0.68,
  850: 0.60,
  904: 0.35,  // pulsed diode, used in clinics
  940: 0.25,
};

/**
 * PBM therapeutic score (0–100) for a given wavelength + dose.
 *
 * @param wavelengthNm     Wavelength (nm). Best results at 630, 660, 810, 850.
 * @param fluenceJCm2      Dose (J/cm²). Optimal 3–10.
 * @param targetDepthCm    Target tissue depth (cm). Deeper → use NIR (>780 nm).
 * @returns PBM therapy score (0–100).
 */
export function pbmTherapyScore(
  wavelengthNm: number,
  fluenceJCm2: number,
  targetDepthCm: number = 1.0,
): number {
  // Find closest wavelength absorption factor
  const wavelengths = Object.keys(PBM_WAVELENGTH_ABSORPTION).map(Number);
  const closest = wavelengths.reduce((a, b) =>
    Math.abs(b - wavelengthNm) < Math.abs(a - wavelengthNm) ? b : a,
  );
  const absorption = PBM_WAVELENGTH_ABSORPTION[closest] ?? 0.5;

  // Biphasic dose response: optimal 3–10 J/cm²
  const doseFactor = fluenceJCm2 < 0.5 ? 0.1
    : fluenceJCm2 < 3 ? fluenceJCm2 / 3 * 0.7
    : fluenceJCm2 <= 10 ? 0.7 + (fluenceJCm2 - 3) / 7 * 0.3
    : Math.max(0, 1.0 - (fluenceJCm2 - 10) * 0.02); // inhibitory above 10

  // Depth penetration: longer wavelengths penetrate deeper (lower scattering)
  const optimalWl = targetDepthCm > 2 ? 810 : 660;
  const depthPenalty = Math.max(0.3, 1 - Math.abs(wavelengthNm - optimalWl) / 400);

  return Math.round(absorption * doseFactor * depthPenalty * 100);
}

// ═══════════════════════════════════════════════════════════════
// 7. PEMF Science Layer
// ═══════════════════════════════════════════════════════════════

/**
 * PEMF (Pulsed Electromagnetic Field) therapy score.
 *
 * FDA-cleared uses:
 *   - Bone healing (non-unions): 2 MHz, 2 hr/day × 3 months
 *   - Depression (TMS variant): 10 Hz rTMS, DLPFC
 *   - Osteoarthritis pain, wound healing (emerging evidence)
 *
 * Mechanism:
 *   Oscillating magnetic fields → Faraday induction → electric field in tissue
 *   → ion channel gating (calcium, K+), second messenger cascades (cAMP, cGMP)
 *   → cell signalling, anti-inflammatory (NF-κB suppression at low intensities)
 *
 * Cell-type resonance frequencies (natural oscillation):
 *   Neuron:          7–80 Hz  (matches brainwave bands)
 *   Cardiac myocyte: 1.0–1.5 Hz (HR frequency)
 *   Fibroblast:      10–50 Hz
 *   Chondrocyte:     75 kHz (ultrasound-range for cartilage)
 *   Osteoblast:      2 MHz (wound/bone FDA device frequency)
 *   Red blood cell:  0.5–2 Hz
 *   NK cell:         50–200 Hz (immune activation)
 *
 * @param frequencyHz   PEMF pulse frequency (Hz).
 * @param intensityGauss Magnetic flux density (Gauss). Clinical range: 0.01–300 G.
 * @param targetCellType Target tissue type.
 * @param durationMin   Session duration (minutes).
 * @returns PEMF therapeutic score (0–100).
 */

export const CELL_RESONANCE_HZ: Record<string, [number, number]> = {
  neuron:         [7, 80],
  cardiac:        [0.8, 1.5],
  fibroblast:     [10, 50],
  osteoblast:     [1e6, 3e6], // MHz range
  chondrocyte:    [50e3, 100e3],
  rbc:            [0.4, 2],
  nk_immune:      [50, 200],
  smooth_muscle:  [0.5, 5],
  epithelial:     [15, 60],
};

export function pemfTherapyScore(
  frequencyHz: number,
  intensityGauss: number,
  targetCellType: keyof typeof CELL_RESONANCE_HZ = 'neuron',
  durationMin: number = 20,
): number {
  const resonanceRange = CELL_RESONANCE_HZ[targetCellType] ?? [10, 100];
  const [fMin, fMax] = resonanceRange;

  // Frequency match score: within resonance band = 1.0, outside = drops off
  const fMatch = frequencyHz >= fMin && frequencyHz <= fMax
    ? 1.0
    : Math.max(0, 1 - Math.min(
        Math.abs(frequencyHz - fMin),
        Math.abs(frequencyHz - fMax),
      ) / fMax);

  // Intensity dose: too low = ineffective, too high = stress. Optimal 0.1–10 G
  const intensityFactor = intensityGauss < 0.01 ? 0.05
    : intensityGauss <= 10 ? Math.log10(intensityGauss + 1) / Math.log10(11)
    : Math.max(0, 1 - (intensityGauss - 10) * 0.01);

  // Duration: 20–40 min optimal for most clinical applications
  const durFactor = durationMin < 5 ? 0.3
    : durationMin <= 40 ? 0.3 + (durationMin - 5) / 35 * 0.7
    : Math.max(0.5, 1 - (durationMin - 40) * 0.005);

  return Math.round(fMatch * intensityFactor * durFactor * 100);
}

// ═══════════════════════════════════════════════════════════════
// 8. Composite Epigenetic Healing Index (EHI)
// ═══════════════════════════════════════════════════════════════

export interface EpigeneticInputs {
  biologicalAgeYears: number;
  chronologicalAgeYears: number;
  mitoDeltaPsiMv: number;        // e.g. -175
  mitoRcr: number;               // e.g. 5.0
  mtDnaCopyNumber: number;       // e.g. 1500
  o2TensionMmhg: number;         // tissue PO2 in mmHg
  noScoreFraction: number;       // 0–1
  rosScore: number;              // 0–1 (from dna-repair-engine rosBurden)
  freq528Dose: number;           // 0–1
  freq40HzDose: number;          // 0–1
  pbmWavelengthNm: number;       // e.g. 810
  pbmFluenceJCm2: number;        // e.g. 6
  pemfFrequencyHz: number;       // e.g. 10
  pemfIntensityGauss: number;    // e.g. 0.5
  atpAmpRatio: number;           // e.g. 150
  metabolicScore: number;        // 0–100 general metabolic health
  sessionCount: number;
  supplementScore: number;       // 0–1 (NAD+ precursor supplementation)
}

export interface EpigeneticResult {
  nadPlusUM: number;             // estimated NAD+ (µM)
  nadRelative: number;           // 0–1.5
  sirtuinScores: { sirt1: number; sirt3: number; sirt6: number; composite: number };
  horvathDeltaYears: number;     // negative = rejuvenating
  ampkScore: number;             // 0–100
  mitoHealthScore: number;       // 0–100
  atpYieldPerGlucose: number;    // 2–38
  pbmScore: number;              // 0–100
  pemfScore: number;             // 0–100
  epigeneticHealingIndex: number;// 0–100 composite EHI
  longevityVerdict: 'rejuvenating' | 'anti-aging' | 'maintenance' | 'accelerated_aging';
  insight: string;
}

/**
 * Full epigenetic healing analysis.
 *
 * Weighting philosophy:
 *   Mitochondrial health       25% — the root of cellular energy and longevity
 *   NAD+/Sirtuin              25% — longevity signalling axis
 *   Epigenetic clock delta     20% — actual biological age impact
 *   PBM (photobiomodulation)   15% — direct mitochondrial + COX intervention
 *   AMPK pathway               10% — autophagy/mitophagy, quality control
 *   PEMF                        5% — electromagnetic cell resonance therapy
 */
export function analyzeEpigenetics(inputs: EpigeneticInputs): EpigeneticResult {
  const o2Frac = Math.min(1, inputs.o2TensionMmhg / 100);

  const nadUM = estimateNADplus(
    inputs.biologicalAgeYears,
    inputs.mitoRcr / 8,
    inputs.freq528Dose,
    o2Frac,
    inputs.supplementScore,
  );
  const nadRel = nadRelativeScore(nadUM);

  const sirtuins = sirtuinActivity(nadUM, inputs.rosScore, inputs.freq528Dose);

  const horvath = horvathClockDelta(
    sirtuins.composite,
    50,  // telomere score — derived externally from dna-repair-engine
    inputs.rosScore,
    nadRel,
    inputs.metabolicScore,
    inputs.sessionCount,
  );

  const ampk = ampkActivationScore(
    inputs.atpAmpRatio,
    1.0, // glucose relative
    inputs.rosScore,
    inputs.freq40HzDose,
  );

  const mito = mitochondrialHealth(
    inputs.mitoDeltaPsiMv,
    inputs.mitoRcr,
    inputs.mtDnaCopyNumber,
    inputs.pbmFluenceJCm2,
  );

  const atp = atpYield(mito, o2Frac);

  const pbm = pbmTherapyScore(inputs.pbmWavelengthNm, inputs.pbmFluenceJCm2);
  const pemf = pemfTherapyScore(inputs.pemfFrequencyHz, inputs.pemfIntensityGauss, 'neuron', 30);

  // Horvath delta → score: -5 yr = 100, 0 = 50, +5 yr = 0
  const horvathScore = Math.max(0, Math.min(100, 50 - horvath * 10));

  const ehi = Math.round(
    mito           * 0.25 +
    sirtuins.composite * 0.25 +
    horvathScore   * 0.20 +
    pbm            * 0.15 +
    ampk           * 0.10 +
    pemf           * 0.05,
  );

  let verdict: EpigeneticResult['longevityVerdict'];
  if (horvath < -2 && ehi > 75) verdict = 'rejuvenating';
  else if (horvath < 0 && ehi > 55) verdict = 'anti-aging';
  else if (ehi > 40) verdict = 'maintenance';
  else verdict = 'accelerated_aging';

  const insights: string[] = [];
  if (nadUM < 300) insights.push(`NAD+ depleted (~${nadUM.toFixed(0)} µM) — NAMPT pathway under-active`);
  if (mito < 50) insights.push(`Mitochondrial health ${mito}/100 — ΔΨm or RCR compromised`);
  if (horvath < -1) insights.push(`Epigenetic clock running ${Math.abs(horvath).toFixed(1)} years younger than baseline`);
  if (pbm > 70) insights.push(`PBM at ${inputs.pbmWavelengthNm}nm achieving therapeutic COX stimulation`);
  if (atp < 15) insights.push(`Low ATP yield (${atp}/36) — oxidative phosphorylation compromised`);

  return {
    nadPlusUM: Math.round(nadUM),
    nadRelative: Math.round(nadRel * 100) / 100,
    sirtuinScores: sirtuins,
    horvathDeltaYears: horvath,
    ampkScore: ampk,
    mitoHealthScore: mito,
    atpYieldPerGlucose: atp,
    pbmScore: pbm,
    pemfScore: pemf,
    epigeneticHealingIndex: ehi,
    longevityVerdict: verdict,
    insight: insights.length > 0 ? insights.join('. ') : 'Epigenetic parameters within healing range.',
  };
}
