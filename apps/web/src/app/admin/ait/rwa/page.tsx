import { ReviewQueuePanel } from '@/components/ait-admin/ReviewQueuePanel';
import { AdminVoiceAssistant } from '@/components/voice';
import { requireAdminPageAccess } from '@/lib/ait/access';
import { getQueueItemsByEntityType } from '@/lib/ait/admin';
import { adminVoiceEnabled } from '@/lib/voice/providers';

export const dynamic = 'force-dynamic';

export default async function AdminAITRwaPage() {
  const session = await requireAdminPageAccess();
  const items = await getQueueItemsByEntityType('rwa');

  return (
    <div className="space-y-6">
      <section className="panel space-y-2">
        <h1 className="text-2xl font-bold">Admin AIT RWA</h1>
        <p className="text-sm text-gray-300">Legal-review-gated package queue for IP rights, revenue rights, center structures, and protocol usage rights.</p>
      </section>
      {adminVoiceEnabled() ? <AdminVoiceAssistant route="/admin/ait/rwa" totalItems={items.length} statuses={[{ label: 'RWA', count: items.length }]} /> : null}
      <ReviewQueuePanel title="RWA Package Queue" description="Persisted package metadata with disclosure and legal review status." items={items} role={session.role} />
    </div>
  );
}