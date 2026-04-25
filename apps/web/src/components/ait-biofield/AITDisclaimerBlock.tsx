import { aitComplianceDisclaimers } from '@/data/systems/ait-biofield/ait-biofield';

export function AITDisclaimerBlock() {
  return (
    <section className="panel border-amber-800 bg-amber-950/20">
      <h2 className="panel-title text-amber-300">Compliance and Safety Disclaimers</h2>
      <ul className="space-y-1 text-xs text-amber-100/90">
        {aitComplianceDisclaimers.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-amber-200">
        This section summarizes company-provided materials for diligence and protocol structuring purposes. It is not medical advice, not a clinical validation, and not a representation of regulatory approval.
      </p>
    </section>
  );
}
