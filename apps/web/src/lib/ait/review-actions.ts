import type { AdminRole, AitAdminReview, ReviewStatus } from './types';

export type ReviewAction =
  | 'APPROVE'
  | 'REJECT'
  | 'REQUEST_LEGAL_REVIEW'
  | 'REQUEST_MEDICAL_REVIEW'
  | 'REQUEST_REGULATORY_REVIEW'
  | 'MARK_READY_FOR_ANCHOR'
  | 'MARK_ANCHORED'
  | 'ARCHIVE'
  | 'REQUEST_MORE_EVIDENCE';

export interface ReviewActionDefinition {
  action: ReviewAction;
  label: string;
  nextStatus: ReviewStatus;
  actionLabel: string;
  recommendedAction: string;
  allowedRoles: AdminRole[];
}

export const reviewActionDefinitions: Record<ReviewAction, ReviewActionDefinition> = {
  APPROVE: {
    action: 'APPROVE',
    label: 'Approve',
    nextStatus: 'APPROVED',
    actionLabel: 'mark ready for anchor',
    recommendedAction: 'Approved by reviewer. Continue to anchor or archive flow as appropriate.',
    allowedRoles: ['ADMIN', 'LEGAL_REVIEWER', 'MEDICAL_REVIEWER', 'REGULATORY_REVIEWER', 'TECHNICAL_REVIEWER'],
  },
  REJECT: {
    action: 'REJECT',
    label: 'Reject',
    nextStatus: 'REJECTED',
    actionLabel: 'archive',
    recommendedAction: 'Rejected. Preserve notes and supporting evidence trail for audit review.',
    allowedRoles: ['ADMIN', 'LEGAL_REVIEWER', 'MEDICAL_REVIEWER', 'REGULATORY_REVIEWER', 'TECHNICAL_REVIEWER'],
  },
  REQUEST_LEGAL_REVIEW: {
    action: 'REQUEST_LEGAL_REVIEW',
    label: 'Request Legal Review',
    nextStatus: 'NEEDS_LEGAL_REVIEW',
    actionLabel: 'request legal review',
    recommendedAction: 'Route the item to legal review before publication, anchoring, or investor-facing use.',
    allowedRoles: ['ADMIN', 'LEGAL_REVIEWER', 'TECHNICAL_REVIEWER', 'REGULATORY_REVIEWER'],
  },
  REQUEST_MEDICAL_REVIEW: {
    action: 'REQUEST_MEDICAL_REVIEW',
    label: 'Request Medical Review',
    nextStatus: 'NEEDS_MEDICAL_REVIEW',
    actionLabel: 'request medical review',
    recommendedAction: 'Route the item to medical review before releasing any clinical or therapeutic framing.',
    allowedRoles: ['ADMIN', 'MEDICAL_REVIEWER', 'TECHNICAL_REVIEWER'],
  },
  REQUEST_REGULATORY_REVIEW: {
    action: 'REQUEST_REGULATORY_REVIEW',
    label: 'Request Regulatory Review',
    nextStatus: 'NEEDS_REGULATORY_REVIEW',
    actionLabel: 'request regulatory review',
    recommendedAction: 'Route the item to regulatory review before any commercialization or deployment claims.',
    allowedRoles: ['ADMIN', 'REGULATORY_REVIEWER', 'LEGAL_REVIEWER', 'TECHNICAL_REVIEWER'],
  },
  MARK_READY_FOR_ANCHOR: {
    action: 'MARK_READY_FOR_ANCHOR',
    label: 'Mark Ready For Anchor',
    nextStatus: 'READY_FOR_ANCHOR',
    actionLabel: 'mark anchored',
    recommendedAction: 'Queue the item for signing or chain-specific broadcast review.',
    allowedRoles: ['ADMIN', 'TECHNICAL_REVIEWER'],
  },
  MARK_ANCHORED: {
    action: 'MARK_ANCHORED',
    label: 'Mark Anchored',
    nextStatus: 'ANCHORED',
    actionLabel: 'archive',
    recommendedAction: 'Anchored and verified. Preserve receipts, chain references, and audit notes.',
    allowedRoles: ['ADMIN', 'TECHNICAL_REVIEWER'],
  },
  ARCHIVE: {
    action: 'ARCHIVE',
    label: 'Archive',
    nextStatus: 'ARCHIVED',
    actionLabel: 'archive',
    recommendedAction: 'Archive the record while preserving immutable proof and review history.',
    allowedRoles: ['ADMIN'],
  },
  REQUEST_MORE_EVIDENCE: {
    action: 'REQUEST_MORE_EVIDENCE',
    label: 'Request More Evidence',
    nextStatus: 'PENDING_REVIEW',
    actionLabel: 'collect evidence',
    recommendedAction: 'Collect more evidence before allowing publication, anchoring, or investor access.',
    allowedRoles: ['ADMIN', 'LEGAL_REVIEWER', 'MEDICAL_REVIEWER', 'REGULATORY_REVIEWER', 'TECHNICAL_REVIEWER'],
  },
};

export const reviewActionOptions = Object.values(reviewActionDefinitions);

export function getAllowedReviewActions(role: AdminRole) {
  return reviewActionOptions.filter((definition) => definition.allowedRoles.includes(role) || role === 'ADMIN');
}

export function applyReviewAction(review: AitAdminReview, action: ReviewAction, notes: string[] = []) {
  const definition = reviewActionDefinitions[action];

  return {
    ...review,
    updatedAt: new Date().toISOString(),
    reviewStatus: definition.nextStatus,
    actionLabel: definition.actionLabel,
    recommendedAction: definition.recommendedAction,
    notes: notes.length > 0 ? notes : review.notes,
  } satisfies AitAdminReview;
}