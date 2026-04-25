const claimClasses = [
  'Company-provided',
  'Research-stage',
  'Requires validation',
  'Verified',
  'Not yet verified',
  'Needs clinical validation',
  'Needs regulatory review',
  'Needs legal review',
  'Public-safe',
  'Restricted',
];

export function AITClaimClassification() {
  return (
    <section className="panel space-y-3">
      <h2 className="panel-title">Claim Governance Classification</h2>
      <p className="text-sm text-gray-300">
        Every medical, technical, financial, and regulatory statement is tagged before publication and before financing pathways are opened.
      </p>
      <div className="flex flex-wrap gap-2">
        {claimClasses.map((label) => (
          <span key={label} className="rounded border border-amber-700 bg-amber-950/30 px-2 py-1 text-xs text-amber-200">
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
