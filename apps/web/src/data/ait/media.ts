export type AITMediaStatus = 'READY_FOR_RENDER' | 'LIVE' | 'STORYBOARD_READY';

export interface AITVideoRecord {
  title: string;
  slug: string;
  description: string;
  status: AITMediaStatus;
  suggestedDuration: string;
  videoPath: string;
  posterPath: string;
  voiceoverScriptStatus: 'READY' | 'IN_REVIEW';
}

export const aitVideos: AITVideoRecord[] = [
  {
    title: 'AIT Biofield OS Brand Video',
    slug: 'ait-brand-video',
    description: 'Main cinematic overview of AIT Biofield OS, proof infrastructure, IP protection, and UnyKorn protocol integration.',
    status: 'LIVE',
    suggestedDuration: '30-45 seconds',
    videoPath: '/assets/ait/videos/ait-brand-video.mp4',
    posterPath: '/assets/ait/video-posters/ait-brand-video-poster.png',
    voiceoverScriptStatus: 'READY',
  },
  {
    title: 'AIT IP Vault',
    slug: 'ait-ip-vault',
    description: 'Secure IP protection video showing trade secrets, encrypted vaults, IPFS, SHA-256, and on-chain proof.',
    status: 'READY_FOR_RENDER',
    suggestedDuration: '20-30 seconds',
    videoPath: '/assets/ait/videos/ait-ip-vault.mp4',
    posterPath: '/assets/ait/video-posters/ait-ip-vault-poster.png',
    voiceoverScriptStatus: 'READY',
  },
  {
    title: 'AIT x UnyKorn Mutual Value',
    slug: 'ait-mutual-value',
    description: 'Partnership video explaining how AIT brings technology and UnyKorn brings proof, protocol, RWA, and monetization.',
    status: 'READY_FOR_RENDER',
    suggestedDuration: '30 seconds',
    videoPath: '/assets/ait/videos/ait-mutual-value.mp4',
    posterPath: '/assets/ait/video-posters/ait-mutual-value-poster.png',
    voiceoverScriptStatus: 'READY',
  },
  {
    title: 'From IP to Infrastructure Asset',
    slug: 'ait-rwa-monetization',
    description: 'RWA monetization video showing IP rights, license rights, treatment center packages, SPV pathways, and data-room access.',
    status: 'READY_FOR_RENDER',
    suggestedDuration: '30-45 seconds',
    videoPath: '/assets/ait/videos/ait-rwa-monetization.mp4',
    posterPath: '/assets/ait/video-posters/ait-rwa-monetization-poster.png',
    voiceoverScriptStatus: 'READY',
  },
  {
    title: 'Claim Governance Engine',
    slug: 'ait-claim-governance',
    description: 'Compliance video explaining claim extraction, source attachment, risk classification, evidence requirements, and review gates.',
    status: 'READY_FOR_RENDER',
    suggestedDuration: '20-30 seconds',
    videoPath: '/assets/ait/videos/ait-claim-governance.mp4',
    posterPath: '/assets/ait/video-posters/ait-claim-governance-poster.png',
    voiceoverScriptStatus: 'READY',
  },
  {
    title: 'Treatment Center Deployment',
    slug: 'ait-treatment-center',
    description: 'Deployment video showing readiness scoring, training, equipment, compliance validation, and monitoring.',
    status: 'READY_FOR_RENDER',
    suggestedDuration: '30 seconds',
    videoPath: '/assets/ait/videos/ait-treatment-center.mp4',
    posterPath: '/assets/ait/video-posters/ait-treatment-center-poster.png',
    voiceoverScriptStatus: 'READY',
  },
];

export const aitLogos = [
  {
    title: 'AIT Liquid Glass Logo',
    path: '/assets/ait/logos/ait-biofield-liquid-glass-logo.jpg',
  },
  {
    title: 'AIT Energy Shield',
    path: '/assets/ait/logos/ait-biofield-energy-shield.jpg',
  },
];

export const aitInfographics = [
  {
    title: 'AIT System Architecture',
    path: '/assets/ait/images/ait-system-architecture.png',
  },
  {
    title: 'AIT IP Governance',
    path: '/assets/ait/images/ait-ip-governance.png',
  },
  {
    title: 'AIT Mutual Value Map',
    path: '/assets/ait/images/ait-mutual-value-map.png',
  },
  {
    title: 'AIT Main Hero',
    path: '/assets/ait/images/ait-main-hero.png',
  },
];

export const aitBrandColors = [
  { label: 'Deep Navy', hex: '#06111F' },
  { label: 'Near Black', hex: '#02070D' },
  { label: 'Electric Blue', hex: '#00AEEF' },
  { label: 'Cyan Glow', hex: '#4DEBFF' },
  { label: 'Metallic Gold', hex: '#D4AF37' },
  { label: 'Soft Gold', hex: '#F5D36B' },
  { label: 'White', hex: '#F8FAFC' },
  { label: 'Slate Gray', hex: '#94A3B8' },
  { label: 'Warning Orange', hex: '#F97316' },
  { label: 'Success Green', hex: '#22C55E' },
  { label: 'Restricted Red', hex: '#EF4444' },
];
