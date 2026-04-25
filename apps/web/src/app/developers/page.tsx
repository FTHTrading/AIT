import { DeveloperQuickstart, WasmRuntimeCard, X402MeteringCard } from '@/components/protocol-mesh';

export default function DevelopersPage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Developer Hub</h1>
        <p className="text-sm text-gray-300 mt-2">SDK, APIs, event contracts, schema catalog, and programmable runtime quickstart.</p>
      </section>
      <DeveloperQuickstart />
      <WasmRuntimeCard />
      <X402MeteringCard />
    </div>
  );
}
