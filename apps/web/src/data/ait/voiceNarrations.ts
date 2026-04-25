export type VoiceTone = 'institutional' | 'calm' | 'premium' | 'technical' | 'investor-friendly' | 'demo-safe';

export interface VoiceNarration {
  route: string;
  title: string;
  shortIntro: string;
  fullNarration: string;
  complianceNote: string;
  publicSafe: boolean;
  estimatedDuration: string;
  voiceTone: VoiceTone;
}

export const voiceNarrations: VoiceNarration[] = [
  {
    route: '/ait',
    title: 'AIT Homepage',
    shortIntro: 'Welcome to AIT Biofield OS.',
    fullNarration:
      'AIT Biofield OS is the digital infrastructure layer around AIT-related technology: document proof, IP protection, claim governance, license packaging, RWA readiness, x402 monetization, and UnyKorn protocol integration.',
    complianceNote: 'Public infrastructure overview only.',
    publicSafe: true,
    estimatedDuration: '35 seconds',
    voiceTone: 'premium',
  },
  {
    route: '/demo/proof-vault',
    title: 'Proof Vault',
    shortIntro: 'This page demonstrates public-safe proof objects.',
    fullNarration:
      'The proof vault experience demonstrates deterministic hashing, Merkle batching, and anchor-ready packaging while private source materials remain outside public payloads.',
    complianceNote: 'No private vault payloads are narrated.',
    publicSafe: true,
    estimatedDuration: '30 seconds',
    voiceTone: 'technical',
  },
  {
    route: '/demo/claim-governance',
    title: 'Claim Governance',
    shortIntro: 'This page summarizes claim governance controls.',
    fullNarration:
      'The claim governance layer classifies risk and routes evidence requirements before any public-facing release of sensitive medical, regulatory, or financial language.',
    complianceNote: 'Not clinical validation and not medical advice.',
    publicSafe: true,
    estimatedDuration: '25 seconds',
    voiceTone: 'institutional',
  },
  {
    route: '/demo/rwa-package',
    title: 'RWA Infrastructure',
    shortIntro: 'This page outlines rights-based infrastructure packaging.',
    fullNarration:
      'RWA infrastructure in this system is rights-based and review-gated. It does not represent a live securities offer and remains legal-review dependent before external activation.',
    complianceNote: 'LEGAL_REVIEW_REQUIRED. Not investment advice.',
    publicSafe: true,
    estimatedDuration: '30 seconds',
    voiceTone: 'investor-friendly',
  },
  {
    route: '/demo/x402-access',
    title: 'x402 Monetization',
    shortIntro: 'This page covers monetization challenge and receipt flows.',
    fullNarration:
      'x402 challenge, verification, and receipt flows support metered access to infrastructure endpoints while production settlement rails remain explicitly controlled by environment and compliance gates.',
    complianceNote: 'No active token sale or guaranteed payment outcome implied.',
    publicSafe: true,
    estimatedDuration: '28 seconds',
    voiceTone: 'technical',
  },
  {
    route: '/protocol',
    title: 'Protocol Mesh',
    shortIntro: 'This page introduces protocol and service mesh roles.',
    fullNarration:
      'The L1 defines the rules. The service mesh moves data. The AIT module registers evidence, claims, licenses, review events, and anchor payload references.',
    complianceNote: 'Infrastructure narrative only.',
    publicSafe: true,
    estimatedDuration: '24 seconds',
    voiceTone: 'institutional',
  },
  {
    route: '/ait/media',
    title: 'Media Kit',
    shortIntro: 'This page contains public-safe brand and launch assets.',
    fullNarration:
      'The media kit consolidates approved logos, infographics, documents, and storyboard-ready videos. Private source files remain outside this public-safe library.',
    complianceNote: 'Public-safe assets only.',
    publicSafe: true,
    estimatedDuration: '22 seconds',
    voiceTone: 'premium',
  },
  {
    route: '/ait/docs',
    title: 'Docs Library',
    shortIntro: 'This page presents shareable and certificate-style documents.',
    fullNarration:
      'The document library highlights public-safe explainers and certificates with status and compliance notes so stakeholders can review infrastructure posture without private payload exposure.',
    complianceNote: 'Not a substitute for legal, regulatory, or medical review.',
    publicSafe: true,
    estimatedDuration: '26 seconds',
    voiceTone: 'demo-safe',
  },
  {
    route: '/ait/brand',
    title: 'Brand System',
    shortIntro: 'This page defines visual identity and usage rules.',
    fullNarration:
      'The AIT brand system uses deep navy, electric blue, and metallic gold to communicate protected, provable, institutional infrastructure for medtech and protocol audiences.',
    complianceNote: 'Brand guidance only.',
    publicSafe: true,
    estimatedDuration: '20 seconds',
    voiceTone: 'premium',
  },
  {
    route: '/admin/ait',
    title: 'Admin Review Overview',
    shortIntro: 'Admin narration summarizes queue metadata only.',
    fullNarration:
      'Admin review narration is restricted to queue-level metadata, status counts, and workflow guidance. Private payload content, KYC material, and restricted source details are intentionally excluded.',
    complianceNote: 'Admin review content may include restricted metadata. Private data is not narrated.',
    publicSafe: false,
    estimatedDuration: '20 seconds',
    voiceTone: 'technical',
  },
];

export function getNarrationByRoute(route: string) {
  return voiceNarrations.find((entry) => entry.route === route);
}
