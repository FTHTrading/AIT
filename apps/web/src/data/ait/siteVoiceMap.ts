export type VoiceCategory = 'overview' | 'proof' | 'claims' | 'rwa' | 'protocol' | 'x402' | 'docs' | 'media' | 'admin' | 'demo';

export interface SiteVoiceMapEntry {
  route: string;
  label: string;
  category: VoiceCategory;
  voiceSummary: string;
  publicSafe: boolean;
  requiresAdmin: boolean;
  complianceType: 'general' | 'medical' | 'rwa' | 'admin';
}

export const siteVoiceMap: SiteVoiceMapEntry[] = [
  { route: '/ait', label: 'AIT Home', category: 'overview', voiceSummary: 'Top-level system summary and launch framing.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/ait/overview', label: 'AIT Overview', category: 'overview', voiceSummary: 'Infrastructure thesis and platform scope.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/ait/technology', label: 'AIT Technology', category: 'overview', voiceSummary: 'Technology context with cautious claim framing.', publicSafe: true, requiresAdmin: false, complianceType: 'medical' },
  { route: '/ait/docs', label: 'AIT Docs', category: 'docs', voiceSummary: 'Public-safe document library and certificates.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/ait/media', label: 'AIT Media', category: 'media', voiceSummary: 'Media kit with logos, infographics, docs, and video cards.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/ait/videos', label: 'AIT Videos', category: 'media', voiceSummary: 'Storyboards and voiceover-ready video concepts.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/ait/brand', label: 'AIT Brand', category: 'media', voiceSummary: 'Brand palette, logo usage, and design rules.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/ait/protocol', label: 'AIT Protocol', category: 'protocol', voiceSummary: 'AIT module role in protocol layer.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/ait/rwa', label: 'AIT RWA', category: 'rwa', voiceSummary: 'Rights-based packaging path with legal review gates.', publicSafe: true, requiresAdmin: false, complianceType: 'rwa' },
  { route: '/ait/licensing', label: 'AIT Licensing', category: 'rwa', voiceSummary: 'License model and rights registry context.', publicSafe: true, requiresAdmin: false, complianceType: 'rwa' },
  { route: '/ait/diligence', label: 'AIT Diligence', category: 'docs', voiceSummary: 'Diligence posture and review workflow context.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/ait/claims', label: 'AIT Claims', category: 'claims', voiceSummary: 'Claim governance and review-gated release flow.', publicSafe: true, requiresAdmin: false, complianceType: 'medical' },
  { route: '/ait/ip', label: 'AIT IP', category: 'proof', voiceSummary: 'IP protection and vault boundary posture.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/ait/investors', label: 'AIT Investors', category: 'rwa', voiceSummary: 'Investor-facing infrastructure and disclosure framing.', publicSafe: true, requiresAdmin: false, complianceType: 'rwa' },
  { route: '/systems/ait-biofield', label: 'System AIT Biofield', category: 'overview', voiceSummary: 'System module landing and navigation map.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/protocol', label: 'Protocol', category: 'protocol', voiceSummary: 'Protocol and service mesh integration overview.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/protocol/l1', label: 'Protocol L1', category: 'protocol', voiceSummary: 'L1 role and event governance model.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/protocol/service-mesh', label: 'Service Mesh', category: 'protocol', voiceSummary: 'Service mesh data movement and module interoperability.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/protocol/modules', label: 'Protocol Modules', category: 'protocol', voiceSummary: 'Module registry and AIT module positioning.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/protocol/schemas', label: 'Protocol Schemas', category: 'protocol', voiceSummary: 'Schema-level integration points.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/protocol/events', label: 'Protocol Events', category: 'protocol', voiceSummary: 'Event model and audit flow.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/protocol/anchors', label: 'Protocol Anchors', category: 'proof', voiceSummary: 'Anchor payload model and broadcast controls.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/protocol/x402', label: 'Protocol x402', category: 'x402', voiceSummary: 'Metered access and receipt model.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/protocol/rwa', label: 'Protocol RWA', category: 'rwa', voiceSummary: 'RWA structuring model with legal review requirements.', publicSafe: true, requiresAdmin: false, complianceType: 'rwa' },
  { route: '/demo/proof-vault', label: 'Demo Proof Vault', category: 'demo', voiceSummary: 'Public-safe proof manifest and Merkle demo.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/demo/claim-governance', label: 'Demo Claim Governance', category: 'demo', voiceSummary: 'Claim risk and evidence demo view.', publicSafe: true, requiresAdmin: false, complianceType: 'medical' },
  { route: '/demo/rwa-package', label: 'Demo RWA Package', category: 'demo', voiceSummary: 'Rights package demo with legal gate.', publicSafe: true, requiresAdmin: false, complianceType: 'rwa' },
  { route: '/demo/x402-access', label: 'Demo x402 Access', category: 'demo', voiceSummary: 'Challenge and receipt demo flow.', publicSafe: true, requiresAdmin: false, complianceType: 'general' },
  { route: '/demo/admin-review', label: 'Demo Admin Review', category: 'demo', voiceSummary: 'Admin review status model demo.', publicSafe: true, requiresAdmin: false, complianceType: 'admin' },
  { route: '/admin/ait', label: 'Admin AIT', category: 'admin', voiceSummary: 'Restricted admin metadata summary.', publicSafe: false, requiresAdmin: true, complianceType: 'admin' },
];
