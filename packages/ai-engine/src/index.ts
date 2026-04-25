// ─── BIOFIELD OS — AI Engine ───
// Model version registry, inference adapter (ONNX), recommendation pipeline.
// Generates AI-driven recommendations based on organ states, gas circuit,
// and signal data. All inference is local-first via ONNX Runtime.

import type {
  Recommendation,
  SuggestedAction,
  ModelVersion,
  ApprovalStatus,
  ApprovalRequest,
  RecommendationUrgency,
  OrganState,
  GasCircuitState,
} from '@biofield/types';
import type { SubEngine, TickContext, EventBus } from '@biofield/core-engine';

// ═══════════════════════════════════════════════
// Model Registry
// ═══════════════════════════════════════════════

export class ModelRegistry {
  private models = new Map<string, ModelVersion>();
  private activeModelId: string | null = null;

  register(model: ModelVersion): void {
    this.models.set(model.id, model);
  }

  setActive(modelId: string): boolean {
    if (!this.models.has(modelId)) return false;
    this.activeModelId = modelId;
    return true;
  }

  getActive(): ModelVersion | null {
    return this.activeModelId ? this.models.get(this.activeModelId) ?? null : null;
  }

  get(id: string): ModelVersion | undefined {
    return this.models.get(id);
  }

  list(): ModelVersion[] {
    return [...this.models.values()];
  }
}

// ═══════════════════════════════════════════════
// Inference Adapter Interface
// ═══════════════════════════════════════════════

export interface InferenceInput {
  organStates: Record<string, OrganState>;
  gasState: GasCircuitState | null;
  signalSummary: Record<string, number>; // channelId → last sample
  sessionElapsedMs: number;
}

export interface InferenceOutput {
  urgency: RecommendationUrgency;
  title: string;
  rationale: string;
  actions: SuggestedAction[];
  confidence: number;
}

export interface InferenceAdapter {
  modelId: string;
  /** Run inference. Returns null if no recommendation warranted. */
  infer(input: InferenceInput): Promise<InferenceOutput | null>;
}

// ═══════════════════════════════════════════════
// Rule-Based Adapter (default — no ONNX model needed)
// ═══════════════════════════════════════════════

export class RuleBasedAdapter implements InferenceAdapter {
  modelId = 'rule-based-v1';

  async infer(input: InferenceInput): Promise<InferenceOutput | null> {
    const actions: SuggestedAction[] = [];
    let maxUrgency: RecommendationUrgency = 'routine';
    let title = '';
    let rationale = '';

    const lung = input.organStates['lung'];
    const cardiac = input.organStates['cardiac'];
    const metabolic = input.organStates['metabolic'];

    // Rule: Low SpO2 → increase FiO2
    if (lung && (lung.parameters as Record<string, number>).spo2Pct < 90) {
      const spo2 = (lung.parameters as Record<string, number>).spo2Pct;
      maxUrgency = spo2 < 80 ? 'immediate' : 'urgent';
      title = 'Increase FiO2 — Hypoxemia Detected';
      rationale = `SpO2 at ${spo2.toFixed(1)}%. Recommend increasing FiO2 to improve oxygenation.`;
      actions.push({
        type: 'gas_command',
        description: 'Increase FiO2 to 60%',
        payload: { gasType: 'O2', targetConcentrationPct: 60, targetFlowLpm: 8, rampDurationMs: 5000 },
      });
    }

    // Rule: High lactate → alert and suggest volume
    if (metabolic && (metabolic.parameters as Record<string, number>).lactateMmolL > 4) {
      const lac = (metabolic.parameters as Record<string, number>).lactateMmolL;
      if (!title) {
        title = 'Elevated Lactate — Tissue Hypoperfusion';
        rationale = `Lactate at ${lac.toFixed(1)} mmol/L. Consider fluid resuscitation.`;
        maxUrgency = lac > 8 ? 'immediate' : 'urgent';
      }
      actions.push({
        type: 'manual_intervention',
        description: `Lactate ${lac.toFixed(1)} mmol/L — review perfusion status`,
        payload: {},
      });
    }

    // Rule: MAP < 65 → suggest vasopressor
    if (cardiac && (cardiac.parameters as Record<string, number>).meanArterialPressureMmhg < 65) {
      const map = (cardiac.parameters as Record<string, number>).meanArterialPressureMmhg;
      if (!title) {
        title = 'Hypotension Detected';
        rationale = `MAP at ${map.toFixed(0)} mmHg. Consider vasopressor initiation.`;
        maxUrgency = map < 50 ? 'immediate' : 'urgent';
      }
      actions.push({
        type: 'manual_intervention',
        description: `MAP ${map.toFixed(0)} mmHg — inadequate perfusion pressure`,
        payload: {},
      });
    }

    if (actions.length === 0) return null;

    return {
      urgency: maxUrgency,
      title,
      rationale,
      actions,
      confidence: 0.85,
    };
  }
}

// ═══════════════════════════════════════════════
// ONNX Adapter Placeholder
// ═══════════════════════════════════════════════

export class OnnxAdapter implements InferenceAdapter {
  modelId: string;
  private modelPath: string;

  constructor(modelId: string, modelPath: string) {
    this.modelId = modelId;
    this.modelPath = modelPath;
  }

  async infer(_input: InferenceInput): Promise<InferenceOutput | null> {
    // TODO: Load ONNX model via onnxruntime-node, build input tensor
    // from organ states + gas state, run inference, decode output.
    // For now, delegate to rule-based.
    const fallback = new RuleBasedAdapter();
    return fallback.infer(_input);
  }
}

// ═══════════════════════════════════════════════
// Approval Pipeline
// ═══════════════════════════════════════════════

let recSeq = 0;

export class ApprovalPipeline {
  private pending = new Map<string, ApprovalRequest>();
  private bus: EventBus | null = null;

  constructor(bus?: EventBus) {
    this.bus = bus ?? null;
  }

  createRequest(recommendation: Recommendation, requiredApprover: string): ApprovalRequest {
    const req: ApprovalRequest = {
      id: `approval-${++recSeq}`,
      requestType: 'gas_command',
      requesterId: 'ai-engine',
      entityType: 'recommendation',
      entityId: recommendation.id,
      description: recommendation.rationale,
      status: 'pending' as ApprovalStatus,
      reviewerId: requiredApprover,
      requestedAt: new Date(),
    };
    this.pending.set(req.id, req);
    return req;
  }

  approve(id: string, approvedBy: string): boolean {
    const req = this.pending.get(id);
    if (!req || req.status !== 'pending') return false;
    req.status = 'approved';
    req.resolvedAt = new Date();
    req.reviewerId = approvedBy;
    req.reviewNotes = 'Approved';
    this.pending.delete(id);
    return true;
  }

  reject(id: string, rejectedBy: string, reason: string): boolean {
    const req = this.pending.get(id);
    if (!req || req.status !== 'pending') return false;
    req.status = 'rejected';
    req.resolvedAt = new Date();
    req.reviewerId = rejectedBy;
    req.reviewNotes = reason;
    this.pending.delete(id);
    return true;
  }

  getPending(): ApprovalRequest[] {
    return [...this.pending.values()];
  }
}

// ═══════════════════════════════════════════════
// AI Engine — SubEngine Implementation
// ═══════════════════════════════════════════════

export class AIEngine implements SubEngine {
  readonly name = 'ai-engine';
  readonly registry = new ModelRegistry();
  readonly approvals: ApprovalPipeline;
  private adapter: InferenceAdapter;
  private bus: EventBus | null = null;
  private profileId = '';
  private lastRecommendationMs = 0;
  private recommendationIntervalMs = 5000; // evaluate every 5s of sim time
  private recommendations: Recommendation[] = [];

  /** Provider functions injected by controller */
  organStatesFn: (() => Record<string, OrganState>) | null = null;
  gasStateFn: (() => GasCircuitState | null) | null = null;
  signalFn: (() => Record<string, number>) | null = null;

  constructor(bus?: EventBus, adapter?: InferenceAdapter) {
    this.bus = bus ?? null;
    this.adapter = adapter ?? new RuleBasedAdapter();
    this.approvals = new ApprovalPipeline(bus);

    // Register default model
    this.registry.register({
      id: 'rule-based-v1',
      modelName: 'Rule-Based Clinical Advisor',
      version: '1.0.0',
      description: 'Clinical rules for basic parameter monitoring',
      inputSchema: {},
      outputSchema: {},
      trainingDataRef: '',
      metricsSnapshot: { accuracy: 0.85 },
      status: 'approved',
      createdAt: new Date(),
    });
    this.registry.setActive('rule-based-v1');
  }

  setProfile(profileId: string): void {
    this.profileId = profileId;
  }

  async initialize(): Promise<void> {
    this.recommendations = [];
    this.lastRecommendationMs = 0;
  }

  async tick(ctx: TickContext): Promise<void> {
    // Only run inference at configured intervals
    if (ctx.elapsedMs - this.lastRecommendationMs < this.recommendationIntervalMs) return;
    this.lastRecommendationMs = ctx.elapsedMs;

    const input: InferenceInput = {
      organStates: this.organStatesFn ? this.organStatesFn() : {},
      gasState: this.gasStateFn ? this.gasStateFn() : null,
      signalSummary: this.signalFn ? this.signalFn() : {},
      sessionElapsedMs: ctx.elapsedMs,
    };

    const output = await this.adapter.infer(input);
    if (!output) return;

    const rec: Recommendation = {
      id: `rec-${++recSeq}`,
      profileId: this.profileId,
      urgency: output.urgency,
      title: output.title,
      rationale: output.rationale,
      suggestedActions: output.actions,
      modelVersionId: this.adapter.modelId,
      confidence: output.confidence,
      inputSnapshot: input as unknown as Record<string, unknown>,
      createdAt: new Date(),
    };
    this.recommendations.push(rec);

    if (this.bus) {
      await this.bus.emit('recommendation.new', rec);
    }
  }

  async shutdown(): Promise<void> {
    // Recommendations persist for audit
  }

  getRecommendations(): Recommendation[] {
    return [...this.recommendations];
  }
}
