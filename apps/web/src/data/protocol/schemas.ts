export interface ProtocolSchema {
  id: string;
  name: string;
  version: string;
  summary: string;
  requiredFields: string[];
}

export const protocolSchemas: ProtocolSchema[] = [
  {
    id: 'schema-document-v1',
    name: 'Document',
    version: '1.0.0',
    summary: 'Canonical document object with visibility, hash, and review status.',
    requiredFields: ['documentId', 'title', 'visibility', 'sha256Hash', 'reviewStatus', 'uploadedAt'],
  },
  {
    id: 'schema-claim-v1',
    name: 'Claim',
    version: '1.0.0',
    summary: 'Claim object with type, risk, source, and publication gate.',
    requiredFields: ['claimId', 'claimType', 'claimText', 'riskLevel', 'validationStatus', 'publicAllowed'],
  },
  {
    id: 'schema-rwa-asset-v1',
    name: 'RWAAsset',
    version: '1.0.0',
    summary: 'Rights-based asset with legal wrapper, disclosure, and anchor metadata.',
    requiredFields: ['assetId', 'assetType', 'legalWrapper', 'complianceStatus', 'offeringStatus', 'onChainAnchor'],
  },
  {
    id: 'schema-agent-action-v1',
    name: 'AgentAction',
    version: '1.0.0',
    summary: 'Agent proposal object requiring simulation and policy decisions.',
    requiredFields: ['actionId', 'agentId', 'moduleId', 'proposedEvent', 'simulationId', 'policyDecisionId'],
  },
  {
    id: 'schema-anchor-record-v1',
    name: 'AnchorRecord',
    version: '1.0.0',
    summary: 'Proof anchor object for hash, Merkle root, chain refs, and verification.',
    requiredFields: ['recordId', 'sha256Hash', 'merkleRoot', 'timestamp', 'chainRefs'],
  },
];
