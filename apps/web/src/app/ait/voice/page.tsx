import { AITComplianceFooter, AITGlassCard, AITMediaCard, AITStatusBadge } from '@/components/ait-brand';
import { AITVoiceGuide } from '@/components/voice';
import { siteVoiceMap } from '@/data/ait/siteVoiceMap';

const sections = [
  'AI Voice Intelligence Layer',
  'Listen to the AIT System Overview',
  'Guided Route Library',
  'Document Narration',
  'Claim Governance Explainer',
  'RWA + Protocol Explainer',
  'Video Voiceover Scripts',
  'Admin Review Assistant',
  'Safety + Privacy Rules',
  'Future Voice Roadmap',
];

export default function AITVoicePage() {
  return (
    <div className="space-y-6">
      <AITGlassCard title="AI Voice Intelligence Layer" accent="gold">
        <p className="text-sm text-slate-300">
          AIT Voice Intelligence Layer turns the system into a guided, listenable infrastructure experience. It can explain the platform,
          narrate public-safe documents, guide investors through proof and RWA concepts, and help operators understand claim governance
          without exposing private data.
        </p>
      </AITGlassCard>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AITMediaCard title="System Narrator" description="Guides users through high-level architecture and route map." typeLabel="Voice Capability" status="LIVE" fallbackLabel="Narration" />
        <AITMediaCard title="Document Reader" description="Reads safe summaries for public documents and certificates." typeLabel="Voice Capability" status="LIVE" fallbackLabel="Narration" />
        <AITMediaCard title="Claim Governance Explainer" description="Explains review gates and evidence requirements." typeLabel="Voice Capability" status="LIVE" fallbackLabel="Narration" />
        <AITMediaCard title="RWA Explainer" description="Summarizes rights-based packaging with legal-review reminders." typeLabel="Voice Capability" status="DILIGENCE" fallbackLabel="Narration" />
        <AITMediaCard title="Protocol Guide" description="Narrates L1, service mesh, and module positioning." typeLabel="Voice Capability" status="LIVE" fallbackLabel="Narration" />
        <AITMediaCard title="Admin Review Assistant" description="Metadata-only admin queue narration when explicitly enabled." typeLabel="Voice Capability" status="REVIEW_REQUIRED" fallbackLabel="Narration" />
      </section>

      <AITGlassCard title="Voice Page Sections" accent="blue">
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-slate-300">
          {sections.map((item) => (
            <li key={item} className="rounded-md border border-slate-700 px-3 py-2">{item}</li>
          ))}
        </ul>
      </AITGlassCard>

      <AITGlassCard title="Route Narration Library" accent="blue">
        <div className="grid gap-2 md:grid-cols-2 text-sm">
          {siteVoiceMap.filter((entry) => entry.publicSafe).map((entry) => (
            <div key={entry.route} className="rounded-md border border-slate-700 bg-[#02070D]/60 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#4DEBFF]">{entry.label}</span>
                <AITStatusBadge status="LIVE" />
              </div>
              <p className="text-xs text-slate-300">{entry.route}</p>
              <p className="text-xs text-slate-400">{entry.voiceSummary}</p>
            </div>
          ))}
        </div>
      </AITGlassCard>

      <AITComplianceFooter />
      <AITVoiceGuide route="/ait/voice" />
    </div>
  );
}