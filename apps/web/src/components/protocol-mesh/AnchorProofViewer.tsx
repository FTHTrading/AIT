import { anchorRecords } from '@/data/protocol';

export function AnchorProofViewer() {
  return (
    <section className="panel space-y-3">
      <h2 className="panel-title">Anchor Proof Viewer</h2>
      <div className="space-y-2 text-xs text-gray-300">
        {anchorRecords.map((record) => (
          <div key={record.recordId} className="rounded border border-gray-800 p-2">
            <p className="text-cyan-300">{record.documentId}</p>
            <p className="text-gray-500">hash: {record.sha256Hash}</p>
            <p className="text-gray-500">merkle: {record.merkleRoot}</p>
            <p className="text-gray-500">status: {record.verificationStatus}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
