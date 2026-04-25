import { ComplianceGateMatrix, RwaModuleCard } from '@/components/protocol-mesh';

const licensePackages = [
  {
    name: 'Retrofit Package A',
    territory: 'US pilot territories',
    scope: 'Existing treatment-center retrofit, documented equipment scope, readiness scoring, and protocol access.',
    gate: 'legal-review-required',
  },
  {
    name: 'Standalone Center Package',
    territory: 'jurisdiction-specific',
    scope: 'New facility rollout with licensing, training, compliance, and evidence-linked deployment packet.',
    gate: 'clinical-and-regulatory-review-required',
  },
  {
    name: 'Protocol Usage Rights',
    territory: 'global enterprise accounts',
    scope: 'Software, registry, anchoring, and diligence workflow access priced as governed usage rights.',
    gate: 'compliance-review-required',
  },
];

export default function AITLicensingPage() {
  return (
    <div className="space-y-6">
      <section className="panel space-y-2">
        <h1 className="text-2xl font-bold">AIT Licensing</h1>
        <p className="text-sm text-gray-300">
          Territory, treatment-center, equipment, and protocol-usage rights packaged as compliance-gated licensing products.
        </p>
        <p className="text-xs text-gray-500">Route: /ait/licensing</p>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {licensePackages.map((pkg) => (
          <article key={pkg.name} className="panel space-y-2">
            <h2 className="text-sm font-semibold text-cyan-300">{pkg.name}</h2>
            <p className="text-xs text-gray-500">{pkg.territory}</p>
            <p className="text-xs text-gray-400">{pkg.scope}</p>
            <p className="text-xs text-amber-200">Gate: {pkg.gate}</p>
          </article>
        ))}
      </section>

      <RwaModuleCard />
      <ComplianceGateMatrix />
    </div>
  );
}
