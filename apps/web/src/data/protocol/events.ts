export interface ProtocolEvent {
  eventType: string;
  moduleId: string;
  createdAt: string;
  status: 'PROPOSED' | 'SIMULATED' | 'APPROVED' | 'EXECUTED' | 'REJECTED';
  payload: Record<string, string>;
}

export const protocolEventCatalog = [
  'MODULE_REGISTERED',
  'MODULE_UPDATED',
  'SCHEMA_REGISTERED',
  'DOCUMENT_HASHED',
  'DOCUMENT_ANCHORED',
  'CLAIM_CLASSIFIED',
  'RWA_ASSET_REGISTERED',
  'LICENSE_PACKAGE_CREATED',
  'AGENT_TASK_PROPOSED',
  'AGENT_TASK_SIMULATED',
  'AGENT_TASK_APPROVED',
  'AGENT_TASK_REJECTED',
  'AGENT_TASK_EXECUTED',
  'X402_CHALLENGE_CREATED',
  'X402_PAYMENT_VERIFIED',
  'X402_RECEIPT_ISSUED',
  'COMPLIANCE_GATE_PASSED',
  'COMPLIANCE_GATE_FAILED',
  'POLICY_DECISION_RECORDED',
  'STATE_ROOT_ANCHORED',
] as const;

export const protocolEventStream: ProtocolEvent[] = [
  {
    eventType: 'MODULE_REGISTERED',
    moduleId: 'ait.biofield.v1',
    createdAt: '2026-04-25T00:00:00Z',
    status: 'EXECUTED',
    payload: { moduleId: 'ait.biofield.v1', owner: 'AIT Holdings Trust' },
  },
  {
    eventType: 'AGENT_TASK_SIMULATED',
    moduleId: 'ait.biofield.v1',
    createdAt: '2026-04-25T00:10:00Z',
    status: 'APPROVED',
    payload: { actionId: 'agent-action-001', simulationId: 'sim-001', decision: 'approved' },
  },
  {
    eventType: 'DOCUMENT_ANCHORED',
    moduleId: 'ait.biofield.v1',
    createdAt: '2026-04-25T00:20:00Z',
    status: 'EXECUTED',
    payload: { documentId: 'doc-ait-exec-summary', chain: 'polygon', anchorId: 'anchor-001' },
  },
];
