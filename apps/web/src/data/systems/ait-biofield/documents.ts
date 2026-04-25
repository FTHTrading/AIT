export interface VaultDocument {
  documentId: string;
  title: string;
  type: string;
  visibility: 'public' | 'restricted' | 'private';
  summary: string;
  hashStatus: 'pending' | 'anchored' | 'verified';
}

export const aitVaultDocuments: VaultDocument[] = [
  {
    documentId: 'doc-ait-exec-summary',
    title: 'AIT Executive Summary',
    type: 'Executive Summary',
    visibility: 'public',
    summary: 'High-level concept, stated use-case scope, and platform framing from source materials.',
    hashStatus: 'verified',
  },
  {
    documentId: 'doc-john-flynn-cv',
    title: 'W. John Flynn CV',
    type: 'Professional Profile',
    visibility: 'public',
    summary: 'Regulatory, investigations, accounting, trustee, and seminar/instruction background.',
    hashStatus: 'verified',
  },
  {
    documentId: 'doc-kyc-diligence-private',
    title: 'KYC / Diligence File',
    type: 'Restricted Due Diligence',
    visibility: 'private',
    summary: 'Private diligence material. Not for public display or repository publication.',
    hashStatus: 'anchored',
  },
  {
    documentId: 'doc-protocol-overview',
    title: 'Protocol Overview PDF',
    type: 'Protocol',
    visibility: 'public',
    summary: 'Sovereign mesh module architecture, schema registration, and proof events.',
    hashStatus: 'pending',
  },
  {
    documentId: 'doc-rwa-memo',
    title: 'RWA Structuring Memo',
    type: 'RWA',
    visibility: 'restricted',
    summary: 'Rights-based asset structuring options, legal gates, and compliance constraints.',
    hashStatus: 'pending',
  },
  {
    documentId: 'doc-compliance-memo',
    title: 'Compliance Memo',
    type: 'Compliance',
    visibility: 'restricted',
    summary: 'Regulatory and legal gating criteria for publication, financing, and licensing.',
    hashStatus: 'pending',
  },
  {
    documentId: 'doc-clinical-checklist',
    title: 'Clinical Validation Checklist',
    type: 'Clinical',
    visibility: 'restricted',
    summary: 'Clinical evidence intake controls and validation workflow requirements.',
    hashStatus: 'pending',
  },
  {
    documentId: 'doc-investor-deck',
    title: 'Investor Overview Deck',
    type: 'Investor',
    visibility: 'restricted',
    summary: 'Diligence-ready, compliance-reviewed overview for qualified counterparties.',
    hashStatus: 'pending',
  },
];
