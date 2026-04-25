import { RouteScaffold } from '@/components/protocol-mesh';

export default async function AITInvestorsCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  const path = (resolved.slug ?? []).join('/');
  return (
    <RouteScaffold
      title="AIT Investors Route"
      description="Scoped investor sub-route for data room, risk disclosures, milestones, verification, and access requests."
      route={`/ait/investors/${path}`}
    />
  );
}
