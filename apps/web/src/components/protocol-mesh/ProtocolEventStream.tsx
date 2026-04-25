import { protocolEventStream } from '@/data/protocol';

export function ProtocolEventStream() {
  return (
    <section className="panel space-y-3">
      <h2 className="panel-title">Protocol Event Stream</h2>
      <div className="space-y-2 text-xs text-gray-300">
        {protocolEventStream.map((evt) => (
          <div key={`${evt.eventType}-${evt.createdAt}`} className="rounded border border-gray-800 p-2">
            <p className="text-cyan-300 font-semibold">{evt.eventType}</p>
            <p className="text-gray-500">{evt.moduleId} • {evt.status} • {evt.createdAt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
