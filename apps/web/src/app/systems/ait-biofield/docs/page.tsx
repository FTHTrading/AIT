import { AITDocumentVault, AITDisclaimerBlock } from '@/components/ait-biofield';

export default function AITDocsPage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Document Vault</h1>
        <p className="text-sm text-gray-300 mt-2">
          Public cards expose only safe summaries. KYC and private diligence records are marked restricted/private and never rendered raw.
        </p>
      </section>
      <AITDocumentVault />
      <AITDisclaimerBlock />
    </div>
  );
}
