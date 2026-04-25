import { AITColorSystem, AITComplianceFooter, AITGlassCard, AITMediaCard } from '@/components/ait-brand';
import { AITVoiceGuide } from '@/components/voice';

export default function AITBrandPage() {
  return (
    <div className="space-y-6">
      <AITGlassCard title="AIT Brand System" accent="gold">
        <p className="text-sm text-slate-300">Dark sovereign medical infrastructure identity with liquid-glass aesthetics, electric-blue energy motifs, and metallic-gold proof cues.</p>
      </AITGlassCard>

      <section className="grid gap-4 md:grid-cols-2">
        <AITMediaCard
          title="Primary Logo"
          description="Use on dark navy or near-black backgrounds with generous clear space."
          typeLabel="Brand Logo"
          href="/assets/ait/logos/ait-biofield-liquid-glass-logo.png"
          imagePath="/assets/ait/logos/ait-biofield-liquid-glass-logo.png"
          status="LIVE"
          ctaLabel="Download"
        />
        <AITMediaCard
          title="Energy Shield Mark"
          description="Secondary emblem for certificates, protocol cards, and media kit overlays."
          typeLabel="Brand Mark"
          href="/assets/ait/logos/ait-biofield-energy-shield.png"
          imagePath="/assets/ait/logos/ait-biofield-energy-shield.png"
          status="DILIGENCE"
          ctaLabel="Download"
        />
      </section>

      <AITColorSystem />

      <AITGlassCard title="Typography and Iconography" accent="blue">
        <ul className="space-y-1 text-sm text-slate-300">
          <li>Typography: clean institutional sans-serif with clear hierarchy and high contrast.</li>
          <li>Icon style: shield, lock, document, protocol-node, and energy-field motifs.</li>
          <li>Image style: premium medtech rendering with low clutter and controlled glow.</li>
          <li>Tagline: Protect the IP. Prove the evidence. Govern the claims. Package the rights. Monetize the infrastructure.</li>
        </ul>
      </AITGlassCard>

      <AITComplianceFooter />
      <AITVoiceGuide route="/ait/brand" />
    </div>
  );
}