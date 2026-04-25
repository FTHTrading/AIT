import { AITClaimClassification } from '@/components/ait-biofield';
import { aitUseCases } from '@/data/systems/ait-biofield/useCases';
import { buildExamplePayloads } from '@/lib/ait/engine';

const examples = buildExamplePayloads();

const publicationRules = [
  ['medical', 'restricted until evidence, legal review, and clinical review are attached'],
  ['technical', 'public-safe only when the implementation description excludes efficacy claims'],
  ['financial', 'restricted until counsel-approved disclosure text is attached'],
  ['regulatory', 'must include source citation and review status before public release'],
];

export default function AITClaimsPage() {
  return (
    <div className="space-y-6">
      <section className="panel space-y-2">
        <h1 className="text-2xl font-bold">AIT Claims</h1>
        <p className="text-sm text-gray-300">
          Claims are governed as evidence-linked records with publication class, validation state, and compliance gates.
          No medical or financial claim becomes public-safe until the required review trail is complete.
        </p>
        <p className="text-xs text-gray-500">Route: /ait/claims</p>
      </section>

      <AITClaimClassification />

      <section className="panel overflow-x-auto">
        <h2 className="panel-title">Publication Rules</h2>
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="uppercase text-gray-500">
            <tr>
              <th className="py-2 pr-3">Class</th>
              <th className="py-2 pr-3">Rule</th>
            </tr>
          </thead>
          <tbody>
            {publicationRules.map(([claimClass, rule]) => (
              <tr key={claimClass} className="border-t border-gray-800 align-top">
                <td className="py-2 pr-3 text-cyan-300">{claimClass}</td>
                <td className="py-2 pr-3">{rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel overflow-x-auto">
        <h2 className="panel-title">Tracked Claim Candidates</h2>
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="uppercase text-gray-500">
            <tr>
              <th className="py-2 pr-3">Use Case</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Risk</th>
              <th className="py-2 pr-3">Evidence Required</th>
            </tr>
          </thead>
          <tbody>
            {aitUseCases.map((useCase) => (
              <tr key={useCase.useCaseId} className="border-t border-gray-800 align-top">
                <td className="py-2 pr-3">
                  <div className="text-cyan-300">{useCase.name}</div>
                  <div className="text-gray-500">{useCase.claimedValue}</div>
                </td>
                <td className="py-2 pr-3">{useCase.diligenceStatus}</td>
                <td className="py-2 pr-3">{useCase.regulatoryRisk}</td>
                <td className="py-2 pr-3">{useCase.evidenceRequired}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel space-y-3">
        <h2 className="panel-title">Classification Example</h2>
        <p className="text-sm text-gray-300">
          The claim engine assigns category, risk level, public publishing eligibility, evidence checklist, and review status in one pass.
        </p>
        <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">
          {JSON.stringify(examples.claimReview, null, 2)}
        </pre>
      </section>
    </div>
  );
}
