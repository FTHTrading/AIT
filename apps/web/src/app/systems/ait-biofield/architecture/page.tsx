import { AITProtocolMeshCard, AITSystemMap } from '@/components/ait-biofield';

const engines = [
  'Evidence Registry',
  'Protocol Registry',
  'Claim Registry',
  'Diligence Engine',
  'License Engine',
  'RWA Structuring Engine',
  'Node Sync Layer',
  'Service Mesh Adapter',
  'L1 Protocol Adapter',
  'On-chain Anchor Adapter',
  'Investor Portal Adapter',
  'Document Intelligence Adapter',
];

const architectureText = [
  'AIT Source Materials',
  'Document Intelligence Engine',
  'Claim Classification + Evidence Matrix',
  'Protocol Registry',
  'On-Chain Anchor Broadcast',
  'License / RWA Structuring',
  'Investor + Treatment Center Diligence Room',
  'UnyKorn L1 / Sovereign Service Mesh',
];

export default function AITArchitecturePage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Technical Architecture</h1>
        <p className="text-sm text-gray-300 mt-2">
          Documented infrastructure around evidence processing, claims governance, licensing, RWA structuring, and anchor broadcasting.
        </p>
      </section>

      <section className="panel">
        <h2 className="panel-title">Architecture Diagram Text</h2>
        <div className="space-y-1 text-sm text-gray-300">
          {architectureText.map((line, idx) => (
            <div key={line}>
              <span>{line}</span>
              {idx < architectureText.length - 1 && <div className="text-cyan-400">↓</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Engine Inventory</h2>
        <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-300">
          {engines.map((engine) => (
            <span key={engine} className="rounded border border-gray-700 px-2 py-1">{engine}</span>
          ))}
        </div>
      </section>

      <AITSystemMap />
      <AITProtocolMeshCard />
    </div>
  );
}
