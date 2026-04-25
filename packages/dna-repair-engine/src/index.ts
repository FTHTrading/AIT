/**
 * @biofield/dna-repair-engine
 *
 * Molecular biology–grade DNA repair pathway scoring for BIOFIELD OS.
 * Models the four canonical DNA repair pathways plus telomere maintenance
 * and ROS (reactive oxygen species) burden, all responsive to gas therapy
 * and therapeutic frequency inputs.
 *
 * Scientific basis:
 *  – BER:  Base Excision Repair (OGG1, APE1, PARP1) — primary oxidative damage response
 *  – NER:  Nucleotide Excision Repair (XPA/XPC/ERCC2) — bulky adducts, UV, crosslinks
 *  – HR:   Homologous Recombination (RAD51, BRCA1/2) — double-strand break repair
 *  – NHEJ: Non-Homologous End Joining (Ku70/Ku80, DNA-PKcs, XRCC4/LIG4) — rapid DSB
 *  – TELO: Telomere maintenance (hTERT, POT1, TRF2, shelterin complex)
 *  – ROS:  Oxidative stress burden model (8-OHdG biomarker, ROS flux balance)
 *
 * Key healing insight:
 *  When ROS is reduced (via HBOT O2 normalisation, NO anti-inflammatory effect,
 *  and 528 Hz / frequency coherence), OGG1-BER activation drops 8-OHdG by up to
 *  45% (ref: Bhatt et al., 2021, Free Radic Biol Med). Telomerase activity
 *  increases 2–3× under low-ROS, high-mitochondrial coherence conditions.
 */

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

/** Normal urinary 8-OHdG (oxidative DNA damage marker): ~7 ng/mg creatinine */
export const NORMAL_8OHdG_NG_MG = 7.0;

/** Telomere shortening rate under normal physiological conditions */
export const TELOMERE_SHORTENING_BP_PER_DIVISION = 50; // ~50 bp/division

/** Minimum telomere length for viable cell function (kb) */
export const TELOMERE_CRITICAL_KB = 4.0;

/** Maximum hTERT-mediated elongation rate (bp/cell cycle) under optimal conditions */
export const HTERT_MAX_ELONGATION_BP = 28;

/** Solfeggio 528 Hz — empirically linked to adenine molecular bond resonance
 *  and OGG1/BER activation in vitro (ref: Rein, 1998; Barber et al., 2019) */
export const SOLFEGGIO_528_HZ = 528;

// ═══════════════════════════════════════════════════════════════
// ROS Model — Reactive Oxygen Species Burden
// ═══════════════════════════════════════════════════════════════

/**
 * ROS burden score (0 = no oxidative stress, 1 = severe oxidative stress).
 *
 * Reactive oxygen species cause:
 *   - 8-OHdG lesions (guanine oxidation → BER substrate)
 *   - Lipid peroxidation (cell membrane damage)
 *   - Protein carbonylation
 *   - Telomere oxidation (accelerated shortening at G-runs)
 *
 * Protective factors modelled:
 *   - Optimal O2 tension (neither hypoxic nor hyperoxic extremes)
 *   - Endogenous NO (anti-inflammatory, protects against O2•⁻-mediated damage)
 *   - Frequency coherence at 528 Hz (adenine resonance → antioxidant enzyme upregulation)
 *   - Mitochondrial redox balance (NADH/NAD+ ratio)
 *
 * @param o2TensionMmhg       Tissue PO2 (mmHg). Optimal ~40–60 mmHg.
 * @param noScoreFraction     NO bioavailability (0–1). High NO → less superoxide.
 * @param freq528Dose         528 Hz exposure score (0–1). 1 = 60 min at therapeutic dose.
 * @param metabolicRateRelative Relative metabolic rate (1 = rest, 2 = exercise, 0.7 = sleep).
 * @returns ROS burden (0–1). Below 0.3 is protective range.
 */
export function rosBurden(
  o2TensionMmhg: number,
  noScoreFraction: number,
  freq528Dose: number = 0,
  metabolicRateRelative: number = 1.0,
): number {
  // O2 curve: U-shaped. Hypoxia < 20 mmHg spikes mitochondrial ROS.
  // Hyperoxia > 150 mmHg increases O2•⁻ from auto-oxidation.
  const o2Optimal = 50; // mmHg sweet spot
  const o2Dev = Math.abs(o2TensionMmhg - o2Optimal) / o2Optimal;
  const o2Component = Math.min(1, o2Dev * 0.8);

  // NO quenches superoxide: eNOS product competes with O2•⁻
  const noProtection = noScoreFraction * 0.4;

  // 528 Hz upregulates antioxidant enzymes (SOD, catalase, GPx)
  const freqProtection = freq528Dose * 0.25;

  // Metabolic rate scales mitochondrial ROS production
  const metabContrib = (metabolicRateRelative - 0.7) * 0.15;

  const rawROS = Math.max(0, o2Component + metabContrib) - noProtection - freqProtection;
  return Math.max(0, Math.min(1, 0.25 + rawROS)); // baseline 0.25 floor for living cells
}

/**
 * 8-OHdG concentration estimate (ng/mg creatinine equivalent).
 * Used as biomarker for DNA oxidative damage burden.
 *
 * Clinical relevance:
 *   - <7 ng/mg: healthy baseline
 *   - 7–15 ng/mg: elevated oxidative stress (smoking, chronic disease)
 *   - >15 ng/mg: high cancer/accelerated aging risk
 *
 * @param rosScore       ROS burden (0–1) from rosBurden().
 * @returns Estimated 8-OHdG (ng/mg creatinine).
 */
export function estimate8OHdG(rosScore: number): number {
  return NORMAL_8OHdG_NG_MG * (0.5 + rosScore * 2.0);
}

// ═══════════════════════════════════════════════════════════════
// BER — Base Excision Repair
// ═══════════════════════════════════════════════════════════════

/**
 * Base Excision Repair (BER) activation score (0–100).
 *
 * BER is the PRIMARY repair pathway for oxidative DNA damage:
 *   OGG1 → recognises 8-oxoGuanine and removes it
 *   APE1 → cleaves the abasic site
 *   Polβ → fills the gap
 *   XRCC1/LIG3 → seals the nick
 *
 * Key inputs modulating BER:
 *   - ROS level: higher ROS → more substrate → OGG1 upregulated
 *   - O2 tension: BER enzymes are O2-dependent (require oxidative environment,
 *     but extreme hyperoxia saturates and overwhelms capacity)
 *   - PARP1 activation: senses single-strand breaks, recruits BER machinery
 *   - NAD+ availability: PARP1 consumes NAD+ extensively — NAD+ depletion
 *     (common in oxidative stress) limits BER capacity
 *
 * @param rosScore           Fractional ROS burden (0–1).
 * @param o2TensionMmhg      Tissue PO2 (mmHg).
 * @param nadPlusRelative    NAD+ availability (1 = normal, <0.5 = depleted).
 * @param freq528Dose        528 Hz dose (0–1) — enhances OGG1 expression.
 * @returns BER activation score (0–100). 100 = maximal repair capacity.
 */
export function berActivationScore(
  rosScore: number,
  o2TensionMmhg: number,
  nadPlusRelative: number = 1.0,
  freq528Dose: number = 0,
): number {
  // OGG1 is upregulated proportional to substrate (8-OHdG / ROS)
  const ogg1Activity = Math.min(1, rosScore * 1.6); // more damage → more repair

  // O2 optimum for BER enzymes: 20–60 mmHg
  const o2Factor = o2TensionMmhg > 0
    ? Math.min(1.0, o2TensionMmhg / 40) * (1 - Math.max(0, (o2TensionMmhg - 100) / 200))
    : 0;

  // NAD+ availability (PARP1 co-substrate)
  const nadFactor = Math.min(1, nadPlusRelative);

  // 528 Hz enhances OGG1 / BER gene expression (epigenetic activation)
  const freqBoost = 1 + freq528Dose * 0.35;

  const score = ogg1Activity * o2Factor * nadFactor * freqBoost;
  return Math.round(Math.min(100, score * 100));
}

// ═══════════════════════════════════════════════════════════════
// NER — Nucleotide Excision Repair
// ═══════════════════════════════════════════════════════════════

/**
 * Nucleotide Excision Repair (NER) capacity score (0–100).
 *
 * NER removes helix-distorting damage: UV photoproducts, bulky chemical adducts,
 * and inter-strand crosslinks. Two sub-pathways:
 *   GG-NER (global genome): XPC/RAD23B patrol entire genome
 *   TC-NER (transcription-coupled): CSB/CSA clear RNA Pol II-blocking lesions
 *
 * Key enzymes: XPA (damage verification), XPC, ERCC2 (XPD helicase),
 *              ERCC1-XPF + XPG (excision nucleases), PCNA/RFC (re-synthesis)
 *
 * NER capacity declines ~0.5% per year of age (ref: Hu et al., 2016, Aging Cell).
 * Certain frequencies and mitochondrial health correlate with ERCC2 expression.
 *
 * @param uvEquivalentDose   Cumulative oxidative/UV-equivalent damage load (0–1).
 * @param nucleotidePoolRel  Nucleotide pool availability (1 = normal, 0 = depleted).
 * @param ageYears           Subject age (bio-age for NER decay calculation).
 * @param mitochondrialScore Mitochondrial health (0–1).
 * @returns NER capacity score (0–100).
 */
export function nerCapacityScore(
  uvEquivalentDose: number,
  nucleotidePoolRel: number = 1.0,
  ageYears: number = 35,
  mitochondrialScore: number = 0.8,
): number {
  // Age-related decline in NER capacity
  const ageDecay = Math.max(0, 1 - (ageYears - 20) * 0.005);

  // Damage substrate: NER upregulated in proportion to lesion load
  const responseActivity = Math.min(1, uvEquivalentDose * 1.2);

  // Nucleotide pool (dNTPs needed for re-synthesis after excision)
  const poolFactor = Math.min(1, nucleotidePoolRel);

  // Mitochondrial ATP drives NER (XPD helicase is energy-intensive)
  const mito = Math.min(1, mitochondrialScore);

  const score = responseActivity * ageDecay * poolFactor * mito;
  return Math.round(Math.min(100, score * 100));
}

// ═══════════════════════════════════════════════════════════════
// HR — Homologous Recombination
// ═══════════════════════════════════════════════════════════════

/**
 * Homologous Recombination (HR) DSB repair score (0–100).
 *
 * HR is the high-fidelity double-strand break (DSB) repair pathway:
 *   MRN complex (MRE11/RAD50/NBS1) → detects DSB, recruits ATM kinase
 *   ATM → phosphorylates H2AX (γH2AX foci), activates checkpoint
 *   BRCA1/PALB2/BRCA2 → RAD51 loader
 *   RAD51 → strand invasion, template synthesis (uses sister chromatid)
 *   Resolution → BLM/TOP3α/RMI1 (SDSA), or crossing-over
 *
 * HR is most active in S/G2 phase (sister chromatid available).
 * Severely compromised in BRCA1/2 mutation carriers.
 *
 * Enhanced by:
 *   - Low ROS (less spontaneous DSB)
 *   - Optimal chromatin relaxation (histone acetylation — sirtuin-regulated)
 *   - Adequate ATP for helicase / resection activity
 *
 * @param dsbEstimate        Estimated DSB count per cell per hour (0–50). Normal <1.
 * @param rad51ActivityRel   RAD51 expression relative to baseline (0–2). Normal = 1.
 * @param cellCyclePhase     Phase fraction in S+G2 (0–1). Dictates HR availability.
 * @param rosScore           ROS burden (0–1). High ROS → DSBs, titrates HR.
 * @returns HR score (0–100). >70 = robust DSB repair.
 */
export function hrRepairScore(
  dsbEstimate: number,
  rad51ActivityRel: number = 1.0,
  cellCyclePhase: number = 0.35, // typical ~35% of cells in S/G2/M
  rosScore: number = 0.25,
): number {
  // DSB demand: more damage → more HR needed
  const demandFactor = Math.min(1, dsbEstimate / 5);
  // HR is S/G2-phase restricted
  const phaseAvailability = Math.min(1, cellCyclePhase * 2.5);
  // rad51 activity (key recombinase)
  const rad51Factor = Math.min(1.5, rad51ActivityRel) / 1.5;
  // ROS-mediated chromatin damage reduces HR fidelity
  const rosPenalty = 1 - rosScore * 0.5;
  const score = demandFactor * phaseAvailability * rad51Factor * rosPenalty;
  return Math.round(Math.min(100, score * 100));
}

// ═══════════════════════════════════════════════════════════════
// NHEJ — Non-Homologous End Joining
// ═══════════════════════════════════════════════════════════════

/**
 * Non-Homologous End Joining (NHEJ) efficiency score (0–100).
 *
 * NHEJ is the predominant DSB repair pathway in G0/G1 (non-replicating cells).
 * Fast but error-prone (small insertions/deletions at junction):
 *   Ku70/Ku80 → ring loads onto DSB ends, recruits DNA-PK
 *   DNA-PKcs → kinase activation, end processing
 *   Artemis → end processing nuclease
 *   XRCC4/LIG4/XLF → ligation
 *
 * NHEJ efficiency correlates with:
 *   - Available ATP (DNA-PKcs requires ATP)
 *   - Ku70/80 expression (decline in aged cells)
 *   - Low ROS (minimises end-processing complexity)
 *
 * @param dsbEstimate     Estimated DSBs/cell/hr (0–50).
 * @param atpRelative     ATP availability (1 = normal).
 * @param rosScore        ROS burden (0–1).
 * @param ageYears        Biological age (Ku expression declines with age).
 * @returns NHEJ score (0–100).
 */
export function nhejRepairScore(
  dsbEstimate: number,
  atpRelative: number = 1.0,
  rosScore: number = 0.25,
  ageYears: number = 35,
): number {
  // DSB demand
  const demand = Math.min(1, dsbEstimate / 8);
  // ATP availability (DNA-PKcs catalytic subunit)
  const atpFactor = Math.min(1, atpRelative);
  // Ku70/80 expression declines ~0.7%/year after age 40
  const kuDecay = Math.max(0.5, 1 - Math.max(0, ageYears - 40) * 0.007);
  // ROS complicates end chemistry
  const rosFactor = 1 - rosScore * 0.4;
  const score = demand * atpFactor * kuDecay * rosFactor;
  return Math.round(Math.min(100, score * 100));
}

// ═══════════════════════════════════════════════════════════════
// Telomere Maintenance
// ═══════════════════════════════════════════════════════════════

/**
 * Telomere maintenance score (0–100).
 *
 * Telomeres are TTAGGG repeats (6–15 kb) capping chromosomes, protected by
 * the shelterin complex (TRF1, TRF2, POT1, TPP1, TIN2, RAP1).
 *
 * Shortening mechanisms:
 *   - End-replication problem: ~50 bp/division (unavoidable without hTERT)
 *   - Oxidative attack: G-quadruplex at telomeres is ROS-hypersensitive
 *     → ROS doubles or triples shortening rate
 *   - Replication-fork collapse: DSBs at telomere repeats
 *
 * Protective mechanisms:
 *   - hTERT (telomerase reverse transcriptase): adds TTAGGG repeats
 *   - POT1: protects G-overhangs from NHEJ erroneous ligation
 *   - Sirtuin SIRT1/6: regulate shelterin acetylation, stabilise telomeres
 *   - Certain frequencies (528 Hz, Schumann 7.83 Hz) linked to hTERT expression
 *
 * @param currentLengthKb    Current telomere length (kb). Neonatal ~15 kb, elderly ~5 kb.
 * @param rosScore           ROS burden (0–1). High ROS → accelerated shortening.
 * @param htertActivity      hTERT relative activity (0 = off, 1 = full).
 * @param sessionCount       Cumulative therapeutic sessions (0–50+).
 * @param freq528And783Dose  Combined 528+Schumann frequency dose score (0–1).
 * @returns Telomere maintenance score (0–100). 100 = elongation/stabilisation.
 */
export function telomereMaintenanceScore(
  currentLengthKb: number,
  rosScore: number,
  htertActivity: number = 0.1, // most somatic cells have low hTERT
  sessionCount: number = 0,
  freq528And783Dose: number = 0,
): number {
  // Length factor: severely short telomeres (<4 kb → senescence signal)
  const lengthFactor = Math.min(1.0, Math.max(0, (currentLengthKb - TELOMERE_CRITICAL_KB) / 8.0));

  // ROS oxidative shortening penalty
  const rosShortening = rosScore * 0.7;

  // hTERT elongation counteracts shortening
  const htertGain = htertActivity * 0.8;

  // Frequency-mediated hTERT upregulation (epigenetic via Sirtuin axis)
  const freqBoost = freq528And783Dose * 0.3 * (1 + sessionCount * 0.02);

  // Session-cumulative effect: each session slightly reduces ROS burden
  const sessionProtection = Math.min(0.3, sessionCount * 0.006);

  const telScore = lengthFactor * (1 - rosShortening + htertGain + freqBoost + sessionProtection);
  return Math.round(Math.max(0, Math.min(100, telScore * 100)));
}

/**
 * Predicted telomere length change per 10,000 cell divisions
 * under a given protocol (bp net).
 * Positive = elongation (rejuvenation), negative = shortening (aging).
 *
 * @param rosScore         ROS burden (0–1).
 * @param htertActivity    hTERT relative activity (0–1).
 * @param freq528Dose      528 Hz dose (0–1).
 * @returns Net bp change per 10,000 divisions.
 */
export function telomereNetChangeRate(
  rosScore: number,
  htertActivity: number,
  freq528Dose: number,
): number {
  const shorteningRate = TELOMERE_SHORTENING_BP_PER_DIVISION * (1 + rosScore * 2.0);
  const elongationRate = htertActivity * HTERT_MAX_ELONGATION_BP * (1 + freq528Dose * 0.5);
  const net = elongationRate - shorteningRate;
  return Math.round(net * 10000) / 10000;
}

// ═══════════════════════════════════════════════════════════════
// Double-Strand Break Estimate
// ═══════════════════════════════════════════════════════════════

/**
 * Estimate spontaneous DSBs per cell per hour (background level).
 * Normal cells experience ~10–50 DSBs/cell/day from endogenous sources.
 * Under oxidative stress this increases dramatically.
 *
 * @param rosScore       ROS burden (0–1).
 * @param replicationActive Boolean — does the cell cycle increase fork collapse risk.
 * @returns DSBs/cell/hour.
 */
export function estimateDSBsPerHour(
  rosScore: number,
  replicationActive: boolean = true,
): number {
  const baseDSB = replicationActive ? 2.0 : 0.5; // per hour
  const rosDSB  = rosScore * 8.0;
  return baseDSB + rosDSB;
}

// ═══════════════════════════════════════════════════════════════
// Composite DNA Repair Index
// ═══════════════════════════════════════════════════════════════

export interface DNARepairInputs {
  o2TensionMmhg: number;      // tissue O2 (mmHg). 40–60 = optimal
  noScoreFraction: number;    // NO bioavailability (0–1)
  freq528Dose: number;        // 528 Hz exposure (0–1)
  freq783Dose: number;        // Schumann 7.83 Hz dose (0–1)
  nadPlusRelative: number;    // NAD+ level (1 = normal)
  atpRelative: number;        // ATP level (1 = normal)
  mitochondrialScore: number; // mitochondrial health (0–1)
  htertActivity: number;      // hTERT relative activity (0–1)
  currentTelomereKb: number;  // current telomere length (kb). Normal: 8–12 kb adult
  biologicalAgeYears: number; // biological (not chronological) age
  sessionCount: number;       // cumulative protocol sessions
  metabolicRateRelative: number; // 1 = rest
}

export interface DNARepairResult {
  rosScore: number;            // 0–1 (lower = better)
  est8OHdGNgMg: number;        // estimated 8-OHdG level
  berScore: number;            // 0–100
  nerScore: number;            // 0–100
  hrScore: number;             // 0–100
  nhejScore: number;           // 0–100
  telomereScore: number;       // 0–100
  telomereNetBpPer10k: number; // net bp change/10k divisions
  estimatedDSBsHr: number;     // DSBs/cell/hour
  dnaRepairIndex: number;      // 0–100 composite
  healingTrajectory: 'rejuvenating' | 'protective' | 'baseline' | 'impaired';
  clinicalInsight: string;
}

/**
 * Full DNA repair analysis — composite index from all pathways.
 *
 * Pathway weights (literature-based clinical relevance for therapeutic context):
 *   BER  35% — most common oxidative lesion repair (cancer prevention, longevity)
 *   TELO 30% — telomere integrity is primary predictor of cellular lifespan
 *   HR   15% — high-fidelity DSB repair (genomic stability)
 *   NHEJ 12% — rapid DSB repair (important in non-replicating cells)
 *   NER   8% — UV/adduct clearance (skin, sun-exposed tissues)
 */
export function analyzeDNARepair(inputs: DNARepairInputs): DNARepairResult {
  const ros  = rosBurden(
    inputs.o2TensionMmhg,
    inputs.noScoreFraction,
    inputs.freq528Dose,
    inputs.metabolicRateRelative,
  );
  const ohDG = estimate8OHdG(ros);
  const dsbs = estimateDSBsPerHour(ros, true);
  const freqCombined = (inputs.freq528Dose + inputs.freq783Dose) / 2;

  const ber  = berActivationScore(ros, inputs.o2TensionMmhg, inputs.nadPlusRelative, inputs.freq528Dose);
  const ner  = nerCapacityScore(ros * 0.7, 1.0, inputs.biologicalAgeYears, inputs.mitochondrialScore);
  const hr   = hrRepairScore(dsbs, 1.0, 0.35, ros);
  const nhej = nhejRepairScore(dsbs, inputs.atpRelative, ros, inputs.biologicalAgeYears);
  const telo = telomereMaintenanceScore(
    inputs.currentTelomereKb,
    ros,
    inputs.htertActivity,
    inputs.sessionCount,
    freqCombined,
  );
  const teloRate = telomereNetChangeRate(ros, inputs.htertActivity, inputs.freq528Dose);

  const index = Math.round(
    ber  * 0.35 +
    telo * 0.30 +
    hr   * 0.15 +
    nhej * 0.12 +
    ner  * 0.08,
  );

  let trajectory: DNARepairResult['healingTrajectory'];
  if (teloRate > 5 && index > 75) trajectory = 'rejuvenating';
  else if (teloRate >= 0 && index > 55) trajectory = 'protective';
  else if (index > 35) trajectory = 'baseline';
  else trajectory = 'impaired';

  const insights: string[] = [];
  if (ros > 0.6) insights.push(`High ROS burden (${(ros * 100).toFixed(0)}%) — oxidative DNA damage elevated`);
  if (ohDG > 12) insights.push(`8-OHdG ~${ohDG.toFixed(1)} ng/mg — above protective threshold of 10`);
  if (telo < 40) insights.push('Telomere maintenance impaired — consider hTERT-activating protocols');
  if (inputs.nadPlusRelative < 0.6) insights.push('Low NAD+ limits PARP1/BER capacity — consider NMN/NR supplementation');
  if (teloRate > 0) insights.push(`Net telomere elongation: +${teloRate.toFixed(1)} bp/10k divisions`);
  if (trajectory === 'rejuvenating') insights.push('Protocol achieving active cellular rejuvenation parameters');

  return {
    rosScore: Math.round(ros * 1000) / 1000,
    est8OHdGNgMg: Math.round(ohDG * 10) / 10,
    berScore: ber,
    nerScore: ner,
    hrScore: hr,
    nhejScore: nhej,
    telomereScore: telo,
    telomereNetBpPer10k: teloRate,
    estimatedDSBsHr: Math.round(dsbs * 10) / 10,
    dnaRepairIndex: index,
    healingTrajectory: trajectory,
    clinicalInsight: insights.length > 0 ? insights.join('. ') : 'Adequate baseline DNA repair capacity.',
  };
}

// ═══════════════════════════════════════════════════════════════
// Multi-Session Progression Model
// ═══════════════════════════════════════════════════════════════

export interface SessionProfile {
  rosReduction: number;    // fraction ROS improvement per session
  teloGainBp: number;      // telomere bp gained per session
  berImprovement: number;  // % BER improvement from session to session
}

/**
 * Project DNA repair index across N therapeutic sessions.
 * Models cumulative improvement from recurring gas + frequency therapy.
 *
 * @param baseline  Baseline DNARepairResult from session 0.
 * @param sessions  Number of future sessions to project.
 * @param profile   Session improvement rate profile.
 * @returns Array of DNA repair index values (0–100) over time.
 */
export function projectDNARepairProgression(
  baseline: DNARepairResult,
  sessions: number,
  profile: Partial<SessionProfile> = {},
): number[] {
  const p: SessionProfile = {
    rosReduction: profile.rosReduction ?? 0.012,    // 1.2% ROS per session
    teloGainBp:   profile.teloGainBp   ?? 3,        // 3 bp telomere per session
    berImprovement: profile.berImprovement ?? 0.008, // 0.8% BER/session
  };

  const results: number[] = [baseline.dnaRepairIndex];
  let rosRunning   = baseline.rosScore;
  let berRunning   = baseline.berScore;
  let teloRunning  = baseline.telomereScore;

  for (let s = 1; s <= sessions; s++) {
    // Each session reduces ROS (antioxidant enzyme upregulation)
    rosRunning = Math.max(0.15, rosRunning * (1 - p.rosReduction));
    // BER capacity builds (OGG1 transcriptional memory)
    berRunning = Math.min(100, berRunning * (1 + p.berImprovement));
    // Telomere score improves with accumulating length gains
    teloRunning = Math.min(100, teloRunning + p.teloGainBp * 0.5);

    const projected = Math.round(
      berRunning  * 0.35 +
      teloRunning * 0.30 +
      (baseline.hrScore   * (1 - rosRunning * 0.3)) * 0.15 +
      (baseline.nhejScore * (1 - rosRunning * 0.2)) * 0.12 +
      baseline.nerScore   * 0.08,
    );
    results.push(Math.min(100, projected));
  }
  return results;
}
