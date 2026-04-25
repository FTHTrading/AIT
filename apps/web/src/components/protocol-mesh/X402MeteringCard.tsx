import { x402Policies } from '@/data/protocol';

export function X402MeteringCard() {
  return (
    <section className="panel space-y-3">
      <h2 className="panel-title">x402 Metering</h2>
      <div className="space-y-2 text-xs text-gray-300">
        {x402Policies.map((policy) => (
          <div key={policy.route} className="rounded border border-gray-800 p-2">
            <p className="text-cyan-300">{policy.route}</p>
            <p>mode: {policy.mode}{policy.priceUsd != null ? ` · price: $${policy.priceUsd}` : ''}</p>
            <p className="text-gray-500">{policy.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
