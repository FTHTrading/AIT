import { programmabilityRoadmap } from '@/data/protocol';

export function DeveloperQuickstart() {
  return (
    <section className="panel space-y-3">
      <h2 className="panel-title">Developer Quickstart</h2>
      <ol className="space-y-1 text-sm text-gray-300 list-decimal ml-5">
        <li>Register a protocol module.</li>
        <li>Register canonical schemas.</li>
        <li>Run simulation before execution.</li>
        <li>Pass policy gate.</li>
        <li>Emit protocol events and anchor proofs.</li>
      </ol>
      <div className="space-y-1 text-xs text-gray-500">
        {programmabilityRoadmap.map((step) => (
          <p key={step.phase}>{step.phase}: {step.title}</p>
        ))}
      </div>
    </section>
  );
}
