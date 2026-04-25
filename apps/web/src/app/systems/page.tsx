import { aitBiofieldSystemCard } from '@/data/systems/ait-biofield/ait-biofield';

const modules = [
  {
    title: 'AIT Biofield Protocol Module',
    category: 'Health Infrastructure / RWA / Evidence Protocol',
    status: 'DILIGENCE',
    description:
      'Protocol module for registering AIT-related documents, claims, license packages, treatment-center readiness scoring, and RWA-readiness events into the sovereign infrastructure mesh.',
    capabilities: [
      'Medical claims registry',
      'Evidence/document anchoring',
      'License package modeling',
      'Treatment center readiness scoring',
      'RWA structuring support',
      'Investor diligence vault',
      'On-chain proof events',
      'Service mesh synchronization',
      'L1 event schema integration',
    ],
  },
];

export default function SystemsRegistryPage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Systems Registry</h1>
        <p className="text-sm text-gray-300 mt-2">
          Sovereign protocol modules connected to the UnyKorn service mesh and proof infrastructure.
        </p>
      </section>

      <section className="panel space-y-3">
        <h2 className="panel-title">System Card</h2>
        <h3 className="text-lg font-semibold text-cyan-300">{aitBiofieldSystemCard.name}</h3>
        <p className="text-sm text-gray-300">{aitBiofieldSystemCard.shortDescription}</p>
        <a href={aitBiofieldSystemCard.slug} className="text-sm text-cyan-400 hover:underline">
          Open module →
        </a>
      </section>

      {modules.map((module) => (
        <section key={module.title} className="panel space-y-2">
          <h2 className="text-lg font-semibold text-cyan-300">{module.title}</h2>
          <p className="text-xs text-gray-500">{module.category} • {module.status}</p>
          <p className="text-sm text-gray-300">{module.description}</p>
          <div className="grid gap-2 md:grid-cols-2 text-xs text-gray-400">
            {module.capabilities.map((capability) => (
              <span key={capability} className="rounded border border-gray-700 px-2 py-1">{capability}</span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
