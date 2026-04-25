import { buildExamplePayloads } from '@/lib/ait/engine';
import { AITVoiceGuide } from '@/components/voice';

export default function DemoProofVaultPage() {
  const examples = buildExamplePayloads();

  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Demo Proof Vault</h1>
        <p className="mt-2 text-sm text-gray-300">Safe sample proof manifest and Merkle proof data for investor and partner demos.</p>
      </section>
      <section className="panel">
        <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">{JSON.stringify(examples.documentManifest, null, 2)}</pre>
      </section>
      <section className="panel">
        <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">{JSON.stringify(examples.merkleProof, null, 2)}</pre>
      </section>
      <AITVoiceGuide route="/demo/proof-vault" />
    </div>
  );
}