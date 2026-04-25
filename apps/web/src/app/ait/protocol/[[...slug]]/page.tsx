import { RouteScaffold } from '@/components/protocol-mesh';

export default async function AITProtocolCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  const path = (resolved.slug ?? []).join('/');
  return (
    <RouteScaffold
      title="AIT Protocol Explorer"
      description="Scoped protocol explorer route for events, schemas, anchors, IPFS, Merkle, XRPL, Polygon, and Uny L1 links."
      route={`/ait/protocol/${path}`}
    />
  );
}
