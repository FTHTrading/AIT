import { aitDiligenceMatrix } from '@/data/systems/ait-biofield/diligence';

export function AITDiligenceMatrix() {
  return (
    <section className="panel overflow-x-auto">
      <h2 className="panel-title">AIT Diligence Matrix</h2>
      <table className="w-full text-xs text-left text-gray-300">
        <thead className="text-gray-500 uppercase">
          <tr>
            <th className="py-2 pr-3">Diligence Area</th>
            <th className="py-2 pr-3">Required Evidence</th>
            <th className="py-2 pr-3">Status</th>
            <th className="py-2 pr-3">Risk</th>
            <th className="py-2 pr-3">On-chain Proof Object</th>
            <th className="py-2">Owner</th>
          </tr>
        </thead>
        <tbody>
          {aitDiligenceMatrix.map((row) => (
            <tr key={row.area} className="border-t border-gray-800 align-top">
              <td className="py-2 pr-3 text-cyan-300">{row.area}</td>
              <td className="py-2 pr-3">{row.requiredEvidence}</td>
              <td className="py-2 pr-3">{row.status}</td>
              <td className="py-2 pr-3">{row.risk}</td>
              <td className="py-2 pr-3">{row.onChainProofObject}</td>
              <td className="py-2">{row.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
