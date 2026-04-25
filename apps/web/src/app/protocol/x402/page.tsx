import { X402MeteringCard } from '@/components/protocol-mesh';
import { buildExamplePayloads } from '@/lib/ait/engine';

const examples = buildExamplePayloads();

export default function ProtocolX402Page() {
  return (
    <div className="space-y-6">
      <X402MeteringCard />

      <section className="panel grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="panel-title">x402 Challenge Example</h2>
          <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">
            {JSON.stringify(examples.x402Challenge, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className="panel-title">x402 Receipt Example</h2>
          <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">
            {JSON.stringify(examples.x402Receipt, null, 2)}
          </pre>
        </div>
      </section>
    </div>
  );
}
