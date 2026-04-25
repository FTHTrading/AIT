import { AITComplianceFooter, AITGlassCard, AITPdfLibrary } from '@/components/ait-brand';
import { AITVoiceGuide } from '@/components/voice';
import { aitDocuments } from '@/data/ait/documents';

export default function AITDocsRootPage() {
  return (
    <div className="space-y-6">
      <AITGlassCard title="Public-Safe Document Library" accent="gold">
        <p className="text-sm text-slate-300">
          Shareable PDFs and certificates for diligence, protocol framing, and investor/demo use. Private KYC, formulas, raw medical records,
          private contracts, and confidential investor materials are excluded.
        </p>
      </AITGlassCard>

      <AITPdfLibrary />

      <AITGlassCard title="Document Voice Summaries" accent="blue">
        <ul className="space-y-2 text-sm text-slate-300">
          {aitDocuments.map((doc) => (
            <li key={doc.filename}>
              <span className="font-semibold text-[#4DEBFF]">{doc.title}:</span> {doc.voiceSummary}
            </li>
          ))}
        </ul>
      </AITGlassCard>

      <AITComplianceFooter />
      <AITVoiceGuide route="/ait/docs" />
    </div>
  );
}
