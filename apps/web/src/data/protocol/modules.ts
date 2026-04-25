export type ModuleStatus = 'DESIGNED' | 'PROTOTYPE' | 'TESTNET' | 'LIVE';

export interface ProtocolModule {
  moduleId: string;
  name: string;
  category: string;
  version: string;
  owner: string;
  status: ModuleStatus;
  schemas: string[];
  events: string[];
  permissions: string[];
  paymentPolicy?: string;
  compliancePolicy?: string;
  anchorPolicy?: string;
  ragPolicy?: string;
  createdAt: string;
  updatedAt: string;
}

const now = '2026-04-25T00:00:00Z';

export const protocolModules: ProtocolModule[] = [
  {
    moduleId: 'ait.biofield.v1',
    name: 'AIT Biofield Protocol Module',
    category: 'Health Infrastructure',
    version: '1.0.0',
    owner: 'AIT Holdings Trust',
    status: 'PROTOTYPE',
    schemas: ['Document', 'Claim', 'Evidence', 'LicensePackage', 'RWAAsset'],
    events: ['AIT_DOCUMENT_HASHED', 'AIT_CLAIM_REGISTERED', 'AIT_LICENSE_PACKAGE_CREATED'],
    permissions: ['module.owner', 'review.committee', 'legal.counsel'],
    paymentPolicy: 'x402.enterprise.gated',
    compliancePolicy: 'medical-claims-review-v1',
    anchorPolicy: 'public-proof-private-content-v1',
    ragPolicy: 'source-linked-simulation-required-v1',
    createdAt: now,
    updatedAt: now,
  },
  {
    moduleId: 'x402.agent-commerce.v1',
    name: 'x402 Agent Commerce',
    category: 'Payments',
    version: '1.0.0',
    owner: 'UnyKorn Infrastructure',
    status: 'TESTNET',
    schemas: ['X402Invoice', 'X402Receipt', 'PolicyDecision'],
    events: ['X402_CHALLENGE_CREATED', 'X402_PAYMENT_VERIFIED', 'X402_RECEIPT_ISSUED'],
    permissions: ['operator', 'billing.admin'],
    paymentPolicy: 'x402.native',
    compliancePolicy: 'payments-and-audit-v1',
    anchorPolicy: 'receipt-hash-v1',
    ragPolicy: 'disabled',
    createdAt: now,
    updatedAt: now,
  },
  {
    moduleId: 'rwa.asset-registry.v1',
    name: 'RWA Asset Registry',
    category: 'RWA',
    version: '1.0.0',
    owner: 'UnyKorn Infrastructure',
    status: 'PROTOTYPE',
    schemas: ['RWAAsset', 'LicensePackage', 'ComplianceReview'],
    events: ['RWA_ASSET_REGISTERED', 'COMPLIANCE_GATE_PASSED', 'STATE_ROOT_ANCHORED'],
    permissions: ['operator', 'legal.counsel', 'compliance.officer'],
    paymentPolicy: 'x402.metered',
    compliancePolicy: 'rwa-disclosure-v1',
    anchorPolicy: 'registry-root-v1',
    ragPolicy: 'source-linked-simulation-required-v1',
    createdAt: now,
    updatedAt: now,
  },
];
