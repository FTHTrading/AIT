import { aitIntegrationMap, aitProtocolDefinition } from '@/data/systems/ait-biofield/protocolSchemas';

export function AITProtocolMeshCard() {
  return (
    <section className="panel space-y-4">
      <h2 className="panel-title">AIT Protocol / Service Mesh Integration</h2>
      <p className="text-sm text-gray-300">{aitProtocolDefinition.publicDescription}</p>
      <p className="text-sm text-gray-400">
        AIT Biofield is registered as a sovereign protocol module. It does not replace the L1. It sits above the L1 as an application/protocol vertical that uses canonical schemas, communication standards, and node sync to publish proof events, document attestations, licensing states, and diligence milestones.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded border border-gray-700 p-3">
          <h3 className="text-sm font-semibold text-cyan-300 mb-2">L1 Protocol Layer</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            {aitIntegrationMap.l1ProtocolLayer.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div className="rounded border border-gray-700 p-3">
          <h3 className="text-sm font-semibold text-cyan-300 mb-2">Service Mesh</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            {aitIntegrationMap.serviceMesh.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div className="rounded border border-gray-700 p-3">
          <h3 className="text-sm font-semibold text-cyan-300 mb-2">On-Chain Anchor Layer</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            {aitIntegrationMap.onChainAnchorLayer.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div className="rounded border border-gray-700 p-3">
          <h3 className="text-sm font-semibold text-cyan-300 mb-2">Application Layer</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            {aitIntegrationMap.applicationLayer.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
