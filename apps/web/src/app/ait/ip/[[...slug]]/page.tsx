import { RouteScaffold } from '@/components/protocol-mesh';

export default async function AITIPCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  const path = (resolved.slug ?? []).join('/');
  return (
    <RouteScaffold
      title="AIT IP Sub-Route"
      description="Scoped route for registry, patents, trade secrets, proof vault, and verification panels."
      route={`/ait/ip/${path}`}
    />
  );
}
