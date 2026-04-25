import { ReviewQueuePanel } from '@/components/ait-admin/ReviewQueuePanel';
import { AdminVoiceAssistant } from '@/components/voice';
import { requireAdminPageAccess } from '@/lib/ait/access';
import { getQueueItemsByEntityType } from '@/lib/ait/admin';
import { adminVoiceEnabled } from '@/lib/voice/providers';

export const dynamic = 'force-dynamic';

export default async function AdminAITX402Page() {
  const session = await requireAdminPageAccess();
  const [challenges, receipts] = await Promise.all([
    getQueueItemsByEntityType('x402-challenge'),
    getQueueItemsByEntityType('x402-receipt'),
  ]);

  return (
    <div className="space-y-6">
      <section className="panel space-y-2">
        <h1 className="text-2xl font-bold">Admin AIT x402</h1>
        <p className="text-sm text-gray-300">Paid-route challenge, receipt, and metering history with reviewable price and route metadata.</p>
      </section>
      {adminVoiceEnabled() ? <AdminVoiceAssistant route="/admin/ait/x402" totalItems={challenges.length + receipts.length} statuses={[{ label: 'Challenges', count: challenges.length }, { label: 'Receipts', count: receipts.length }]} /> : null}
      <ReviewQueuePanel title="x402 Challenge Queue" description="Persisted pricing challenges for review before production monetization." items={challenges} role={session.role} />
      <ReviewQueuePanel title="x402 Receipt Queue" description="Saved receipt history for audit, archive, and later settlement verification." items={receipts} role={session.role} />
    </div>
  );
}