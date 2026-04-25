import type {
  AitAdminEntityType,
  AitAdminReview,
  AitAnchorPayloadRecord,
  AitClaimReviewRecord,
  AitDocumentProofRecord,
  AitEvidenceRequestRecord,
  AitIpfsPayloadRecord,
  AitMerkleBatchRecord,
  AitRwaPackageRecord,
  AitX402ChallengeRecord,
  AitX402ReceiptRecord,
  AnchorPayload,
  ClaimReview,
  DocumentProofManifest,
  MerkleProof,
  ReviewStatus,
  RwaPackage,
  X402Challenge,
  X402Receipt,
} from './types';
import { aitRepository } from './repository';

function nowIso() {
  return new Date().toISOString();
}

function createAdminReview(input: {
  reviewId: string;
  entityType: AitAdminEntityType;
  entityId: string;
  reviewStatus: ReviewStatus;
  visibility?: AitAdminReview['visibility'];
  riskLevel?: AitAdminReview['riskLevel'];
  proofHash?: string;
  recommendedAction: string;
  actionLabel: string;
  notes?: string[];
  createdAt?: string;
}): AitAdminReview {
  const timestamp = input.createdAt ?? nowIso();

  return {
    id: input.reviewId,
    reviewId: input.reviewId,
    entityType: input.entityType,
    entityId: input.entityId,
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewStatus: input.reviewStatus,
    visibility: input.visibility,
    riskLevel: input.riskLevel,
    proofHash: input.proofHash,
    recommendedAction: input.recommendedAction,
    actionLabel: input.actionLabel,
    notes: input.notes ?? [],
  };
}

export async function persistDocumentProof(manifest: DocumentProofManifest, encryptedPayloadRef?: string | null) {
  const timestamp = nowIso();
  const record: AitDocumentProofRecord = {
    id: manifest.documentId,
    documentId: manifest.documentId,
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewStatus: manifest.visibility === 'public' ? 'READY_FOR_ANCHOR' : 'PENDING_REVIEW',
    visibility: manifest.visibility,
    proofHash: manifest.sha256,
    recommendedAction: manifest.visibility === 'public' ? 'Batch for Merkle and anchor review.' : 'Confirm restricted storage and reviewer assignment.',
    manifest,
    encryptedPayloadRef: encryptedPayloadRef ?? null,
  };

  await aitRepository.saveDocumentProof(record);
  await aitRepository.saveAdminReview(
    createAdminReview({
      reviewId: `review-document-${manifest.documentId}`,
      entityType: 'document',
      entityId: manifest.documentId,
      reviewStatus: record.reviewStatus,
      visibility: manifest.visibility,
      proofHash: manifest.sha256,
      recommendedAction: record.recommendedAction,
      actionLabel: manifest.visibility === 'public' ? 'mark ready for anchor' : 'request legal review',
      notes: manifest.proofManifest.notes,
      createdAt: timestamp,
    }),
  );

  return record;
}

export async function persistMerkleBatch(batchId: string, merkleProof: MerkleProof, documentIds: string[]) {
  const timestamp = nowIso();
  const record: AitMerkleBatchRecord = {
    id: batchId,
    batchId,
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewStatus: 'READY_FOR_ANCHOR',
    proofHash: merkleProof.root,
    recommendedAction: 'Prepare unsigned anchor payloads for review and signing.',
    merkleProof,
    documentIds,
  };

  await aitRepository.saveMerkleBatch(record);
  await aitRepository.saveAdminReview(
    createAdminReview({
      reviewId: `review-merkle-${batchId}`,
      entityType: 'merkle',
      entityId: batchId,
      reviewStatus: 'READY_FOR_ANCHOR',
      proofHash: merkleProof.root,
      recommendedAction: record.recommendedAction,
      actionLabel: 'approve batch',
      createdAt: timestamp,
      notes: [`${documentIds.length} document proof(s) included in batch.`],
    }),
  );

  return record;
}

export async function persistAnchorPayload(anchorId: string, anchorPayload: AnchorPayload, batchId?: string | null) {
  const timestamp = nowIso();
  const record: AitAnchorPayloadRecord = {
    id: anchorId,
    anchorId,
    chain: anchorPayload.chain,
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewStatus: 'READY_FOR_ANCHOR',
    proofHash: anchorPayload.merkleRoot,
    recommendedAction: 'Review unsigned payload and signing readiness.',
    anchorPayload,
    batchId: batchId ?? null,
  };

  await aitRepository.saveAnchorPayload(record);
  await aitRepository.saveAdminReview(
    createAdminReview({
      reviewId: `review-anchor-${anchorId}`,
      entityType: 'anchor',
      entityId: anchorId,
      reviewStatus: 'READY_FOR_ANCHOR',
      proofHash: anchorPayload.merkleRoot,
      recommendedAction: record.recommendedAction,
      actionLabel: 'mark anchored',
      createdAt: timestamp,
      notes: [`Unsigned ${anchorPayload.chain} payload generated for ${anchorPayload.network}.`],
    }),
  );

  return record;
}

export async function persistIpfsPayload(input: {
  ipfsId: string;
  documentId: string;
  visibility: AitIpfsPayloadRecord['visibility'];
  cid: string | null;
  placeholder: boolean;
  payload: Record<string, unknown> | null;
  encryptedPayloadRef?: string | null;
  proofHash?: string;
  reviewStatus: ReviewStatus;
  recommendedAction: string;
}) {
  const timestamp = nowIso();
  const record: AitIpfsPayloadRecord = {
    id: input.ipfsId,
    ipfsId: input.ipfsId,
    documentId: input.documentId,
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewStatus: input.reviewStatus,
    visibility: input.visibility,
    proofHash: input.proofHash,
    recommendedAction: input.recommendedAction,
    cid: input.cid,
    placeholder: input.placeholder,
    encryptedPayloadRef: input.encryptedPayloadRef ?? null,
    payload: input.payload,
  };

  await aitRepository.saveIpfsPayload(record);
  await aitRepository.saveAdminReview(
    createAdminReview({
      reviewId: `review-ipfs-${input.ipfsId}`,
      entityType: 'ipfs',
      entityId: input.ipfsId,
      reviewStatus: input.reviewStatus,
      visibility: input.visibility,
      proofHash: input.proofHash,
      recommendedAction: input.recommendedAction,
      actionLabel: input.reviewStatus === 'PENDING_REVIEW' ? 'request encrypted payload' : 'approve CID',
      createdAt: timestamp,
      notes: [input.placeholder ? 'Placeholder CID stored because no IPFS environment is configured.' : 'Ready for real IPFS upload.'],
    }),
  );

  return record;
}

export async function persistClaimReview(review: ClaimReview) {
  const timestamp = nowIso();
  const record: AitClaimReviewRecord = {
    id: review.claimId,
    claimId: review.claimId,
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewStatus: review.reviewStatus,
    visibility: review.publicAllowed ? 'public' : 'restricted',
    riskLevel: review.riskLevel,
    proofHash: review.claimId,
    recommendedAction: review.publicAllowed ? 'Confirm wording and evidence, then mark ready for anchor.' : 'Route through gated review and evidence collection.',
    review,
  };

  await aitRepository.saveClaimReview(record);
  await aitRepository.saveAdminReview(
    createAdminReview({
      reviewId: `review-claim-${review.claimId}`,
      entityType: 'claim',
      entityId: review.claimId,
      reviewStatus: review.reviewStatus,
      visibility: record.visibility,
      riskLevel: review.riskLevel,
      proofHash: review.claimId,
      recommendedAction: record.recommendedAction,
      actionLabel: review.publicAllowed ? 'approve claim' : 'request legal review',
      createdAt: timestamp,
      notes: review.notes,
    }),
  );

  return record;
}

export async function persistEvidenceRequest(input: { claimId: string; evidenceChecklist: string[]; disclaimer: string; reviewStatus: ReviewStatus }) {
  const timestamp = nowIso();
  const evidenceRequestId = `evidence-${input.claimId}`;
  const record: AitEvidenceRequestRecord = {
    id: evidenceRequestId,
    evidenceRequestId,
    claimId: input.claimId,
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewStatus: input.reviewStatus,
    visibility: 'restricted',
    proofHash: input.claimId,
    recommendedAction: 'Collect listed evidence before publication or anchor approval.',
    evidenceChecklist: input.evidenceChecklist,
    disclaimer: input.disclaimer,
  };

  await aitRepository.saveEvidenceRequest(record);
  await aitRepository.saveAdminReview(
    createAdminReview({
      reviewId: `review-evidence-${input.claimId}`,
      entityType: 'evidence',
      entityId: evidenceRequestId,
      reviewStatus: input.reviewStatus,
      visibility: 'restricted',
      proofHash: input.claimId,
      recommendedAction: record.recommendedAction,
      actionLabel: 'collect evidence',
      createdAt: timestamp,
      notes: input.evidenceChecklist,
    }),
  );

  return record;
}

export async function persistRwaPackage(rwaPackage: RwaPackage) {
  const timestamp = nowIso();
  const record: AitRwaPackageRecord = {
    id: rwaPackage.packageId,
    packageId: rwaPackage.packageId,
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewStatus: rwaPackage.reviewStatus,
    visibility: 'restricted',
    proofHash: rwaPackage.packageId,
    recommendedAction: 'Legal and regulatory review required before investor-facing use.',
    rwaPackage,
  };

  await aitRepository.saveRwaPackage(record);
  await aitRepository.saveAdminReview(
    createAdminReview({
      reviewId: `review-rwa-${rwaPackage.packageId}`,
      entityType: 'rwa',
      entityId: rwaPackage.packageId,
      reviewStatus: rwaPackage.reviewStatus,
      visibility: 'restricted',
      proofHash: rwaPackage.packageId,
      recommendedAction: record.recommendedAction,
      actionLabel: 'request legal review',
      createdAt: timestamp,
      notes: rwaPackage.requiredDisclosures,
    }),
  );

  return record;
}

export async function persistX402Challenge(challenge: X402Challenge) {
  const timestamp = nowIso();
  const record: AitX402ChallengeRecord = {
    id: challenge.challengeId,
    challengeId: challenge.challengeId,
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewStatus: 'PENDING_REVIEW',
    proofHash: challenge.nonce,
    recommendedAction: 'Review paid route, amount, and expiration before promoting.',
    challenge,
  };

  await aitRepository.saveX402Challenge(record);
  await aitRepository.saveAdminReview(
    createAdminReview({
      reviewId: `review-x402-challenge-${challenge.challengeId}`,
      entityType: 'x402-challenge',
      entityId: challenge.challengeId,
      reviewStatus: 'PENDING_REVIEW',
      proofHash: challenge.nonce,
      recommendedAction: record.recommendedAction,
      actionLabel: 'approve route pricing',
      createdAt: timestamp,
      notes: [`Route ${challenge.route}`, `Asset ${challenge.asset}`, `Amount ${challenge.amount}`],
    }),
  );

  return record;
}

export async function persistX402Receipt(receipt: X402Receipt) {
  const timestamp = nowIso();
  const record: AitX402ReceiptRecord = {
    id: receipt.receiptId,
    receiptId: receipt.receiptId,
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewStatus: 'APPROVED',
    proofHash: receipt.challengeId,
    recommendedAction: 'Archive settled receipt or trace to real payment verification later.',
    receipt,
  };

  await aitRepository.saveX402Receipt(record);
  await aitRepository.saveAdminReview(
    createAdminReview({
      reviewId: `review-x402-receipt-${receipt.receiptId}`,
      entityType: 'x402-receipt',
      entityId: receipt.receiptId,
      reviewStatus: 'APPROVED',
      proofHash: receipt.challengeId,
      recommendedAction: record.recommendedAction,
      actionLabel: 'archive receipt',
      createdAt: timestamp,
      notes: [`Route ${receipt.route}`, `Amount ${receipt.amount} ${receipt.asset}`],
    }),
  );

  return record;
}