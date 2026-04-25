import { agentCapabilities } from '@/data/protocol';

export function AgentSimulationPanel() {
  return (
    <section className="panel space-y-3">
      <h2 className="panel-title">Agent Simulation Gate</h2>
      <p className="text-sm text-gray-300">Agents propose, simulate, and explain actions. Policy decides execution.</p>
      <div className="space-y-2 text-xs text-gray-300">
        {agentCapabilities.map((cap) => (
          <div key={cap.id} className="rounded border border-gray-800 p-2">
            <p className="text-cyan-300 font-semibold">{cap.name}</p>
            <p>{cap.scope}</p>
            <p className="text-gray-500">
              simulation={String(cap.requiresSimulation)} · policy={String(cap.requiresPolicyGate)} · humanApproval={String(cap.requiresHumanApproval)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
