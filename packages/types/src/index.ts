// ─── BIOFIELD OS — Domain Types ───
// AI-Orchestrated Gas, Signal, and Organ Support Research Platform
// All 22 domain entities + supporting enums and value types.

// ═══════════════════════════════════════════════
// Enums
// ═══════════════════════════════════════════════

export type SimulationMode = 'realtime' | 'accelerated' | 'step' | 'replay';
export type SessionStatus = 'idle' | 'running' | 'paused' | 'completed' | 'aborted';
export type OrganSystem = 'lung' | 'cardiac' | 'renal' | 'metabolic' | 'inflammatory';
export type GasType = 'O2' | 'CO2' | 'N2O' | 'NO' | 'He' | 'air' | 'custom';
export type SignalType = 'ecg' | 'eeg' | 'emg' | 'ppg' | 'spo2' | 'capnography' | 'ventilator_waveform' | 'custom';
export type AlarmSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type LockLevel = 'advisory' | 'enforced' | 'emergency_stop';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type RecommendationUrgency = 'routine' | 'soon' | 'urgent' | 'immediate';
export type ActionOutcome = 'success' | 'partial' | 'failed' | 'overridden';

// ═══════════════════════════════════════════════
// 1. PatientSimulationProfile
// ═══════════════════════════════════════════════

export interface PatientSimulationProfile {
  id: string;
  label: string;
  age: number;
  weightKg: number;
  heightCm: number;
  sex: 'male' | 'female' | 'other';
  baselineConditions: string[];
  activeOrganSystems: OrganSystem[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// ═══════════════════════════════════════════════
// 2–6. Organ States
// ═══════════════════════════════════════════════

export interface OrganState {
  id: string;
  profileId: string;
  organ: OrganSystem;
  timestampMs: number;
  parameters: Record<string, number>;
  derivedMetrics: Record<string, number>;
  trending: 'improving' | 'stable' | 'deteriorating' | 'critical';
  notes: string;
}

export interface LungState extends OrganState {
  organ: 'lung';
  parameters: {
    tidalVolumeMl: number;
    respiratoryRate: number;
    peepCmH2O: number;
    fio2Pct: number;
    plateauPressureCmH2O: number;
    complianceMlCmH2O: number;
    pao2Mmhg: number;
    paco2Mmhg: number;
    spo2Pct: number;
    etco2Mmhg: number;
    minuteVentilationLpm: number;
    [key: string]: number;
  };
}

export interface CardiacState extends OrganState {
  organ: 'cardiac';
  parameters: {
    heartRateBpm: number;
    systolicMmhg: number;
    diastolicMmhg: number;
    meanArterialPressureMmhg: number;
    cardiacOutputLpm: number;
    strokeVolumeMl: number;
    svri: number;
    cvpMmhg: number;
    ejectionFractionPct: number;
    [key: string]: number;
  };
}

export interface RenalState extends OrganState {
  organ: 'renal';
  parameters: {
    urineOutputMlHr: number;
    creatinineMgDl: number;
    bunMgDl: number;
    gfrMlMin: number;
    serumPotassiumMeqL: number;
    serumSodiumMeqL: number;
    fluidBalanceMl: number;
    [key: string]: number;
  };
}

export interface MetabolicState extends OrganState {
  organ: 'metabolic';
  parameters: {
    glucoseMgDl: number;
    lactateMmolL: number;
    phArterial: number;
    hco3MeqL: number;
    baseExcess: number;
    temperatureC: number;
    vo2MlMin: number;
    vco2MlMin: number;
    respiratoryQuotient: number;
    [key: string]: number;
  };
}

export interface InflammatoryState extends OrganState {
  organ: 'inflammatory';
  parameters: {
    wbcK: number;
    cReactiveProteinMgL: number;
    procalcitoninNgMl: number;
    il6PgMl: number;
    tnfAlphaPgMl: number;
    dDimerNgMl: number;
    ferritinNgMl: number;
    sofaScore: number;
    [key: string]: number;
  };
}

// ═══════════════════════════════════════════════
// 7. GasCircuitState
// ═══════════════════════════════════════════════

export interface GasCircuitState {
  id: string;
  profileId: string;
  timestampMs: number;
  channels: GasChannelReading[];
  totalFlowLpm: number;
  mixturePct: Record<GasType, number>;
  deliveryPressureKpa: number;
  humidityPct: number;
  temperatureC: number;
}

export interface GasChannelReading {
  gasType: GasType;
  flowLpm: number;
  concentrationPct: number;
  pressureKpa: number;
  valvePositionPct: number;
}

// ═══════════════════════════════════════════════
// 8. GasCommand
// ═══════════════════════════════════════════════

export interface GasCommand {
  id: string;
  profileId: string;
  issuedAt: Date;
  gasType: GasType;
  targetFlowLpm: number;
  targetConcentrationPct: number;
  rampDurationMs: number;
  source: 'operator' | 'ai' | 'protocol' | 'safety';
  approved: boolean;
  executedAt?: Date;
  safetyLockId?: string;
}

// ═══════════════════════════════════════════════
// 9–11. Signal Domain
// ═══════════════════════════════════════════════

export interface SignalProgram {
  id: string;
  name: string;
  description: string;
  channels: SignalChannel[];
  durationMs: number;
  looping: boolean;
  createdBy: string;
  version: number;
  createdAt: Date;
}

export interface SignalChannel {
  id: string;
  programId: string;
  signalType: SignalType;
  label: string;
  sampleRateHz: number;
  amplitudeRange: [number, number];
  baselineValue: number;
  noiseLevel: number;
  waveformGeneratorId: string;
  constraints: SignalConstraint[];
}

export interface SignalConstraint {
  id: string;
  channelId: string;
  parameterName: string;
  minValue: number;
  maxValue: number;
  alarmOnViolation: boolean;
  lockOnViolation: boolean;
  description: string;
}

// ═══════════════════════════════════════════════
// 12–13. Safety Domain
// ═══════════════════════════════════════════════

export interface SafetyLock {
  id: string;
  profileId: string;
  level: LockLevel;
  reason: string;
  triggeredBy: string;
  affectedSystems: OrganSystem[];
  affectedGasTypes: GasType[];
  overrideRequiresApproval: boolean;
  activatedAt: Date;
  deactivatedAt?: Date;
  deactivatedBy?: string;
}

export interface AlarmEvent {
  id: string;
  profileId: string;
  severity: AlarmSeverity;
  source: string;
  organ?: OrganSystem;
  parameterName: string;
  currentValue: number;
  thresholdValue: number;
  message: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  firedAt: Date;
}

// ═══════════════════════════════════════════════
// 14. Recommendation (AI Engine output)
// ═══════════════════════════════════════════════

export interface Recommendation {
  id: string;
  profileId: string;
  urgency: RecommendationUrgency;
  title: string;
  rationale: string;
  suggestedActions: SuggestedAction[];
  modelVersionId: string;
  confidence: number;
  inputSnapshot: Record<string, unknown>;
  createdAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  rejectedReason?: string;
}

export interface SuggestedAction {
  type: 'gas_command' | 'alarm_adjust' | 'signal_change' | 'protocol_change' | 'manual_intervention';
  description: string;
  payload: Record<string, unknown>;
}

// ═══════════════════════════════════════════════
// 15. ProtocolTemplate
// ═══════════════════════════════════════════════

export interface ProtocolTemplate {
  id: string;
  name: string;
  description: string;
  version: number;
  steps: ProtocolStep[];
  applicableOrgans: OrganSystem[];
  safetyConstraints: SignalConstraint[];
  gasPresets: Partial<GasCommand>[];
  createdBy: string;
  approvedBy?: string;
  createdAt: Date;
}

export interface ProtocolStep {
  order: number;
  label: string;
  durationMs: number;
  gasCommands: Partial<GasCommand>[];
  expectedSignals: Partial<SignalChannel>[];
  safetyChecks: string[];
  autoAdvance: boolean;
}

// ═══════════════════════════════════════════════
// 16. OperatorAction
// ═══════════════════════════════════════════════

export interface OperatorAction {
  id: string;
  profileId: string;
  operatorId: string;
  actionType: string;
  description: string;
  targetEntity: string;
  targetEntityId: string;
  payload: Record<string, unknown>;
  outcome: ActionOutcome;
  resultNotes: string;
  performedAt: Date;
}

// ═══════════════════════════════════════════════
// 17. AuditEvent
// ═══════════════════════════════════════════════

export interface AuditEvent {
  id: string;
  sessionId: string;
  profileId?: string;
  eventType: string;
  actor: string;
  actorType: 'operator' | 'ai' | 'system' | 'safety';
  description: string;
  entityType: string;
  entityId: string;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
  contentHash: string;
  timestamp: Date;
}

// ═══════════════════════════════════════════════
// 18. SessionPlayback
// ═══════════════════════════════════════════════

export interface SessionPlayback {
  id: string;
  profileId: string;
  mode: SimulationMode;
  status: SessionStatus;
  startedAt: Date;
  endedAt?: Date;
  speedMultiplier: number;
  totalEventsRecorded: number;
  snapshotIntervalMs: number;
  operatorIds: string[];
  protocolId?: string;
  notes: string;
}

// ═══════════════════════════════════════════════
// 19. ModelVersion (AI model registry)
// ═══════════════════════════════════════════════

export interface ModelVersion {
  id: string;
  modelName: string;
  version: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  trainingDataRef: string;
  metricsSnapshot: Record<string, number>;
  status: 'draft' | 'validating' | 'approved' | 'deprecated';
  approvedBy?: string;
  createdAt: Date;
}

// ═══════════════════════════════════════════════
// 20. ApprovalRequest
// ═══════════════════════════════════════════════

export interface ApprovalRequest {
  id: string;
  requestType: 'model_deploy' | 'safety_override' | 'gas_command' | 'protocol_change';
  requesterId: string;
  entityType: string;
  entityId: string;
  description: string;
  status: ApprovalStatus;
  reviewerId?: string;
  reviewNotes?: string;
  requestedAt: Date;
  resolvedAt?: Date;
}

// ═══════════════════════════════════════════════
// 21. EmergencyStopEvent
// ═══════════════════════════════════════════════

export interface EmergencyStopEvent {
  id: string;
  profileId: string;
  triggeredBy: string;
  triggerSource: 'operator' | 'safety_engine' | 'ai' | 'hardware';
  reason: string;
  affectedSystems: OrganSystem[];
  gasStateAtStop: Partial<GasCircuitState>;
  organStatesAtStop: Record<OrganSystem, Partial<OrganState>>;
  resolvedAt?: Date;
  resolvedBy?: string;
  postMortemNotes?: string;
  occurredAt: Date;
}

// ═══════════════════════════════════════════════
// Simulation Session (top-level aggregate)
// ═══════════════════════════════════════════════

export interface SimulationSession {
  id: string;
  profile: PatientSimulationProfile;
  playback: SessionPlayback;
  organStates: Map<OrganSystem, OrganState>;
  gasCircuit: GasCircuitState;
  activeSignalProgram?: SignalProgram;
  activeProtocol?: ProtocolTemplate;
  activeSafetyLocks: SafetyLock[];
  pendingRecommendations: Recommendation[];
  alarms: AlarmEvent[];
}
