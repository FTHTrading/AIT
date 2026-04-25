import { AITClaimClassification, AITDisclaimerBlock } from '@/components/ait-biofield';

const items = [
  {
    title: 'Intracorporeal infusion concept',
    body: 'AIT describes an intracorporeal infusion concept based on a proprietary formula of fluid and mixed gases.',
  },
  {
    title: 'Claimed physiological support vectors',
    body: 'Company-provided claims include oxygenation support, CO2 management, pH balancing, hydration support, and detoxification-related effects.',
  },
  {
    title: 'Dialysis and hemodialysis context',
    body: 'Executive materials position the approach in relation to dialysis and hemodialysis workflows; this requires independent clinical and regulatory diligence.',
  },
  {
    title: 'Therapy vs software/protocol layer',
    body: 'AIT Biofield does not perform treatment. It models documents, claims, diligence, protocol states, and licensing workflows around source materials.',
  },
  {
    title: 'Validation posture',
    body: 'Claims require independent clinical and regulatory validation. Not FDA-reviewed unless verified by primary evidence.',
  },
];

export default function AITTechnologyPage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Technology</h1>
        <p className="text-sm text-gray-300 mt-2">
          Neutral technology framing for diligence-ready communication and protocol structuring.
        </p>
      </section>
      <div className="grid gap-3">
        {items.map((item) => (
          <article key={item.title} className="panel">
            <h2 className="text-base font-semibold text-cyan-300">{item.title}</h2>
            <p className="text-sm text-gray-300 mt-1">{item.body}</p>
          </article>
        ))}
      </div>
      <AITClaimClassification />
      <AITDisclaimerBlock />
    </div>
  );
}
