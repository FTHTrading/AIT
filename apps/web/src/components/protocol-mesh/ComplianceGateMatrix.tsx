const gates = [
  ['Medical Claim Publication', 'clinical + legal + regulatory'],
  ['Investor Package Release', 'legal + compliance'],
  ['Module Execution', 'simulation + policy'],
  ['Public IPFS Publication', 'privacy + security'],
  ['RWA Package Generation', 'legal + compliance'],
];

export function ComplianceGateMatrix() {
  return (
    <section className="panel overflow-x-auto">
      <h2 className="panel-title">Compliance Gate Matrix</h2>
      <table className="w-full text-xs text-left text-gray-300">
        <thead className="text-gray-500 uppercase">
          <tr>
            <th className="py-2 pr-3">Action</th>
            <th className="py-2 pr-3">Required Review</th>
          </tr>
        </thead>
        <tbody>
          {gates.map(([action, required]) => (
            <tr key={action} className="border-t border-gray-800">
              <td className="py-2 pr-3 text-cyan-300">{action}</td>
              <td className="py-2 pr-3">{required}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
