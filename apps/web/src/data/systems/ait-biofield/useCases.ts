export type DiligenceStatus = 'draft' | 'in-review' | 'gated' | 'validated';

export interface AITUseCaseItem {
  useCaseId: string;
  name: string;
  category: string;
  description: string;
  claimedValue: string;
  evidenceRequired: string;
  regulatoryRisk: 'low' | 'medium' | 'high';
  diligenceStatus: DiligenceStatus;
  proofObjects: string[];
}

export const aitUseCases: AITUseCaseItem[] = [
  {
    useCaseId: 'uc-dialysis-augmentation',
    name: 'Dialysis Center Augmentation',
    category: 'renal',
    description: 'Diligence pathway for integrating AIT-related workflows into existing dialysis center operations.',
    claimedValue: 'Company-provided claim: improve oxygenation and operational support during renal workflows.',
    evidenceRequired: 'Clinical protocol package, safety profile, and comparative outcomes documentation.',
    regulatoryRisk: 'high',
    diligenceStatus: 'in-review',
    proofObjects: ['AIT_DOCUMENT_HASHED', 'AIT_CLAIM_REVIEWED', 'AIT_SITE_READINESS_SCORED'],
  },
  {
    useCaseId: 'uc-chronic-disease-research',
    name: 'Chronic Disease Support Research',
    category: 'research',
    description: 'Structured intake and classification of chronic disease support hypotheses from source materials.',
    claimedValue: 'Company-provided claim: potential systemic support in chronic disease contexts.',
    evidenceRequired: 'Independent study references, trial protocol data, claims governance sign-off.',
    regulatoryRisk: 'high',
    diligenceStatus: 'draft',
    proofObjects: ['AIT_CLAIM_REGISTERED', 'AIT_DOCUMENT_ANCHORED'],
  },
  {
    useCaseId: 'uc-esrd-pathway',
    name: 'Renal / ESRD Diligence Pathway',
    category: 'renal',
    description: 'Governance workflow for ESRD-related materials, claims, and supporting evidence.',
    claimedValue: 'Company-provided claim: support framework around renal and dialysis scenarios.',
    evidenceRequired: 'Renal outcomes data, classification memo, medical advisory review.',
    regulatoryRisk: 'high',
    diligenceStatus: 'in-review',
    proofObjects: ['AIT_CLAIM_REVIEWED', 'AIT_PROTOCOL_REGISTERED'],
  },
  {
    useCaseId: 'uc-trauma-icu',
    name: 'Trauma / ICU Use-Case Research',
    category: 'critical-care',
    description: 'Research-stage registry for trauma and ICU support use-case assertions.',
    claimedValue: 'Company-provided claim: potential utility in ICU and trauma support pathways.',
    evidenceRequired: 'Critical care protocol review, trial evidence, risk committee memo.',
    regulatoryRisk: 'high',
    diligenceStatus: 'draft',
    proofObjects: ['AIT_CLAIM_REGISTERED', 'AIT_DOCUMENT_HASHED'],
  },
  {
    useCaseId: 'uc-burn-center',
    name: 'Burn Center Research Pathway',
    category: 'critical-care',
    description: 'Structured diligence path for burn-center related process design and proof tracking.',
    claimedValue: 'Company-provided claim: potential support role in burn center workflows.',
    evidenceRequired: 'Protocol safety data, center readiness scoring, legal review memo.',
    regulatoryRisk: 'high',
    diligenceStatus: 'draft',
    proofObjects: ['AIT_SITE_READINESS_SCORED', 'AIT_CLAIM_REVIEWED'],
  },
  {
    useCaseId: 'uc-addiction-detox',
    name: 'Addiction Detox Research Pathway',
    category: 'detox',
    description: 'Governed intake for addiction detox claims and supporting evidence requirements.',
    claimedValue: 'Company-provided claim: may support detoxification pathways in controlled settings.',
    evidenceRequired: 'Program protocol package, IRB status, adverse event and safety records.',
    regulatoryRisk: 'high',
    diligenceStatus: 'in-review',
    proofObjects: ['AIT_CLAIM_REGISTERED', 'AIT_COMPLIANCE_GATE_PASSED'],
  },
  {
    useCaseId: 'uc-oncology-claims-registry',
    name: 'Oncology-Related Claims Registry',
    category: 'oncology',
    description: 'Restricted claims register for oncology-adjacent statements with mandatory disclaimers.',
    claimedValue: 'Company-provided claim only; no public statement of efficacy or treatment outcomes.',
    evidenceRequired: 'Primary source citations, legal and regulatory review, publication restrictions.',
    regulatoryRisk: 'high',
    diligenceStatus: 'gated',
    proofObjects: ['AIT_CLAIM_REGISTERED', 'AIT_CLAIM_REVIEWED', 'AIT_DOCUMENT_ANCHORED'],
  },
  {
    useCaseId: 'uc-retrofit-model',
    name: 'Treatment Center Retrofit Model',
    category: 'deployment',
    description: 'Commercial and technical package design for retrofitting existing centers.',
    claimedValue: 'Documented pathway for licensed adoption subject to compliance gates.',
    evidenceRequired: 'Site readiness rubric, equipment scope, insurance and liability review.',
    regulatoryRisk: 'medium',
    diligenceStatus: 'in-review',
    proofObjects: ['AIT_LICENSE_PACKAGE_CREATED', 'AIT_SITE_READINESS_SCORED'],
  },
  {
    useCaseId: 'uc-standalone-center',
    name: 'Standalone Center Model',
    category: 'deployment',
    description: 'Framework for new center buildouts with compliance-gated licensing and diligence.',
    claimedValue: 'Operating model for center deployment tied to documented evidence and policy checks.',
    evidenceRequired: 'Facility readiness, legal wrappers, regional compliance memos.',
    regulatoryRisk: 'high',
    diligenceStatus: 'draft',
    proofObjects: ['AIT_LICENSE_PACKAGE_CREATED', 'AIT_RWA_ASSET_DRAFTED'],
  },
];
