import { describe, expect, it } from 'vitest';
import type { AitAdminReview } from './types';
import { applyReviewAction } from './review-actions';

const baseReview: AitAdminReview = {
  id: 'review-1',
  reviewId: 'review-1',
  entityType: 'claim',
  entityId: 'claim-1',
  createdAt: '2026-04-25T00:00:00.000Z',
  updatedAt: '2026-04-25T00:00:00.000Z',
  reviewStatus: 'PENDING_REVIEW',
  recommendedAction: 'Review manually.',
  actionLabel: 'approve',
  notes: [],
};

describe('review actions', () => {
  it('updates admin review status for approval', () => {
    const updated = applyReviewAction(baseReview, 'APPROVE', ['approved by reviewer']);

    expect(updated.reviewStatus).toBe('APPROVED');
    expect(updated.notes).toEqual(['approved by reviewer']);
  });

  it('archives reviews', () => {
    const updated = applyReviewAction(baseReview, 'ARCHIVE');

    expect(updated.reviewStatus).toBe('ARCHIVED');
  });
});