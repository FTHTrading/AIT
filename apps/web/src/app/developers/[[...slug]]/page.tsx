import { RouteScaffold } from '@/components/protocol-mesh';

export default async function DevelopersCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  const path = (resolved.slug ?? []).join('/');
  return (
    <RouteScaffold
      title="Developers Route"
      description="Scoped developer route for SDK docs, examples, API references, and testnet guides."
      route={`/developers/${path}`}
    />
  );
}
