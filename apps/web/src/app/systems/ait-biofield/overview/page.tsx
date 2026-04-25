import { AITDisclaimerBlock, AITHero } from '@/components/ait-biofield';
import { aitBrandOptions } from '@/data/systems/ait-biofield/ait-biofield';

export default function AITOverviewPage() {
  return (
    <div className="space-y-6">
      <AITHero />
      <section className="panel space-y-3">
        <h2 className="panel-title">Full System Overview</h2>
        <p className="text-sm text-gray-300">
          AIT describes an intracorporeal infusion technology concept. The AIT Biofield module adds an evidence layer, claims governance, licensing workflows, diligence operations, and proof anchoring inside the UnyKorn sovereign infrastructure ecosystem.
        </p>
        <p className="text-sm text-gray-400">
          Positioning: From therapeutic concept to verifiable infrastructure.
        </p>
        <p className="text-sm text-gray-400">
          The L1 defines the rules. The Service Mesh moves the data. The AIT Biofield module registers the evidence, claims, licenses, and RWA pathways.
        </p>
      </section>
      <section className="panel">
        <h2 className="panel-title">Public Brand Options</h2>
        <div className="flex flex-wrap gap-2">
          {aitBrandOptions.map((brand) => (
            <span key={brand} className="rounded border border-gray-700 bg-gray-800/50 px-2 py-1 text-xs text-gray-300">
              {brand}
            </span>
          ))}
        </div>
      </section>
      <AITDisclaimerBlock />
    </div>
  );
}
