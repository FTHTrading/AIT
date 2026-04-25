import { RouteScaffold } from '@/components/protocol-mesh';

export default async function AITClaimsCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  const path = (resolved.slug ?? []).join('/');
  return (
    <RouteScaffold
      title="AIT Claims Sub-Route"
      description="Scoped claims route for review, evidence, public-safe, and classification queues."
      route={`/ait/claims/${path}`}
    />
  );
}
