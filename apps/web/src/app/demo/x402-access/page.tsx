import { buildExamplePayloads } from '@/lib/ait/engine';
import { x402PaidRouteExamples } from '@/lib/ait/adapters';
import { AITVoiceGuide } from '@/components/voice';

export default function DemoX402AccessPage() {
  const examples = buildExamplePayloads();

  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Demo x402 Access</h1>
        <p className="mt-2 text-sm text-gray-300">Safe challenge, receipt, and paid-route examples for API monetization demos.</p>
      </section>
      <section className="panel grid gap-4 lg:grid-cols-2">
        <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">{JSON.stringify(examples.x402Challenge, null, 2)}</pre>
        <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">{JSON.stringify(examples.x402Receipt, null, 2)}</pre>
      </section>
      <section className="panel">
        <ul className="space-y-1 text-sm text-gray-300">
          {x402PaidRouteExamples.map((route) => (
            <li key={route}>{route}</li>
          ))}
        </ul>
      </section>
      <AITVoiceGuide route="/demo/x402-access" />
    </div>
  );
}