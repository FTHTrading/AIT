import { AITGlassCard } from './AITGlassCard';

const flow = [
  'AIT Technology',
  'IP Vault',
  'Proof Engine',
  'Claim Governance',
  'License Registry',
  'RWA Engine',
  'x402 Access',
  'UnyKorn L1',
];

export function AITFlowTree() {
  return (
    <AITGlassCard title="AIT Infrastructure Flow" accent="blue">
      <div className="grid gap-3 md:grid-cols-4">
        {flow.map((step, index) => (
          <div key={step} className="rounded-lg border border-[#00AEEF]/30 bg-[#06111F]/70 p-3 text-sm text-[#F8FAFC]">
            <span className="block text-xs text-[#4DEBFF]">Step {index + 1}</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </AITGlassCard>
  );
}
