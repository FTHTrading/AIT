import { NextResponse } from 'next/server';
import { requireAdminApiAccess } from '@/lib/ait/access';
import { aitRepository } from '@/lib/ait/repository';

function readNotes(value: unknown) {
  return Array.isArray(value) ? value.filter((item: unknown): item is string => typeof item === 'string') : [];
}

export async function POST(req: Request) {
  const session = await requireAdminApiAccess(req, ['ADMIN']);

  if (session instanceof NextResponse) {
    return session;
  }

  const body = await req.json().catch(() => ({}));
  const reviewId = typeof body.reviewId === 'string' ? body.reviewId : `review-${Date.now()}`;
  const createdAt = new Date().toISOString();

  const review = {
    id: reviewId,
    reviewId,
    entityType: typeof body.entityType === 'string' ? body.entityType : 'document',
    entityId: typeof body.entityId === 'string' ? body.entityId : 'unknown',
    createdAt,
    updatedAt: createdAt,
    reviewStatus: typeof body.reviewStatus === 'string' ? body.reviewStatus : 'PENDING_REVIEW',
    visibility: typeof body.visibility === 'string' ? body.visibility : undefined,
    riskLevel: typeof body.riskLevel === 'string' ? body.riskLevel : undefined,
    proofHash: typeof body.proofHash === 'string' ? body.proofHash : undefined,
    recommendedAction: typeof body.recommendedAction === 'string' ? body.recommendedAction : 'Review manually.',
    actionLabel: typeof body.actionLabel === 'string' ? body.actionLabel : 'approve',
    notes: readNotes(body.notes),
  };

  const saved = await aitRepository.saveAdminReview(review);

  await aitRepository.saveAuditEvent({
    auditEventId: `audit-create-${reviewId}`,
    actorId: session.username,
    actorRole: session.role,
    entityType: review.entityType,
    entityId: review.entityId,
    action: 'CREATE_REVIEW',
    nextStatus: review.reviewStatus,
    notes: review.notes,
    metadata: { route: '/api/admin/ait/reviews/create' },
    createdAt,
  });

  return NextResponse.json({ ok: true, route: '/api/admin/ait/reviews/create', review: saved });
}