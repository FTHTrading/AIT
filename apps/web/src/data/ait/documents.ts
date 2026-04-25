export type AITDocumentCategory = 'overview' | 'certificate' | 'protocol' | 'proof' | 'rwa';

export type AITDocumentStatus = 'LIVE' | 'DILIGENCE' | 'REVIEW_REQUIRED' | 'LEGAL_REVIEW_REQUIRED';

export interface AITDocumentRecord {
  title: string;
  filename: string;
  href: string;
  category: AITDocumentCategory;
  status: AITDocumentStatus;
  description: string;
  publicSafe: boolean;
  complianceNote: string;
  voiceSummary: string;
}

export const aitDocuments: AITDocumentRecord[] = [
  {
    title: 'Full Shareable PDF Pack',
    filename: 'AIT_Biofield_OS_Shareable_PDF_Pack.pdf',
    href: '/assets/ait/docs/AIT_Biofield_OS_Shareable_PDF_Pack.pdf',
    category: 'overview',
    status: 'DILIGENCE',
    description: 'Consolidated public-safe package for partner, investor, and protocol-level briefing.',
    publicSafe: true,
    complianceNote: 'Public-safe summary pack only. Not medical advice, investment advice, or legal clearance.',
    voiceSummary: 'This package contains a guided overview of AIT Biofield OS infrastructure and review-gated commercialization pathways.',
  },
  {
    title: 'One-Page Explainer',
    filename: 'AIT_Biofield_OS_One_Page_Explainer.pdf',
    href: '/assets/ait/docs/AIT_Biofield_OS_One_Page_Explainer.pdf',
    category: 'overview',
    status: 'LIVE',
    description: 'Executive one-pager describing proof, claims, RWA, and protocol integration.',
    publicSafe: true,
    complianceNote: 'Company-provided infrastructure summary. Independent legal and medical review required for sensitive claims.',
    voiceSummary: 'The one-page explainer highlights the end-to-end infrastructure from IP vault to protocol monetization.',
  },
  {
    title: 'Protocol Module Certificate',
    filename: 'AIT_Biofield_OS_Protocol_Module_Certificate.pdf',
    href: '/assets/ait/docs/AIT_Biofield_OS_Protocol_Module_Certificate.pdf',
    category: 'protocol',
    status: 'DILIGENCE',
    description: 'Certificate-style protocol module positioning for UnyKorn service mesh and L1 integration.',
    publicSafe: true,
    complianceNote: 'Descriptive certificate format only. Not a regulatory or legal certification.',
    voiceSummary: 'This certificate describes the AIT protocol module role across L1, service mesh, proof anchors, and governance events.',
  },
  {
    title: 'IP + Proof Readiness Certificate',
    filename: 'AIT_Biofield_OS_IP_Proof_Readiness_Certificate.pdf',
    href: '/assets/ait/docs/AIT_Biofield_OS_IP_Proof_Readiness_Certificate.pdf',
    category: 'proof',
    status: 'REVIEW_REQUIRED',
    description: 'Readiness framing for document hashing, Merkle proofs, and private-vault boundaries.',
    publicSafe: true,
    complianceNote: 'Readiness posture is review-gated and does not guarantee legal sufficiency.',
    voiceSummary: 'This certificate summarizes proof-readiness controls including SHA-256 hashing, Merkle roots, and privacy boundaries.',
  },
  {
    title: 'RWA + Monetization Certificate',
    filename: 'AIT_Biofield_OS_RWA_Monetization_Certificate.pdf',
    href: '/assets/ait/docs/AIT_Biofield_OS_RWA_Monetization_Certificate.pdf',
    category: 'rwa',
    status: 'LEGAL_REVIEW_REQUIRED',
    description: 'Rights-based commercialization framing for RWA, licensing, and x402 access models.',
    publicSafe: true,
    complianceNote: 'LEGAL_REVIEW_REQUIRED. Not an investment offer and not active token sale logic.',
    voiceSummary: 'This certificate explains rights packaging and monetization pathways that remain legal-review gated.',
  },
  {
    title: 'Build Status Certificate',
    filename: 'AIT_Biofield_OS_Build_Status_Certificate.pdf',
    href: '/assets/ait/docs/AIT_Biofield_OS_Build_Status_Certificate.pdf',
    category: 'certificate',
    status: 'DILIGENCE',
    description: 'Build and validation posture summary for demo-safe production hardening phases.',
    publicSafe: true,
    complianceNote: 'Build status reflects engineering validation only and is not legal, medical, or regulatory certification.',
    voiceSummary: 'This certificate summarizes current build and test posture across the AIT platform.',
  },
];
