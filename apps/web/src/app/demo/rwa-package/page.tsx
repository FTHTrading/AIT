import { buildExamplePayloads } from '@/lib/ait/engine';
import { AITVoiceGuide } from '@/components/voice';

export default function DemoRwaPackagePage() {
  const examples = buildExamplePayloads();

  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Demo RWA Package</h1>
        <p className="mt-2 text-sm text-gray-300">Metadata-only rights package example. No live sale logic and no private source materials.</p>
      </section>
      <section className="panel">
        <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">{JSON.stringify(examples.rwaPackage, null, 2)}</pre>
      </section>
      <AITVoiceGuide route="/demo/rwa-package" />
    </div>
  );
}