import { protocolModules } from '@/data/protocol';

export function ModuleRegistryTable() {
  return (
    <section className="panel overflow-x-auto">
      <h2 className="panel-title">Module Registry</h2>
      <table className="w-full text-xs text-left text-gray-300">
        <thead className="text-gray-500 uppercase">
          <tr>
            <th className="py-2 pr-3">Module</th>
            <th className="py-2 pr-3">Category</th>
            <th className="py-2 pr-3">Status</th>
            <th className="py-2 pr-3">Version</th>
            <th className="py-2 pr-3">Owner</th>
          </tr>
        </thead>
        <tbody>
          {protocolModules.map((m) => (
            <tr key={m.moduleId} className="border-t border-gray-800 align-top">
              <td className="py-2 pr-3 text-cyan-300">{m.moduleId}</td>
              <td className="py-2 pr-3">{m.category}</td>
              <td className="py-2 pr-3">{m.status}</td>
              <td className="py-2 pr-3">{m.version}</td>
              <td className="py-2 pr-3">{m.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
