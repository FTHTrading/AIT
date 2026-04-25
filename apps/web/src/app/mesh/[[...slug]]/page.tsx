import { RouteScaffold } from '@/components/protocol-mesh';

export default async function MeshCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  const path = (resolved.slug ?? []).join('/');
  return (
    <RouteScaffold
      title="Mesh Route"
      description="Scoped mesh route for modules, schemas, policies, permissions, simulations, and SDK docs."
      route={`/mesh/${path}`}
    />
  );
}
