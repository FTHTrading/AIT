import { AgentSimulationPanel, ProtocolEventStream } from '@/components/protocol-mesh';

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Agentic RAG Control Plane</h1>
        <p className="text-sm text-gray-300 mt-2">AI agents propose actions, run simulations, and submit policy-reviewed execution plans.</p>
      </section>
      <AgentSimulationPanel />
      <ProtocolEventStream />
    </div>
  );
}
