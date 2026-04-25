const nodes = [
  'AIT Technology',
  'Evidence Layer',
  'Protocol Registry',
  'RWA Structuring',
  'Treatment Center Licensing',
  'On-Chain Proof',
  'Investor/Diligence Portal',
];

export function AITSystemMap() {
  return (
    <section className="panel">
      <h2 className="panel-title">AIT System Map</h2>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {nodes.map((node, index) => (
          <div key={node} className="flex items-center gap-2">
            <span className="rounded border border-gray-700 bg-gray-800/60 px-3 py-2 text-gray-200">{node}</span>
            {index < nodes.length - 1 && <span className="text-cyan-400">→</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
