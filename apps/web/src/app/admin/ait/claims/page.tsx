import { ReviewQueuePanel } from '@/components/ait-admin/ReviewQueuePanel';
import { AdminVoiceAssistant } from '@/components/voice';
import { requireAdminPageAccess } from '@/lib/ait/access';
import { getQueueItemsByEntityType } from '@/lib/ait/admin';
import { adminVoiceEnabled } from '@/lib/voice/providers';

export const dynamic = 'force-dynamic';

export default async function AdminAITClaimsPage() {
  const session = await requireAdminPageAccess();
  const [claims, evidence] = await Promise.all([
    getQueueItemsByEntityType('claim'),
    getQueueItemsByEntityType('evidence'),
  ]);

  return (
    <div className="space-y-6">
      <section className="panel space-y-2">
        <h1 className="text-2xl font-bold">Admin AIT Claims</h1>
        <p className="text-sm text-gray-300">Claim classification, risk gating, and evidence collection queue for publication and anchor readiness.</p>
      </section>
      {adminVoiceEnabled() ? <AdminVoiceAssistant route="/admin/ait/claims" totalItems={claims.length + evidence.length} statuses={[{ label: 'Claims', count: claims.length }, { label: 'Evidence', count: evidence.length }]} /> : null}
      <ReviewQueuePanel title="Claim Review Queue" description="Pending and completed claim classifications with risk badges and suggested action." items={claims} role={session.role} />
      <ReviewQueuePanel title="Evidence Requests" description="Evidence checklists created by the review engine for gated claims." items={evidence} role={session.role} />
    </div>
  );
}