import { AITDisclaimerBlock, AITUseCaseGrid } from '@/components/ait-biofield';

export default function AITUseCasesPage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Use Cases</h1>
        <p className="text-sm text-gray-300 mt-2">
          Library of diligence-gated use cases with evidence requirements, regulatory risk signals, and on-chain proof object mappings.
        </p>
      </section>
      <AITUseCaseGrid />
      <AITDisclaimerBlock />
    </div>
  );
}
