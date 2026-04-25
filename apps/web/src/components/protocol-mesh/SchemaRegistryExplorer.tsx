import { protocolSchemas } from '@/data/protocol';

export function SchemaRegistryExplorer() {
  return (
    <section className="panel space-y-3">
      <h2 className="panel-title">Schema Registry</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {protocolSchemas.map((schema) => (
          <article key={schema.id} className="rounded border border-gray-700 p-3 space-y-1">
            <h3 className="text-sm font-semibold text-cyan-300">{schema.name} • {schema.version}</h3>
            <p className="text-xs text-gray-400">{schema.summary}</p>
            <p className="text-[11px] text-gray-500">Required: {schema.requiredFields.join(', ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
