import { AITProtocolMeshCard, AITDisclaimerBlock } from '@/components/ait-biofield';

export default function AITProtocolRootPage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">AIT Protocol</h1>
        <p className="text-sm text-gray-300 mt-2">Protocol-level registry and explorer for events, schemas, anchors, and mesh sync.</p>
      </section>
      <AITProtocolMeshCard />
      <AITDisclaimerBlock />
    </div>
  );
}
