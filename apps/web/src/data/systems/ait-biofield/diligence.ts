export interface DiligenceRow {
  area: string;
  requiredEvidence: string;
  status: 'open' | 'in-progress' | 'review' | 'ready';
  risk: 'low' | 'medium' | 'high';
  onChainProofObject: string;
  owner: string;
}

export const aitDiligenceMatrix: DiligenceRow[] = [
  { area: 'IP ownership', requiredEvidence: 'Chain of title, assignment docs', status: 'in-progress', risk: 'high', onChainProofObject: 'AIT_DOCUMENT_HASHED', owner: 'Legal' },
  { area: 'Patent status', requiredEvidence: 'Patent filings, counsel memo', status: 'open', risk: 'high', onChainProofObject: 'AIT_DOCUMENT_ANCHORED', owner: 'IP Counsel' },
  { area: 'Clinical data', requiredEvidence: 'Study data package, endpoints', status: 'open', risk: 'high', onChainProofObject: 'AIT_CLAIM_REVIEWED', owner: 'Clinical Team' },
  { area: 'FDA/regulatory classification', requiredEvidence: 'Regulatory pathway memo', status: 'in-progress', risk: 'high', onChainProofObject: 'AIT_COMPLIANCE_GATE_PASSED', owner: 'Regulatory' },
  { area: 'IRB / clinical trial status', requiredEvidence: 'IRB letters, trial registry IDs', status: 'open', risk: 'high', onChainProofObject: 'AIT_DOCUMENT_HASHED', owner: 'Clinical Team' },
  { area: 'Treatment protocols', requiredEvidence: 'Versioned protocol docs', status: 'in-progress', risk: 'medium', onChainProofObject: 'AIT_PROTOCOL_REGISTERED', owner: 'Operations' },
  { area: 'Safety data', requiredEvidence: 'Adverse event logs, risk reports', status: 'open', risk: 'high', onChainProofObject: 'AIT_CLAIM_REVIEWED', owner: 'Safety Board' },
  { area: 'Insurance / liability', requiredEvidence: 'Coverage confirmations', status: 'review', risk: 'medium', onChainProofObject: 'AIT_DOCUMENT_ANCHORED', owner: 'Risk Office' },
  { area: 'Medical advisory board', requiredEvidence: 'Advisor roster and credentials', status: 'open', risk: 'medium', onChainProofObject: 'AIT_DOCUMENT_HASHED', owner: 'Governance' },
  { area: 'License model', requiredEvidence: 'Draft license terms', status: 'in-progress', risk: 'medium', onChainProofObject: 'AIT_LICENSE_PACKAGE_CREATED', owner: 'Licensing' },
  { area: 'Revenue model', requiredEvidence: 'Unit economics and fee model', status: 'review', risk: 'medium', onChainProofObject: 'AIT_RWA_ASSET_DRAFTED', owner: 'Finance' },
  { area: 'SPV/legal structure', requiredEvidence: 'SPV term sheets and wrappers', status: 'open', risk: 'high', onChainProofObject: 'AIT_INVESTOR_PACKAGE_GENERATED', owner: 'Legal' },
  { area: 'Securities review', requiredEvidence: 'Counsel opinion and offering constraints', status: 'open', risk: 'high', onChainProofObject: 'AIT_COMPLIANCE_GATE_PASSED', owner: 'Securities Counsel' },
  { area: 'HIPAA/privacy review', requiredEvidence: 'Data flow and privacy controls memo', status: 'in-progress', risk: 'high', onChainProofObject: 'AIT_DOCUMENT_ANCHORED', owner: 'Privacy Office' },
  { area: 'Claims review', requiredEvidence: 'Claim source and validation matrix', status: 'in-progress', risk: 'high', onChainProofObject: 'AIT_CLAIM_REVIEWED', owner: 'Claims Committee' },
  { area: 'On-chain proof readiness', requiredEvidence: 'Anchor runbook and proof checks', status: 'review', risk: 'medium', onChainProofObject: 'AIT_PROTOCOL_REGISTERED', owner: 'Protocol Engineering' },
];
