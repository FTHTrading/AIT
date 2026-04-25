import { AITDisclaimerBlock } from '@/components/ait-biofield';
import { aitVaultDocuments } from '@/data/systems/ait-biofield/documents';
import { aitProtocolDefinition } from '@/data/systems/ait-biofield/protocolSchemas';
import { aitRwaStructures } from '@/data/systems/ait-biofield/rwaModel';

const investorMilestones = [
  'Protocol module registration and schema versioning',
  'Document hashing and anchor-ready proof pack generation',
  'Treatment-center licensing packet design',
  'RWA structuring memo and disclosure flow completion',
  'Controlled data-room release for qualified counterparties',
];

export default function AITInvestorsPage() {
  return (
    <div className="space-y-6">
      <section className="panel space-y-2">
        <h1 className="text-2xl font-bold">AIT Investors</h1>
        <p className="text-sm text-gray-300">
          Controlled-access overview for diligence, rights packaging, protocol readiness, and milestone framing.
        </p>
        <p className="text-xs text-gray-500">Route: /ait/investors</p>
      </section>

      <section className="panel space-y-2">
        <h2 className="panel-title">Investment Thesis</h2>
        <p className="text-sm text-gray-300">{aitProtocolDefinition.publicDescription}</p>
        <div className="flex flex-wrap gap-2 text-xs text-gray-300">
          <span className="rounded border border-gray-700 px-2 py-1">data-room</span>
          <span className="rounded border border-gray-700 px-2 py-1">risk-disclosures</span>
          <span className="rounded border border-gray-700 px-2 py-1">request-access</span>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {aitRwaStructures.map((structure) => (
          <article key={structure.title} className="panel space-y-2">
            <h2 className="text-sm font-semibold text-cyan-300">{structure.title}</h2>
            <p className="text-xs text-gray-400">{structure.description}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <h2 className="panel-title">Milestones</h2>
        <ol className="space-y-2 text-sm text-gray-300">
          {investorMilestones.map((milestone, index) => (
            <li key={milestone} className="rounded border border-gray-800 px-3 py-2">
              {index + 1}. {milestone}
            </li>
          ))}
        </ol>
      </section>

      <section className="panel overflow-x-auto">
        <h2 className="panel-title">Qualified Access Packets</h2>
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="uppercase text-gray-500">
            <tr>
              <th className="py-2 pr-3">Document</th>
              <th className="py-2 pr-3">Visibility</th>
              <th className="py-2 pr-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {aitVaultDocuments
              .filter((doc) => doc.visibility !== 'private')
              .map((doc) => (
                <tr key={doc.documentId} className="border-t border-gray-800">
                  <td className="py-2 pr-3 text-cyan-300">{doc.title}</td>
                  <td className="py-2 pr-3">{doc.visibility}</td>
                  <td className="py-2 pr-3">{doc.hashStatus}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      <AITDisclaimerBlock />
    </div>
  );
}
