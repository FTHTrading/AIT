import { RouteScaffold } from '@/components/protocol-mesh';

export default async function AgentsCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  const path = (resolved.slug ?? []).join('/');
  return (
    <RouteScaffold
      title="Agents Route"
      description="Scoped agent route for Kairos, RAG, codegen, simulation, reviews, and audit trails."
      route={`/agents/${path}`}
    />
  );
}
