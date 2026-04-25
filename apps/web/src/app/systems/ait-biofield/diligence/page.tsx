import { AITDiligenceMatrix, AITDisclaimerBlock } from '@/components/ait-biofield';

export default function AITDiligencePage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Diligence Checklist</h1>
        <p className="text-sm text-gray-300 mt-2">
          Compliance-gated checklist for clinical, legal, regulatory, privacy, and financing readiness.
        </p>
      </section>
      <AITDiligenceMatrix />
      <AITDisclaimerBlock />
    </div>
  );
}
