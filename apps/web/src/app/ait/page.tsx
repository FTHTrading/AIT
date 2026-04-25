import { AITComplianceFooter, AITFlowTree, AITGlassCard, AITLogoHero, AITProtocolModuleCard } from '@/components/ait-brand';
import { AITVoiceGuide } from '@/components/voice';

export default function AITLandingPage() {
  return (
    <div className="space-y-6">
      <AITLogoHero
        title="AIT Biofield OS"
        subtitle="Healing. Protected. Proven. Protocolized."
        supportingLine="Evidence, licensing, protocol, and RWA infrastructure for therapeutic innovation."
      />

      <AITGlassCard title="Brand Thesis" accent="blue">
        <p className="text-sm text-slate-300">
          AIT Biofield OS is the digital infrastructure layer around AIT-related technology: document proof, IP protection, claim governance,
          license packaging, RWA readiness, x402 monetization, and UnyKorn protocol integration.
        </p>
      </AITGlassCard>

      <AITFlowTree />
      <AITProtocolModuleCard />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AITGlassCard title="Proof Engine" accent="blue">
          <p className="text-sm text-slate-300">Deterministic SHA-256 hashing, Merkle proofs, and anchor-ready payload controls.</p>
        </AITGlassCard>
        <AITGlassCard title="IP Protection" accent="gold">
          <p className="text-sm text-slate-300">Public-safe proof, private-vault references, and restricted-content boundaries by default.</p>
        </AITGlassCard>
        <AITGlassCard title="Claim Governance" accent="blue">
          <p className="text-sm text-slate-300">Risk classification and review-gated claim lifecycle across technical, medical, and regulatory contexts.</p>
        </AITGlassCard>
        <AITGlassCard title="RWA Infrastructure" accent="gold">
          <p className="text-sm text-slate-300">Rights-based packaging and x402 monetization pathways with legal-review controls.</p>
        </AITGlassCard>
      </section>

      <section className="flex flex-wrap gap-3">
        <a href="/ait/docs" className="rounded-lg border border-[#D4AF37]/65 bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-[#F5D36B]">View Documents</a>
        <a href="/protocol" className="rounded-lg border border-[#00AEEF]/65 bg-[#00AEEF]/10 px-4 py-2 text-sm font-semibold text-[#4DEBFF]">Explore Protocol</a>
        <a href="/ait/rwa" className="rounded-lg border border-violet-500/60 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200">Review RWA Pathway</a>
        <a href="/ait/media" className="rounded-lg border border-slate-500/60 bg-slate-500/10 px-4 py-2 text-sm font-semibold text-slate-200">Open Media Kit</a>
      </section>

      <AITComplianceFooter />
      <AITVoiceGuide route="/ait" />
    </div>
  );
}
