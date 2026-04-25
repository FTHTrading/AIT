import { AITComplianceFooter, AITGlassCard, AITProtocolModuleCard } from '@/components/ait-brand';
import { AITVoiceGuide } from '@/components/voice';
import { aitProtocolDefinition } from '@/data/systems/ait-biofield/protocolSchemas';

const capabilities = [
  'Medical claims registry',
  'Evidence/document anchoring',
  'License package modeling',
  'Treatment center readiness scoring',
  'RWA structuring support',
  'Investor diligence vault',
  'On-chain proof events',
  'Service mesh synchronization',
  'L1 event schema integration',
];

export default function ProtocolPage() {
  return (
    <div className="space-y-6">
      <section className="panel border-[#00AEEF]/40 bg-[#06111F]/65">
        <h1 className="text-2xl font-bold">Protocol / Service Mesh / L1 Layer</h1>
        <p className="mt-2 text-sm text-gray-300">Registry of sovereign application modules running above the L1 protocol layer.</p>
      </section>

      <AITProtocolModuleCard />

      <AITGlassCard title="AIT Module Capabilities" accent="blue">
        <p className="mb-3 text-sm text-slate-300">Health Infrastructure / RWA / Evidence Protocol • {aitProtocolDefinition.status}</p>
        <p className="mb-3 text-sm text-slate-300">{aitProtocolDefinition.publicDescription}</p>
        <div className="grid gap-2 md:grid-cols-2 text-xs text-gray-300">
          {capabilities.map((item) => (
            <span key={item} className="rounded border border-[#00AEEF]/35 px-2 py-1">{item}</span>
          ))}
        </div>
      </AITGlassCard>

      <AITComplianceFooter />
      <AITVoiceGuide route="/protocol" />
    </div>
  );
}
