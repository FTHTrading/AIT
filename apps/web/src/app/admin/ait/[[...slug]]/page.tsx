import { RouteScaffold } from '@/components/protocol-mesh';

export default async function AdminAITCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  const path = (resolved.slug ?? []).join('/');
  return (
    <RouteScaffold
      title="Admin AIT Sub-Route"
      description="Scoped admin route for operational review queues and control-plane tools."
      route={`/admin/ait/${path}`}
    />
  );
}
