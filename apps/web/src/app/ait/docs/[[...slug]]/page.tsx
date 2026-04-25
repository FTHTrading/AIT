import { RouteScaffold } from '@/components/protocol-mesh';

export default async function AITDocsCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  const path = (resolved.slug ?? []).join('/');
  return (
    <RouteScaffold
      title="AIT Docs Sub-Route"
      description="Scoped route for document visibility tiers and proof operations."
      route={`/ait/docs/${path}`}
    />
  );
}
