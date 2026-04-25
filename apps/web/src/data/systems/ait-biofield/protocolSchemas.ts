export interface AITProtocol {
  protocolId: string;
  name: string;
  version: string;
  sponsorEntity: string;
  publicDescription: string;
  status: 'DESIGNED' | 'DILIGENCE' | 'ACTIVE';
  claimPolicy: string;
  compliancePolicy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AITDocument {
  documentId: string;
  title: string;
  type: string;
  visibility: 'public' | 'restricted' | 'private';
  sha256Hash: string;
  ipfsCid?: string;
  merkleRoot?: string;
  sourceStatus: string;
  reviewStatus: string;
  uploadedAt: string;
}

export interface AITClaim {
  claimId: string;
  claimText: string;
  claimType: 'medical' | 'technical' | 'financial' | 'operational' | 'regulatory';
  claimSource: string;
  evidenceRequired: string;
  validationStatus: string;
  riskLevel: 'low' | 'medium' | 'high';
  publicAllowed: boolean;
  disclaimerRequired: boolean;
}

export interface AITUseCase {
  useCaseId: string;
  name: string;
  category: string;
  description: string;
  claimedBenefit: string;
  evidenceRequired: string;
  regulatoryConcern: string;
  diligenceStatus: string;
  rwaRelevance: string;
  proofObjects: string[];
}

export interface AITLicensePackage {
  licenseId: string;
  licenseType: string;
  territory: string;
  treatmentCenterType: string;
  equipmentScope: string;
  protocolAccess: string;
  revenueShareModel: string;
  complianceGates: string[];
  status: string;
}

export interface AITRwaAsset {
  assetId: string;
  assetType:
    | 'IP_LICENSE'
    | 'REVENUE_RIGHT'
    | 'EQUIPMENT_PACKAGE'
    | 'TREATMENT_CENTER_SPV'
    | 'DOCUMENTED_CLAIM'
    | 'PROTOCOL_USAGE_RIGHT';
  legalWrapper: string;
  jurisdiction: string;
  valuationStatus: string;
  offeringStatus: string;
  investorEligibility: string;
  complianceStatus: string;
  onChainAnchor: string;
  riskDisclosures: string[];
}

export type AITProtocolEventType =
  | 'AIT_PROTOCOL_REGISTERED'
  | 'AIT_DOCUMENT_HASHED'
  | 'AIT_DOCUMENT_ANCHORED'
  | 'AIT_CLAIM_REGISTERED'
  | 'AIT_CLAIM_REVIEWED'
  | 'AIT_USE_CASE_ADDED'
  | 'AIT_LICENSE_PACKAGE_CREATED'
  | 'AIT_SITE_READINESS_SCORED'
  | 'AIT_RWA_ASSET_DRAFTED'
  | 'AIT_COMPLIANCE_GATE_PASSED'
  | 'AIT_INVESTOR_PACKAGE_GENERATED';

export interface AITProtocolEvent {
  eventType: AITProtocolEventType;
  protocolId: string;
  createdAt: string;
  payload: Record<string, string>;
}

export const aitProtocolDefinition: AITProtocol = {
  protocolId: 'ait-biofield-v1',
  name: 'AIT Biofield Protocol Module',
  version: '1.0.0',
  sponsorEntity: 'AIT Holdings Trust',
  publicDescription:
    'Protocol module for registering AIT-related documents, claims, license packages, treatment-center readiness scoring, and RWA-readiness events into the sovereign infrastructure mesh.',
  status: 'DILIGENCE',
  claimPolicy: 'All medical and financial claims are classification-gated and evidence-backed before public release.',
  compliancePolicy: 'Compliance-gated publication flow with legal, regulatory, and privacy checkpoints.',
  createdAt: '2026-04-25T00:00:00Z',
  updatedAt: '2026-04-25T00:00:00Z',
};

export const aitIntegrationMap = {
  l1ProtocolLayer: [
    'canonical schemas',
    'event definitions',
    'cryptographic identity',
    'node synchronization',
    'protocol state roots',
  ],
  serviceMesh: [
    'document intelligence service',
    'compliance service',
    'claim review service',
    'license registry service',
    'RWA structuring service',
    'anchor broadcast service',
    'investor vault service',
  ],
  onChainAnchorLayer: [
    'SHA-256 document hashes',
    'Merkle roots',
    'IPFS CIDs',
    'Polygon anchor tx',
    'XRPL memo/hash anchor optional',
    'UnyKorn L1 state root optional',
    'Bitcoin/OpenTimestamps optional',
  ],
  applicationLayer: [
    'AIT Biofield site',
    'protocol dashboard',
    'diligence room',
    'investor overview',
    'document vault',
    'treatment center readiness scoring',
  ],
};

export const aitSampleEvents: AITProtocolEvent[] = [
  {
    eventType: 'AIT_DOCUMENT_HASHED',
    protocolId: 'ait-biofield-v1',
    createdAt: '2026-04-25T00:00:00Z',
    payload: {
      documentId: 'ait-executive-summary-0326',
      documentType: 'EXECUTIVE_SUMMARY',
      visibility: 'restricted',
      sha256Hash: 'PENDING_HASH',
      anchorStatus: 'READY_FOR_ANCHOR',
    },
  },
  {
    eventType: 'AIT_CLAIM_REGISTERED',
    protocolId: 'ait-biofield-v1',
    createdAt: '2026-04-25T00:00:00Z',
    payload: {
      claimId: 'claim-renal-support-001',
      claimType: 'medical',
      sourceStatus: 'company-provided',
      validationStatus: 'requires-validation',
    },
  },
  {
    eventType: 'AIT_LICENSE_PACKAGE_CREATED',
    protocolId: 'ait-biofield-v1',
    createdAt: '2026-04-25T00:00:00Z',
    payload: {
      licenseId: 'license-retrofit-tier-a',
      territory: 'US',
      status: 'draft',
      complianceGate: 'legal-review-required',
    },
  },
  {
    eventType: 'AIT_RWA_ASSET_DRAFTED',
    protocolId: 'ait-biofield-v1',
    createdAt: '2026-04-25T00:00:00Z',
    payload: {
      assetId: 'rwa-ip-license-001',
      assetType: 'IP_LICENSE',
      offeringStatus: 'legal-review-required',
      complianceStatus: 'pending',
    },
  },
  {
    eventType: 'AIT_PROTOCOL_REGISTERED',
    protocolId: 'ait-biofield-v1',
    createdAt: '2026-04-25T00:00:00Z',
    payload: {
      moduleName: 'AIT Biofield Protocol Module',
      l1Registration: 'queued',
      meshSync: 'enabled',
      schemaVersion: '1.0.0',
    },
  },
];
