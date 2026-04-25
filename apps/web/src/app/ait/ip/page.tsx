import { AnchorProofViewer } from '@/components/protocol-mesh';
import { aitVaultDocuments } from '@/data/systems/ait-biofield/documents';

const ipTracks = [
  {
    title: 'Trade Secret Workflow',
    scope: 'Operating methods, diligence packets, and restricted know-how tracked by hash and visibility tier.',
  },
  {
    title: 'Patent Review Queue',
    scope: 'Draft claims, prior-art review, and prosecution readiness metadata before any external filing flow.',
  },
  {
    title: 'License Rights Registry',
    scope: 'Territory, equipment, protocol-access, and treatment-center usage rights packaged as governed assets.',
  },
];

export default function AITIPPage() {
  return (
    <div className="space-y-6">
      <section className="panel space-y-2">
        <h1 className="text-2xl font-bold">AIT IP Registry</h1>
        <p className="text-sm text-gray-300">
          Public-safe IP view for proof-linked document classes, license-right packaging, and registry status without exposing
          raw protected diligence content.
        </p>
        <p className="text-xs text-gray-500">Route: /ait/ip</p>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {ipTracks.map((track) => (
          <article key={track.title} className="panel space-y-2">
            <h2 className="text-sm font-semibold text-cyan-300">{track.title}</h2>
            <p className="text-xs text-gray-400">{track.scope}</p>
          </article>
        ))}
      </section>

      <section className="panel overflow-x-auto">
        <h2 className="panel-title">Proof-Linked Document Classes</h2>
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="uppercase text-gray-500">
            <tr>
              <th className="py-2 pr-3">Document</th>
              <th className="py-2 pr-3">Type</th>
              <th className="py-2 pr-3">Visibility</th>
              <th className="py-2 pr-3">Hash Status</th>
            </tr>
          </thead>
          <tbody>
            {aitVaultDocuments.map((doc) => (
              <tr key={doc.documentId} className="border-t border-gray-800">
                <td className="py-2 pr-3 text-cyan-300">{doc.title}</td>
                <td className="py-2 pr-3">{doc.type}</td>
                <td className="py-2 pr-3">{doc.visibility}</td>
                <td className="py-2 pr-3">{doc.hashStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <AnchorProofViewer />
    </div>
  );
}
