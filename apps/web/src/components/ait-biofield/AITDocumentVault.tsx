import { aitVaultDocuments } from '@/data/systems/ait-biofield/documents';

const actions = ['View Summary', 'Verify Hash', 'Request Access', 'Generate Memo', 'Mark Reviewed', 'Anchor Document'];

export function AITDocumentVault() {
  return (
    <section className="space-y-3">
      <h2 className="panel-title">Document Vault</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {aitVaultDocuments.map((doc) => (
          <article key={doc.documentId} className="panel space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-cyan-300">{doc.title}</h3>
              <span className={`rounded px-2 py-1 text-[10px] uppercase tracking-widest ${doc.visibility === 'public' ? 'bg-green-900/40 text-green-300' : doc.visibility === 'restricted' ? 'bg-amber-900/40 text-amber-300' : 'bg-red-900/40 text-red-300'}`}>
                {doc.visibility}
              </span>
            </div>
            <p className="text-xs text-gray-400">{doc.summary}</p>
            <p className="text-[11px] text-gray-500">Hash status: {doc.hashStatus}</p>
            <div className="flex flex-wrap gap-1">
              {actions.map((action) => (
                <button key={action} className="rounded border border-gray-700 px-2 py-1 text-[10px] text-gray-300 hover:border-cyan-500">
                  {action}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
