import { AITDisclaimerBlock, AITRwaFlow } from '@/components/ait-biofield';
import { buildExamplePayloads } from '@/lib/ait/engine';

const examples = buildExamplePayloads();

export default function AITRwaPage() {
  return (
    <div className="space-y-6">
      <section className="panel space-y-2">
        <h1 className="text-2xl font-bold">RWA and Capital Formation</h1>
        <p className="text-sm text-gray-300">
          The asset is not a promise. The asset is the documented, rights-based, diligence-gated infrastructure around IP, licensing, treatment-center deployment, and protocol usage.
        </p>
        <p className="text-xs text-amber-200">Legal review required for all offering-related structures. No live token sale is enabled.</p>
      </section>
      <AITRwaFlow />
      <section className="panel">
        <h2 className="panel-title">Waterfall Example</h2>
        <p className="text-sm text-gray-300">
          Intake → Diligence → IP/license mapping → SPV/legal structuring → compliance review → document hashing → on-chain anchoring → investor portal → license/revenue tracking.
        </p>
      </section>

      <section className="panel space-y-3">
        <h2 className="panel-title">RWA Package Example</h2>
        <p className="text-sm text-gray-300">
          Package generation is metadata-only. Every offering-related payload is marked LEGAL_REVIEW_REQUIRED and live token sale logic remains disabled.
        </p>
        <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">
          {JSON.stringify(examples.rwaPackage, null, 2)}
        </pre>
      </section>
      <AITDisclaimerBlock />
    </div>
  );
}
