import {
  AITClaimClassification,
  AITDisclaimerBlock,
  AITProtocolMeshCard,
  AITRwaFlow,
  AITSystemMap,
} from '@/components/ait-biofield';
import { AITComplianceFooter, AITFlowTree, AITGlassCard, AITLogoHero } from '@/components/ait-brand';
import { AITVoiceGuide } from '@/components/voice';
import { aitOverviewBullets } from '@/data/systems/ait-biofield/ait-biofield';

const navLinks = [
  'overview',
  'technology',
  'use-cases',
  'rwa',
  'protocol',
  'service-mesh',
  'l1',
  'docs',
  'licensing',
  'disclaimer',
  'team',
  'diligence',
  'architecture',
];

export default function AITBiofieldLandingPage() {
  return (
    <div className="space-y-6">
      <AITLogoHero
        title="AIT Biofield OS"
        subtitle="Healing. Protected. Proven. Protocolized."
        supportingLine="Premium infrastructure surface for proof, claims, licensing, RWA, and protocol integration."
      />

      <section className="panel">
        <h2 className="panel-title">Module Navigation</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          {navLinks.map((link) => (
            <a key={link} href={`/systems/ait-biofield/${link}`} className="rounded border border-gray-700 px-2 py-1 text-gray-300 hover:border-cyan-500 hover:text-cyan-300">
              {link}
            </a>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Main Overview</h2>
        <p className="text-sm text-gray-300">
          AIT Biofield OS is not the therapy itself. It is the digital infrastructure layer around the therapy: evidence, documents, claims, licensing, capital formation, protocol registration, and on-chain proof.
        </p>
        <ul className="mt-3 space-y-1 text-sm text-gray-400">
          {aitOverviewBullets.map((bullet) => <li key={bullet}>• {bullet}</li>)}
        </ul>
      </section>

      <AITFlowTree />

      <AITGlassCard title="System Line" accent="gold">
        <p className="text-sm text-slate-300">
          The L1 defines the rules. The Service Mesh moves the data. The AIT module registers evidence, claims, licenses,
          review events, and proof anchors.
        </p>
      </AITGlassCard>

      <AITSystemMap />
      <AITClaimClassification />
      <AITProtocolMeshCard />
      <AITRwaFlow />
      <AITDisclaimerBlock />
      <AITComplianceFooter />
      <AITVoiceGuide route="/systems/ait-biofield" />
    </div>
  );
}
