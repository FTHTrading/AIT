import { NextResponse } from 'next/server';
import { requireAdminApiAccess } from '@/lib/ait/access';
import { aitRepository } from '@/lib/ait/repository';
import { applyReviewAction, reviewActionDefinitions, type ReviewAction } from '@/lib/ait/review-actions';

function readNotes(value: unknown) {
  return Array.isArray(value) ? value.filter((item: unknown): item is string => typeof item === 'string') : [];
}

export async function POST(req: Request) {
  const session = await requireAdminApiAccess(req, ['ADMIN', 'LEGAL_REVIEWER', 'MEDICAL_REVIEWER', 'REGULATORY_REVIEWER', 'TECHNICAL_REVIEWER']);

  if (session instanceof NextResponse) {
    return session;
  }

  const body = await req.json().catch(() => ({}));

  if (typeof body.reviewId !== 'string') {
    return NextResponse.json({ ok: false, error: 'reviewId is required' }, { status: 400 });
  }

  const reviews = await aitRepository.listAdminReviews();
  const existing = reviews.find((review) => review.reviewId === body.reviewId);

  if (!existing) {
    return NextResponse.json({ ok: false, error: 'review not found' }, { status: 404 });
  }

  const requestedAction = typeof body.action === 'string' ? (body.action as ReviewAction) : null;

  if (requestedAction && !(requestedAction in reviewActionDefinitions)) {
    return NextResponse.json({ ok: false, error: 'invalid review action' }, { status: 400 });
  }

  if (requestedAction) {
    const definition = reviewActionDefinitions[requestedAction];

    if (!definition.allowedRoles.includes(session.role) && session.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, error: 'role cannot perform that review action' }, { status: 403 });
    }
  }

  const notes = Array.isArray(body.notes) ? readNotes(body.notes) : existing.notes;
  const updated = {
    ...(requestedAction ? applyReviewAction(existing, requestedAction, notes) : existing),
    updatedAt: new Date().toISOString(),
    reviewStatus: typeof body.reviewStatus === 'string' ? body.reviewStatus : requestedAction ? reviewActionDefinitions[requestedAction].nextStatus : existing.reviewStatus,
    recommendedAction:
      typeof body.recommendedAction === 'string'
        ? body.recommendedAction
        : requestedAction
        ? reviewActionDefinitions[requestedAction].recommendedAction
        : existing.recommendedAction,
    actionLabel:
      typeof body.actionLabel === 'string'
        ? body.actionLabel
        : requestedAction
        ? reviewActionDefinitions[requestedAction].actionLabel
        : existing.actionLabel,
    notes,
  };

  const saved = await aitRepository.saveAdminReview(updated);

  await aitRepository.saveAuditEvent({
    auditEventId: `audit-update-${saved.reviewId}-${Date.now()}`,
    actorId: session.username,
    actorRole: session.role,
    entityType: saved.entityType,
    entityId: saved.entityId,
    action: typeof body.action === 'string' ? body.action : 'UPDATE_REVIEW',
    previousStatus: existing.reviewStatus,
    nextStatus: saved.reviewStatus,
    notes: saved.notes,
    metadata: { route: '/api/admin/ait/reviews/update' },
    createdAt: saved.updatedAt,
  });

  return NextResponse.json({ ok: true, route: '/api/admin/ait/reviews/update', review: saved });
}