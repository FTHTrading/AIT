import { AITGlassCard, AITStatusBadge } from '@/components/ait-brand';
import { RouteScaffold, PolicyDecisionPanel, ComplianceGateMatrix } from '@/components/protocol-mesh';
import { ReviewQueuePanel } from '@/components/ait-admin/ReviewQueuePanel';
import { AdminVoiceAssistant } from '@/components/voice';
import { requireAdminPageAccess } from '@/lib/ait/access';
import { getAdminQueueItems } from '@/lib/ait/admin';
import { buildExamplePayloads } from '@/lib/ait/engine';
import { adminVoiceEnabled } from '@/lib/voice/providers';

const examples = buildExamplePayloads();

export const dynamic = 'force-dynamic';

export default async function AdminAITPage() {
  const session = await requireAdminPageAccess();
  const queueItems = await getAdminQueueItems();
  const statuses = examples.reviewStatuses.map((status) => ({
    label: status,
    count: queueItems.filter((item) => item.reviewStatus === status).length,
  }));

  return (
    <div className="space-y-6">
      <RouteScaffold
        title="Admin AIT"
        description="Admin control plane for documents, claims, reviews, licenses, investors, centers, anchors, protocol events, and settings."
        route="/admin/ait"
      />
      <PolicyDecisionPanel />
      <ComplianceGateMatrix />

      <AITGlassCard title="Review Status Model" accent="blue">
        <div className="grid gap-2 md:grid-cols-2 text-xs text-gray-300">
          {examples.reviewStatuses.map((status) => (
            <div key={status} className="rounded border border-gray-800 px-3 py-2 text-cyan-300"><AITStatusBadge status={status === 'READY_FOR_ANCHOR' ? 'READY_FOR_ANCHOR' : status === 'APPROVED' || status === 'ANCHORED' ? 'LIVE' : status.includes('LEGAL') ? 'LEGAL_REVIEW_REQUIRED' : status.includes('REVIEW') ? 'REVIEW_REQUIRED' : status === 'REJECTED' ? 'RESTRICTED' : 'DILIGENCE'} className="mr-2" />{status}</div>
          ))}
        </div>
      </AITGlassCard>

      <section className="panel space-y-3">
        <h2 className="panel-title">Anchor-Ready Review Example</h2>
        <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">
          {JSON.stringify({ claimReview: examples.claimReview, polygonAnchor: examples.polygonAnchor }, null, 2)}
        </pre>
      </section>

      {adminVoiceEnabled() ? <AdminVoiceAssistant route="/admin/ait" totalItems={queueItems.length} statuses={statuses.slice(0, 3)} /> : null}

      <ReviewQueuePanel
        title="Pending Review Queue"
        description="Durable review history across saved proofs, claims, anchors, RWA packages, and x402 records. POST review mutations require an admin role header or token."
        items={queueItems.slice(0, 8)}
        role={session.role}
      />
    </div>
  );
}
