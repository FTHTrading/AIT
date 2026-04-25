export type ClaimBadge =
  | 'Company-provided claim'
  | 'Needs clinical validation'
  | 'Needs regulatory review'
  | 'Needs legal review'
  | 'Public-safe'
  | 'Restricted';

export const aitBiofieldSystemCard = {
  id: 'ait-biofield',
  slug: '/systems/ait-biofield',
  name: 'AIT Biofield Infrastructure Layer',
  category: 'Health Infrastructure / RWA / Protocol Service Mesh',
  status: 'DILIGENCE',
  shortDescription:
    'Digital evidence, licensing, RWA, and protocol infrastructure layer for Autologous Infusion Technologies and Therapies.',
  longDescription:
    "AIT Biofield Infrastructure Layer transforms AIT's company-provided therapeutic technology materials into a structured digital system: document intelligence, diligence tracking, protocol registration, licensing workflows, treatment-center readiness scoring, RWA structuring, and on-chain proof anchoring. The platform does not provide medical treatment. It creates the verifiable infrastructure required to evaluate, finance, license, and govern the technology.",
  tags: [
    'AIT',
    'Biofield OS',
    'Medical Infrastructure',
    'Evidence Registry',
    'RWA',
    'IP Licensing',
    'Treatment Centers',
    'Protocol Mesh',
    'L1 Protocol',
    'On-Chain Proof',
    'Compliance',
    'Diligence',
  ],
};

export const aitBrandOptions = [
  'AIT Biofield OS',
  'Autologous Infusion Technology Protocol Layer',
  'Biofield Evidence & RWA Infrastructure',
  'AIT Sovereign Medical Infrastructure Protocol',
];

export const aitOverviewBullets = [
  'AIT describes a proprietary intracorporeal infusion concept using fluid and mixed-gas administration.',
  'AIT Biofield OS is the software, evidence, licensing, and governance layer around those company-provided materials.',
  'All medical statements are treated as diligence items requiring independent clinical and regulatory validation.',
  'The system is designed to keep private health and KYC data off-chain and out of public surfaces.',
  'UnyKorn sovereign infrastructure provides canonical schemas, service mesh routing, and proof event anchoring.',
];

export const aitComplianceDisclaimers = [
  'Not medical advice. This module summarizes company-provided materials for diligence and protocol structuring.',
  'Not investment advice. Nothing presented here is an offer to sell securities or a solicitation to buy securities.',
  'All financing, licensing, and asset structuring paths are subject to legal, regulatory, clinical, and compliance review.',
  'No patient health records, private medical records, or sensitive KYC identifiers are written to chain state.',
  'Therapeutic claims are research-stage and require independent validation unless explicitly verified by primary evidence.',
];
