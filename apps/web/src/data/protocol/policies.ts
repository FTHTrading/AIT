export interface PolicyDecision {
  id: string;
  moduleId: string;
  action: string;
  decision: 'ALLOW' | 'DENY' | 'REVIEW_REQUIRED';
  reason: string;
  reviewer: string;
  createdAt: string;
}

export const policyDecisions: PolicyDecision[] = [
  {
    id: 'policy-001',
    moduleId: 'ait.biofield.v1',
    action: 'publish-medical-claim',
    decision: 'REVIEW_REQUIRED',
    reason: 'Medical claim requires legal, clinical, and regulatory review.',
    reviewer: 'claims-committee',
    createdAt: '2026-04-25T00:00:00Z',
  },
  {
    id: 'policy-002',
    moduleId: 'ait.biofield.v1',
    action: 'anchor-public-summary',
    decision: 'ALLOW',
    reason: 'Public-safe summary with no sensitive content.',
    reviewer: 'policy-engine',
    createdAt: '2026-04-25T00:05:00Z',
  },
  {
    id: 'policy-003',
    moduleId: 'ait.biofield.v1',
    action: 'store-private-kyc-on-public-ipfs',
    decision: 'DENY',
    reason: 'Private KYC content cannot be published to public IPFS.',
    reviewer: 'policy-engine',
    createdAt: '2026-04-25T00:06:00Z',
  },
];
