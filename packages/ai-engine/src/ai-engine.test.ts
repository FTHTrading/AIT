import { describe, it, expect } from 'vitest';
import { ModelRegistry, RuleBasedAdapter, ApprovalPipeline, AIEngine } from './index.js';

describe('ModelRegistry', () => {
  it('should register and retrieve a model', () => {
    const registry = new ModelRegistry();
    registry.register({
      id: 'test-model',
      modelName: 'Test Model',
      version: '1.0.0',
      description: 'A test model',
      inputSchema: {},
      outputSchema: {},
      trainingDataRef: '',
      metricsSnapshot: {},
      status: 'draft',
      createdAt: new Date(),
    });
    expect(registry.get('test-model')).toBeDefined();
    expect(registry.list()).toHaveLength(1);
  });

  it('should set active model', () => {
    const registry = new ModelRegistry();
    registry.register({
      id: 'model-a',
      modelName: 'Model A',
      version: '1.0.0',
      description: 'A',
      inputSchema: {},
      outputSchema: {},
      trainingDataRef: '',
      metricsSnapshot: {},
      status: 'approved',
      createdAt: new Date(),
    });
    expect(registry.setActive('model-a')).toBe(true);
    expect(registry.getActive()?.id).toBe('model-a');
  });

  it('should return false for unknown model', () => {
    const registry = new ModelRegistry();
    expect(registry.setActive('nonexistent')).toBe(false);
  });
});

describe('RuleBasedAdapter', () => {
  it('should infer decisions from input', async () => {
    const adapter = new RuleBasedAdapter();
    const result = await adapter.infer({
      organStates: {
        lung: { id: '', profileId: '', organ: 'lung', timestampMs: 0, parameters: { spo2Pct: 85, tidalVolumeMl: 500, respiratoryRate: 14 }, derivedMetrics: {}, trending: 'stable', notes: '' },
        cardiac: { id: '', profileId: '', organ: 'cardiac', timestampMs: 0, parameters: { heartRate: 72, strokeVolumeMl: 70 }, derivedMetrics: {}, trending: 'stable', notes: '' },
        metabolic: { id: '', profileId: '', organ: 'metabolic', timestampMs: 0, parameters: { temperature: 37, ph: 7.4 }, derivedMetrics: {}, trending: 'stable', notes: '' },
      },
      gasState: null,
      signalSummary: {},
      sessionElapsedMs: 1000,
    });
    // With spo2Pct=85 (<90), the rule-based adapter should suggest increasing FiO2
    expect(result).not.toBeNull();
    expect(result!.actions.length).toBeGreaterThanOrEqual(1);
    expect(result!.title).toContain('Hypoxemia');
  });
});

describe('ApprovalPipeline', () => {
  it('should create, approve, and track requests', () => {
    const pipeline = new ApprovalPipeline();
    const req = pipeline.createRequest(
      { id: 'rec-1', profileId: 'sess-1', urgency: 'routine', title: 'Increase O2', rationale: 'Increase O2 to correct hypoxemia', suggestedActions: [], modelVersionId: 'rule-based-v1', confidence: 0.9, inputSnapshot: {}, createdAt: new Date() },
      'dr-smith',
    );
    expect(req).toBeDefined();
    expect(pipeline.getPending()).toHaveLength(1);

    const approved = pipeline.approve(req.id, 'dr-smith');
    expect(approved).toBe(true);
    expect(pipeline.getPending()).toHaveLength(0);
  });

  it('should reject requests', () => {
    const pipeline = new ApprovalPipeline();
    const req = pipeline.createRequest(
      { id: 'rec-2', profileId: 'sess-2', urgency: 'routine', title: 'Decrease CO2', rationale: 'Decrease CO2 target', suggestedActions: [], modelVersionId: 'rule-based-v1', confidence: 0.7, inputSnapshot: {}, createdAt: new Date() },
      'dr-jones',
    );
    const rejected = pipeline.reject(req.id, 'dr-jones', 'Not appropriate');
    expect(rejected).toBe(true);
    expect(pipeline.getPending()).toHaveLength(0);
  });
});

describe('AIEngine', () => {
  it('should create with default adapter', () => {
    const engine = new AIEngine();
    expect(engine).toBeDefined();
    expect(engine.name).toBe('ai-engine');
  });

  it('should initialize with a registered model', async () => {
    const engine = new AIEngine();
    await engine.initialize();
    expect(engine.registry.list().length).toBeGreaterThanOrEqual(1);
    await engine.shutdown();
  });
});
