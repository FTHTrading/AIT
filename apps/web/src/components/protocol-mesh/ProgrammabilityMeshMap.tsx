const layers = [
  'L1 Chain Runtime',
  'Programmability Mesh',
  'Agentic RAG Intelligence Layer',
  'Service Mesh / API / x402 Layer',
  'RWA / IP / Compliance / AI Modules',
];

export function ProgrammabilityMeshMap() {
  return (
    <section className="panel">
      <h2 className="panel-title">Mesh Architecture</h2>
      <div className="space-y-1 text-sm text-gray-300">
        {layers.map((layer, idx) => (
          <div key={layer}>
            <span>{layer}</span>
            {idx < layers.length - 1 && <div className="text-cyan-400">↓</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
