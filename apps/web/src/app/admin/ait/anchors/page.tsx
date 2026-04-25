import { ReviewQueuePanel } from '@/components/ait-admin/ReviewQueuePanel';
import { AdminVoiceAssistant } from '@/components/voice';
import { requireAdminPageAccess } from '@/lib/ait/access';
import { getQueueItemsByEntityType } from '@/lib/ait/admin';
import { adminVoiceEnabled } from '@/lib/voice/providers';

export const dynamic = 'force-dynamic';

export default async function AdminAITAnchorsPage() {
  const session = await requireAdminPageAccess();
  const [merkle, anchors] = await Promise.all([
    getQueueItemsByEntityType('merkle'),
    getQueueItemsByEntityType('anchor'),
  ]);

  return (
    <div className="space-y-6">
      <section className="panel space-y-2">
        <h1 className="text-2xl font-bold">Admin AIT Anchors</h1>
        <p className="text-sm text-gray-300">Merkle batches and chain-specific anchor payloads waiting for signing, broadcast, or archive review.</p>
      </section>
      {adminVoiceEnabled() ? <AdminVoiceAssistant route="/admin/ait/anchors" totalItems={merkle.length + anchors.length} statuses={[{ label: 'Merkle', count: merkle.length }, { label: 'Anchor', count: anchors.length }]} /> : null}
      <ReviewQueuePanel title="Merkle Batch Queue" description="Deterministic proof batches that are ready to convert into anchor payloads." items={merkle} role={session.role} />
      <ReviewQueuePanel title="Anchor Payload Queue" description="Unsigned Polygon, XRPL, and UnyKorn L1 payloads with anchor-ready status." items={anchors} role={session.role} />
    </div>
  );
}