import { ProgrammabilityMeshMap, SchemaRegistryExplorer, ProtocolEventStream, WasmRuntimeCard } from '@/components/protocol-mesh';

export default function MeshPage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Programmability Mesh</h1>
        <p className="text-sm text-gray-300 mt-2">Module registry, schema registry, event routing, policy gates, and simulation-first execution.</p>
      </section>
      <ProgrammabilityMeshMap />
      <SchemaRegistryExplorer />
      <ProtocolEventStream />
      <WasmRuntimeCard />
    </div>
  );
}
