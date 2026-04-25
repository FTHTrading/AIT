import { AITColorSystem, AITComplianceFooter, AITGlassCard, AITMediaCard, AITPdfLibrary, AITVideoGallery } from '@/components/ait-brand';
import { AITVoiceGuide } from '@/components/voice';
import { aitInfographics, aitLogos } from '@/data/ait/media';

export default function AITMediaPage() {
  return (
    <div className="space-y-6">
      <AITGlassCard title="AIT Media Kit" accent="gold">
        <p className="text-sm text-slate-300">Public-safe logos, infographics, documents, and video storyboards for investor, partner, and launch communication.</p>
      </AITGlassCard>

      <section className="grid gap-4 md:grid-cols-2">
        {aitLogos.map((logo) => (
          <AITMediaCard key={logo.path} title={logo.title} description="Official logo asset for AIT Biofield OS media usage." typeLabel="Logo" href={logo.path} imagePath={logo.path} imageAlt={logo.title} ctaLabel="Download" status="DILIGENCE" />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {aitInfographics.map((image) => (
          <AITMediaCard key={image.path} title={image.title} description="Public-safe infographic supporting system narrative." typeLabel="Infographic" href={image.path} imagePath={image.path} imageAlt={image.title} ctaLabel="Open" status="DILIGENCE" />
        ))}
      </section>

      <AITGlassCard title="PDF Documents" accent="blue">
        <AITPdfLibrary />
      </AITGlassCard>

      <AITGlassCard title="Video Gallery" accent="blue">
        <AITVideoGallery />
      </AITGlassCard>

      <AITColorSystem />

      <AITGlassCard title="Usage Notes" accent="gold">
        <ul className="space-y-1 text-sm text-slate-300">
          <li>Use only public-safe materials in external channels.</li>
          <li>No private KYC, formula, dosing, patient, contract, or confidential investor data.</li>
          <li>RWA and offering-related narratives remain legal-review gated.</li>
        </ul>
      </AITGlassCard>

      <AITComplianceFooter />
      <AITVoiceGuide route="/ait/media" />
    </div>
  );
}