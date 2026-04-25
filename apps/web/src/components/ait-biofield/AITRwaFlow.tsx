import { aitRwaPathwaySteps, aitRwaStructures } from '@/data/systems/ait-biofield/rwaModel';

const anchorFlow = ['Documents', 'Hash', 'Merkle Root', 'IPFS', 'Polygon/XRPL/UnyKorn L1 Anchor', 'License Registry', 'SPV / Investor Vault'];

export function AITRwaFlow() {
  return (
    <section className="panel space-y-4">
      <h2 className="panel-title">RWA Pathway: From Medical IP to Verifiable Infrastructure Asset</h2>
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
        {anchorFlow.map((step, idx) => (
          <div key={step} className="flex items-center gap-2">
            <span className="rounded border border-gray-700 bg-gray-800/60 px-2 py-1">{step}</span>
            {idx < anchorFlow.length - 1 && <span className="text-cyan-400">→</span>}
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {aitRwaStructures.map((item) => (
          <div key={item.title} className="rounded border border-gray-700 p-3">
            <h3 className="text-sm font-semibold text-cyan-300">{item.title}</h3>
            <p className="text-xs text-gray-400 mt-1">{item.description}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">Waterfall: {aitRwaPathwaySteps.join(' -> ')}</p>
    </section>
  );
}
