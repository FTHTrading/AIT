import { RouteScaffold } from '@/components/protocol-mesh';

export default async function AITCentersCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  const path = (resolved.slug ?? []).join('/');
  return (
    <RouteScaffold
      title="AIT Centers Sub-Route"
      description="Scoped center route for readiness, application, licensing, and compliance workflows."
      route={`/ait/centers/${path}`}
    />
  );
}
