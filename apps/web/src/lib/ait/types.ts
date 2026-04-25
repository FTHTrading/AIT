export type VisibilityLevel = 'public' | 'restricted' | 'private';

export type AdminRole =
  | 'ADMIN'
  | 'LEGAL_REVIEWER'
  | 'MEDICAL_REVIEWER'
  | 'REGULATORY_REVIEWER'
  | 'TECHNICAL_REVIEWER'
  | 'VIEW_ONLY';

export interface AdminSession {
  username: string;
  displayName: string;
  role: AdminRole;
  issuedAt: string;
  expiresAt: string;
}

export type AitStorageBackend = 'file' | 'prisma';

export type ReviewStatus =
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_LEGAL_REVIEW'
  | 'NEEDS_MEDICAL_REVIEW'
  | 'NEEDS_REGULATORY_REVIEW'
  | 'READY_FOR_ANCHOR'
  | 'ANCHORED'
  | 'ARCHIVED';

export type ClaimCategory = 'medical' | 'technical' | 'financial' | 'regulatory' | 'operational';

export type ClaimRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type AnchorChain = 'polygon' | 'xrpl' | 'unykorn-l1';

export type RwaAssetType =
  | 'IP_LICENSE'
  | 'REVENUE_RIGHT'
  | 'EQUIPMENT_PACKAGE'
  | 'TREATMENT_CENTER_SPV'
  | 'DOCUMENTED_CLAIM'
  | 'PROTOCOL_USAGE_RIGHT';

export interface DocumentProofManifest {
  documentId: string;
  sha256: string;
  generatedAt: string;
  visibility: VisibilityLevel;
  recommendedStoragePath: string;
  proofManifestVersion: '1.0';
  sourceType: 'text' | 'metadata';
  publicAllowed: boolean;
  encryptedRequired: boolean;
  metadata: {
    title?: string;
    fileName?: string;
    mimeType?: string;
    sizeBytes?: number;
  };
  proofManifest: {
    algorithm: 'sha256';
    hash: string;
    visibility: VisibilityLevel;
    recommendedStoragePath: string;
    publicCid: string | null;
    encryptedCid: string | null;
    notes: string[];
  };
}

export interface MerkleProofNode {
  position: 'left' | 'right';
  hash: string;
}

export interface MerkleLeafProof {
  leaf: string;
  index: number;
  proof: MerkleProofNode[];
  verifies: boolean;
}

export interface MerkleProof {
  root: string;
  leaves: string[];
  sortedLeaves: string[];
  treeDepth: number;
  proofs: MerkleLeafProof[];
  timestamp: string;
  verificationHelper: {
    algorithm: 'sha256';
    leafOrdering: 'lexicographic-ascending';
    pairingRule: 'left-right-concatenation';
    oddLeafRule: 'duplicate-last-leaf';
  };
}

export interface AnchorPayload {
  chain: AnchorChain;
  network: string;
  moduleId: string;
  eventType: string;
  merkleRoot: string;
  memo: string;
  dataField: string;
  status: 'MOCK_ONLY' | 'READY_FOR_SIGNING' | 'BROADCAST_DISABLED' | 'BROADCAST_SENT' | 'VERIFIED';
  unsigned: boolean;
  broadcastEnabled: boolean;
  generatedAt: string;
}

export interface ClaimReview {
  claimId: string;
  claimText: string;
  category: ClaimCategory;
  riskLevel: ClaimRiskLevel;
  publicAllowed: boolean;
  requiredDisclaimer: string;
  requiredEvidenceChecklist: string[];
  reviewStatus: ReviewStatus;
  recommendedStoragePath: string;
  notes: string[];
}

export interface RwaPackage {
  packageId: string;
  assetType: RwaAssetType;
  title: string;
  moduleId: string;
  legalStatus: 'LEGAL_REVIEW_REQUIRED';
  liveTokenSaleEnabled: false;
  rightsSummary: string[];
  requiredDisclosures: string[];
  reviewStatus: ReviewStatus;
  metadata: Record<string, unknown>;
}

export interface X402Challenge {
  challengeId: string;
  route: string;
  amount: number;
  asset: string;
  nonce: string;
  expiresAt: string;
  status: 'PENDING' | 'VERIFIED' | 'EXPIRED';
}

export interface X402Receipt {
  receiptId: string;
  challengeId: string;
  route: string;
  amount: number;
  asset: string;
  status: 'ISSUED' | 'REJECTED';
  verifiedAt: string;
  meter: {
    units: number;
    unitType: string;
  };
}

export type AitAdminEntityType =
  | 'document'
  | 'merkle'
  | 'anchor'
  | 'ipfs'
  | 'claim'
  | 'evidence'
  | 'rwa'
  | 'x402-challenge'
  | 'x402-receipt';

export interface AitStoredRecordBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  reviewStatus: ReviewStatus;
  visibility?: VisibilityLevel;
  riskLevel?: ClaimRiskLevel;
  proofHash?: string;
  recommendedAction: string;
}

export interface AitDocumentProofRecord extends AitStoredRecordBase {
  documentId: string;
  manifest: DocumentProofManifest;
  encryptedPayloadRef: string | null;
}

export interface AitMerkleBatchRecord extends AitStoredRecordBase {
  batchId: string;
  merkleProof: MerkleProof;
  documentIds: string[];
}

export interface AitAnchorPayloadRecord extends AitStoredRecordBase {
  anchorId: string;
  chain: AnchorChain;
  anchorPayload: AnchorPayload;
  batchId: string | null;
}

export interface AitIpfsPayloadRecord extends AitStoredRecordBase {
  ipfsId: string;
  documentId: string;
  cid: string | null;
  placeholder: boolean;
  encryptedPayloadRef: string | null;
  payload: Record<string, unknown> | null;
}

export interface AitClaimReviewRecord extends AitStoredRecordBase {
  claimId: string;
  review: ClaimReview;
}

export interface AitEvidenceRequestRecord extends AitStoredRecordBase {
  evidenceRequestId: string;
  claimId: string;
  evidenceChecklist: string[];
  disclaimer: string;
}

export interface AitRwaPackageRecord extends AitStoredRecordBase {
  packageId: string;
  rwaPackage: RwaPackage;
}

export interface AitX402ChallengeRecord extends AitStoredRecordBase {
  challengeId: string;
  challenge: X402Challenge;
}

export interface AitX402ReceiptRecord extends AitStoredRecordBase {
  receiptId: string;
  receipt: X402Receipt;
}

export interface AitAdminReview extends AitStoredRecordBase {
  reviewId: string;
  entityType: AitAdminEntityType;
  entityId: string;
  notes: string[];
  actionLabel: string;
}

export interface AitAuditEvent {
  auditEventId: string;
  actorId: string;
  actorRole: AdminRole;
  entityType: AitAdminEntityType | 'auth' | 'x402-meter';
  entityId: string;
  action: string;
  previousStatus?: ReviewStatus;
  nextStatus?: ReviewStatus;
  notes: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AitRouteMeterRecord {
  meterId: string;
  challengeId: string | null;
  route: string;
  amount: number;
  asset: string;
  units: number;
  unitType: string;
  estimatedTotal: number;
  status: 'METERED' | 'SETTLED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface AitPersistenceStore {
  documentProofs: AitDocumentProofRecord[];
  merkleBatches: AitMerkleBatchRecord[];
  anchorPayloads: AitAnchorPayloadRecord[];
  ipfsPayloads: AitIpfsPayloadRecord[];
  claimReviews: AitClaimReviewRecord[];
  evidenceRequests: AitEvidenceRequestRecord[];
  rwaPackages: AitRwaPackageRecord[];
  x402Challenges: AitX402ChallengeRecord[];
  x402Receipts: AitX402ReceiptRecord[];
  adminReviews: AitAdminReview[];
  auditEvents: AitAuditEvent[];
  routeMeterRecords: AitRouteMeterRecord[];
}