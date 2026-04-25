import { AnchorProofViewer } from '@/components/protocol-mesh';
import { buildExamplePayloads } from '@/lib/ait/engine';

const examples = buildExamplePayloads();

export default function ProtocolAnchorsPage() {
  return (
    <div className="space-y-6">
      <AnchorProofViewer />

      <section className="panel space-y-3">
        <h2 className="panel-title">Merkle Root Example</h2>
        <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">
          {JSON.stringify(examples.merkleProof, null, 2)}
        </pre>
      </section>

      <section className="panel grid gap-4 lg:grid-cols-3">
        <div>
          <h2 className="panel-title">Polygon Anchor</h2>
          <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">
            {JSON.stringify(examples.polygonAnchor, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className="panel-title">XRPL Anchor</h2>
          <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">
            {JSON.stringify(examples.xrplAnchor, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className="panel-title">UnyKorn L1 Anchor</h2>
          <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">
            {JSON.stringify(examples.unykornAnchor, null, 2)}
          </pre>
        </div>
      </section>
    </div>
  );
}
