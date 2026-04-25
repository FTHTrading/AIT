import { RouteScaffold } from '@/components/protocol-mesh';

export default async function L1CatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  const path = (resolved.slug ?? []).join('/');
  return (
    <RouteScaffold
      title="L1 Route"
      description="Scoped L1 route for blocks, transactions, validators, state, policies, anchors, and health."
      route={`/l1/${path}`}
    />
  );
}
