import { policyDecisions } from '@/data/protocol';

export function PolicyDecisionPanel() {
  return (
    <section className="panel space-y-3">
      <h2 className="panel-title">Policy Decisions</h2>
      {policyDecisions.map((decision) => (
        <div key={decision.id} className="rounded border border-gray-800 p-3 text-xs space-y-1">
          <p className="text-cyan-300 font-semibold">{decision.action}</p>
          <p className="text-gray-400">Decision: {decision.decision}</p>
          <p className="text-gray-500">Reason: {decision.reason}</p>
        </div>
      ))}
    </section>
  );
}
