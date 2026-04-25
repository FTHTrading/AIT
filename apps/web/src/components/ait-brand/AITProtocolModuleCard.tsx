import { AITGlassCard } from './AITGlassCard';
import { AITStatusBadge } from './AITStatusBadge';

const capabilities = ['UnyKorn L1', 'Service Mesh', 'Proof Anchors', 'x402', 'RWA Registry', 'Agentic RAG'];

export function AITProtocolModuleCard() {
  return (
    <AITGlassCard title="Featured AIT Biofield Protocol Module" accent="gold">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-slate-200">The module registers evidence, claims, licenses, review events, and proof anchors.</p>
          <AITStatusBadge status="DILIGENCE" />
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item) => (
            <span key={item} className="rounded-md border border-[#D4AF37]/35 bg-[#06111F]/70 px-3 py-2 text-xs text-[#F5D36B]">
              {item}
            </span>
          ))}
        </div>
      </div>
    </AITGlassCard>
  );
}
