import { ReviewQueuePanel } from '@/components/ait-admin/ReviewQueuePanel';
import { AdminVoiceAssistant } from '@/components/voice';
import { requireAdminPageAccess } from '@/lib/ait/access';
import { getQueueItemsByEntityType } from '@/lib/ait/admin';
import { adminVoiceEnabled } from '@/lib/voice/providers';

export const dynamic = 'force-dynamic';

export default async function AdminAITDocumentsPage() {
  const session = await requireAdminPageAccess();
  const [documents, ipfs] = await Promise.all([
    getQueueItemsByEntityType('document'),
    getQueueItemsByEntityType('ipfs'),
  ]);

  return (
    <div className="space-y-6">
      <section className="panel space-y-2">
        <h1 className="text-2xl font-bold">Admin AIT Documents</h1>
        <p className="text-sm text-gray-300">Saved proof manifests and IPFS payload preparations with visibility controls and review state.</p>
      </section>
      {adminVoiceEnabled() ? <AdminVoiceAssistant route="/admin/ait/documents" totalItems={documents.length + ipfs.length} statuses={[{ label: 'Documents', count: documents.length }, { label: 'IPFS', count: ipfs.length }]} /> : null}
      <ReviewQueuePanel title="Document Proof Queue" description="Persisted proof manifests, hash previews, and storage recommendations." items={documents} role={session.role} />
      <ReviewQueuePanel title="IPFS Payload Queue" description="Public-safe payloads and restricted payload readiness with encryption enforcement." items={ipfs} role={session.role} />
    </div>
  );
}