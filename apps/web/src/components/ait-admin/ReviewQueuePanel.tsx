import type { AitAdminQueueItem } from '@/lib/ait/admin';
import type { AdminRole } from '@/lib/ait/types';
import { ReviewActionForm } from './ReviewActionForm';

function statusClass(status: string) {
  switch (status) {
    case 'APPROVED':
    case 'ANCHORED':
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
    case 'REJECTED':
      return 'border-red-500/40 bg-red-500/10 text-red-300';
    case 'READY_FOR_ANCHOR':
      return 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300';
    case 'NEEDS_LEGAL_REVIEW':
    case 'NEEDS_MEDICAL_REVIEW':
    case 'NEEDS_REGULATORY_REVIEW':
      return 'border-amber-500/40 bg-amber-500/10 text-amber-200';
    default:
      return 'border-gray-700 bg-gray-900/70 text-gray-300';
  }
}

function riskClass(risk?: string) {
  switch (risk) {
    case 'critical':
      return 'text-red-300';
    case 'high':
      return 'text-orange-300';
    case 'medium':
      return 'text-amber-200';
    case 'low':
      return 'text-emerald-300';
    default:
      return 'text-gray-400';
  }
}

export function ReviewQueuePanel({ title, description, items, role }: { title: string; description: string; items: AitAdminQueueItem[]; role: AdminRole }) {
  return (
    <section className="panel space-y-4">
      <div className="space-y-2">
        <h2 className="panel-title">{title}</h2>
        <p className="text-sm text-gray-300">{description}</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded border border-dashed border-gray-800 px-4 py-6 text-sm text-gray-500">
          No persisted items yet for this queue.
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded border border-gray-800 bg-black/20 p-4 text-sm text-gray-300">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-cyan-300">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.entityType}</div>
                </div>
                <span className={`rounded border px-2 py-1 text-[11px] uppercase tracking-wide ${statusClass(item.reviewStatus)}`}>
                  {item.reviewStatus}
                </span>
              </div>

              <div className="mt-3 grid gap-2 text-xs text-gray-400 md:grid-cols-2">
                <div>
                  <span className="text-gray-500">Visibility:</span> {item.visibility ?? 'n/a'}
                </div>
                <div>
                  <span className="text-gray-500">Risk:</span>{' '}
                  <span className={riskClass(item.riskLevel)}>{item.riskLevel ?? 'n/a'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Proof:</span> {item.proofHash ?? 'n/a'}
                </div>
                <div>
                  <span className="text-gray-500">Created:</span> {item.createdAt.slice(0, 10)}
                </div>
              </div>

              <div className="mt-3 rounded border border-gray-800 bg-gray-950/70 p-3 text-xs text-gray-300">
                <div className="text-gray-500">Recommended action</div>
                <div className="mt-1">{item.recommendedAction}</div>
              </div>

              <ReviewActionForm reviewId={item.id} role={role} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}