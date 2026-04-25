import { ReviewQueuePanel } from '@/components/ait-admin/ReviewQueuePanel';
import { AdminVoiceAssistant } from '@/components/voice';
import { getAdminQueueItems } from '@/lib/ait/admin';
import { requireAdminPageAccess } from '@/lib/ait/access';
import { adminVoiceEnabled } from '@/lib/voice/providers';

export const dynamic = 'force-dynamic';

export default async function AdminAITReviewsPage() {
  const session = await requireAdminPageAccess();
  const items = await getAdminQueueItems();

  return (
    <div className="space-y-6">
      <section className="panel space-y-2">
        <h1 className="text-2xl font-bold">Admin AIT Reviews</h1>
        <p className="text-sm text-gray-300">Unified review queue across proofs, claims, anchors, RWA packages, and x402 records.</p>
      </section>
      {adminVoiceEnabled() ? <AdminVoiceAssistant route="/admin/ait/reviews" totalItems={items.length} statuses={[{ label: 'PENDING', count: items.filter((item) => item.reviewStatus === 'PENDING_REVIEW').length }]} /> : null}
      <ReviewQueuePanel title="Unified Review Queue" description="Pending items, visibility class, risk posture, proof previews, and role-gated review actions." items={items} role={session.role} />
    </div>
  );
}