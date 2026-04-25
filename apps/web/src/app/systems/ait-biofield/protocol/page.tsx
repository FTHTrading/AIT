import { AITProtocolMeshCard } from '@/components/ait-biofield';
import { aitSampleEvents } from '@/data/systems/ait-biofield/protocolSchemas';

export default function AITProtocolPage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Protocol Integration</h1>
        <p className="text-sm text-gray-300 mt-2">
          AIT Biofield is modeled as a registered protocol module inside the sovereign infrastructure stack.
        </p>
      </section>
      <AITProtocolMeshCard />
      <section className="panel overflow-auto">
        <h2 className="panel-title">Node / Event Sync Payloads</h2>
        <div className="space-y-3">
          {aitSampleEvents.map((event) => (
            <pre key={event.eventType} className="rounded border border-gray-800 bg-gray-950 p-3 text-xs text-gray-300">
{JSON.stringify(event, null, 2)}
            </pre>
          ))}
        </div>
      </section>
    </div>
  );
}
