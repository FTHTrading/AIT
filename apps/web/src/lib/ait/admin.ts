import { aitRepository } from './repository';

export interface AitAdminQueueItem {
  id: string;
  entityType: string;
  title: string;
  reviewStatus: string;
  riskLevel?: string;
  visibility?: string;
  proofHash?: string;
  createdAt: string;
  recommendedAction: string;
  actionLabel: string;
}

function hashPreview(value?: string) {
  return value ? `${value.slice(0, 12)}...${value.slice(-8)}` : undefined;
}

export async function getAdminSnapshot() {
  const [
    documentProofs,
    merkleBatches,
    anchorPayloads,
    ipfsPayloads,
    claimReviews,
    evidenceRequests,
    rwaPackages,
    x402Challenges,
    x402Receipts,
    adminReviews,
  ] = await Promise.all([
    aitRepository.listDocumentProofs(),
    aitRepository.listMerkleBatches(),
    aitRepository.listAnchorPayloads(),
    aitRepository.listIpfsPayloads(),
    aitRepository.listClaimReviews(),
    aitRepository.listEvidenceRequests(),
    aitRepository.listRwaPackages(),
    aitRepository.listX402Challenges(),
    aitRepository.listX402Receipts(),
    aitRepository.listAdminReviews(),
  ]);

  return {
    documentProofs,
    merkleBatches,
    anchorPayloads,
    ipfsPayloads,
    claimReviews,
    evidenceRequests,
    rwaPackages,
    x402Challenges,
    x402Receipts,
    adminReviews,
  };
}

export async function getAdminQueueItems(): Promise<AitAdminQueueItem[]> {
  const snapshot = await getAdminSnapshot();

  return snapshot.adminReviews
    .map((review) => ({
      id: review.reviewId,
      entityType: review.entityType,
      title: `${review.entityType.toUpperCase()} ${review.entityId}`,
      reviewStatus: review.reviewStatus,
      riskLevel: review.riskLevel,
      visibility: review.visibility,
      proofHash: hashPreview(review.proofHash),
      createdAt: review.createdAt,
      recommendedAction: review.recommendedAction,
      actionLabel: review.actionLabel,
    }))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getQueueItemsByEntityType(entityType: AitAdminQueueItem['entityType']) {
  const items = await getAdminQueueItems();
  return items.filter((item) => item.entityType === entityType);
}