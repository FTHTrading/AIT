import { aitUseCases } from '@/data/systems/ait-biofield/useCases';

export function AITUseCaseGrid() {
  return (
    <section className="space-y-3">
      <h2 className="panel-title">Use-Case Library</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {aitUseCases.map((item) => (
          <article key={item.useCaseId} className="panel space-y-2">
            <h3 className="text-base font-semibold text-cyan-300">{item.name}</h3>
            <p className="text-sm text-gray-300">{item.description}</p>
            <p className="text-xs text-gray-400"><span className="text-gray-500">Claimed value:</span> {item.claimedValue}</p>
            <p className="text-xs text-gray-400"><span className="text-gray-500">Required evidence:</span> {item.evidenceRequired}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded border border-gray-700 bg-gray-800/60 px-2 py-1">Risk: {item.regulatoryRisk}</span>
              <span className="rounded border border-gray-700 bg-gray-800/60 px-2 py-1">Diligence: {item.diligenceStatus}</span>
            </div>
            <p className="text-xs text-gray-500">On-chain proof objects: {item.proofObjects.join(', ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
