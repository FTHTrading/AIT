export interface AITVideoScript {
  title: string;
  videoSlug: string;
  script: string;
  complianceNote: string;
}

export const aitVideoScripts: AITVideoScript[] = [
  {
    title: 'AIT Biofield OS Brand Video',
    videoSlug: 'ait-brand-video',
    script:
      'AIT Biofield OS is the infrastructure layer around therapeutic innovation. It protects source materials, proves evidence integrity, governs claims, and registers protocol-ready rights for responsible commercialization.',
    complianceNote: 'Public infrastructure overview only. No medical certainty or investment solicitation.',
  },
  {
    title: 'AIT IP Vault',
    videoSlug: 'ait-ip-vault',
    script:
      'The IP vault model separates public proof from private payloads. SHA-256 hashes, Merkle roots, and encrypted references support verifiable integrity without exposing restricted source data.',
    complianceNote: 'Private and confidential materials remain non-public and non-narrated.',
  },
  {
    title: 'AIT x UnyKorn',
    videoSlug: 'ait-mutual-value',
    script:
      'AIT brings differentiated technology context. UnyKorn contributes protocol governance, proof infrastructure, review workflows, and monetization rails that are audit-friendly and compliance-gated.',
    complianceNote: 'Partnership framing only. Not a legal representation of rights transfer.',
  },
  {
    title: 'From IP to Infrastructure Asset',
    videoSlug: 'ait-rwa-monetization',
    script:
      'Rights-based packaging focuses on documented, review-gated infrastructure assets. The flow moves from protected IP to claim governance, license structuring, and legal-review-ready RWA pathways.',
    complianceNote: 'LEGAL_REVIEW_REQUIRED. Not an investment offer.',
  },
  {
    title: 'Claim Governance Engine',
    videoSlug: 'ait-claim-governance',
    script:
      'The claim governance engine classifies risk, maps evidence requirements, and routes medical, legal, and regulatory review before public release or anchoring.',
    complianceNote: 'Does not establish clinical validity by itself.',
  },
  {
    title: 'Treatment Center Deployment',
    videoSlug: 'ait-treatment-center',
    script:
      'Deployment readiness covers training, infrastructure checks, compliance checkpoints, and monitoring protocols so rollout narratives stay measurable and review-aware.',
    complianceNote: 'Operational readiness summary only. Not medical advice.',
  },
];
