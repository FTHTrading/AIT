import { createHash, randomUUID } from 'node:crypto';
import type {
  AnchorChain,
  AnchorPayload,
  ClaimCategory,
  ClaimReview,
  ClaimRiskLevel,
  DocumentProofManifest,
  MerkleProof,
  MerkleProofNode,
  ReviewStatus,
  RwaAssetType,
  RwaPackage,
  VisibilityLevel,
  X402Challenge,
  X402Receipt,
} from './types';

type JsonRecord = Record<string, unknown>;

type DocumentProofInput = {
  content?: string;
  metadata?: JsonRecord;
  title?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  visibility?: string;
  publicCid?: string | null;
  encryptedCid?: string | null;
};

type AnchorPayloadInput = {
  chain: AnchorChain;
  merkleRoot: string;
  moduleId?: string;
  eventType?: string;
  network?: string;
};

type ClaimReviewInput = {
  claimText: string;
  requestedStatus?: string;
};

type RwaPackageInput = {
  assetType?: RwaAssetType;
  title?: string;
  moduleId?: string;
  metadata?: JsonRecord;
};

type X402ChallengeInput = {
  route?: string;
  amount?: number;
  asset?: string;
  ttlSeconds?: number;
};

const hashHexPattern = /^[a-f0-9]{64}$/i;

const claimKeywordMap: Record<ClaimCategory, string[]> = {
  medical: ['medical', 'patient', 'therapy', 'clinical', 'treat', 'cure', 'diagnose', 'disease'],
  technical: ['protocol', 'engine', 'mesh', 'runtime', 'schema', 'encryption', 'merkle', 'hash'],
  financial: ['revenue', 'yield', 'roi', 'investor', 'profit', 'cash flow', 'royalty'],
  regulatory: ['regulatory', 'fda', 'sec', 'compliance', 'licensed', 'approval'],
  operational: ['operations', 'workflow', 'staffing', 'center', 'deployment', 'runbook'],
};

const categoryDisclaimers: Record<ClaimCategory, string> = {
  medical: 'Not a medical claim for public release. Requires clinical evidence, counsel review, and appropriate medical oversight.',
  technical: 'Technical descriptions must remain implementation-specific and must not imply efficacy without validated evidence.',
  financial: 'Financial statements are informational only and require legal review before any investor-facing use.',
  regulatory: 'Regulatory statements require source-backed review and must not imply approval or clearance unless documented.',
  operational: 'Operational statements describe internal process intent only and should be validated against deployment evidence.',
};

const categoryEvidence: Record<ClaimCategory, string[]> = {
  medical: ['clinical protocol', 'study design', 'outcome data', 'medical reviewer signoff', 'legal disclaimer'],
  technical: ['architecture spec', 'test logs', 'security review', 'benchmark evidence'],
  financial: ['rights schedule', 'waterfall model', 'counsel review', 'source accounting package'],
  regulatory: ['source citation', 'review memo', 'jurisdiction notes', 'regulatory counsel signoff'],
  operational: ['runbook', 'operator checklist', 'deployment record', 'incident posture'],
};

const rwaRightsMap: Record<RwaAssetType, string[]> = {
  IP_LICENSE: ['license scope', 'territory', 'duration', 'permitted field of use'],
  REVENUE_RIGHT: ['revenue waterfall', 'audit rights', 'reporting cadence', 'termination conditions'],
  EQUIPMENT_PACKAGE: ['equipment schedule', 'maintenance obligations', 'custody chain'],
  TREATMENT_CENTER_SPV: ['entity charter', 'operating agreement', 'site control rights'],
  DOCUMENTED_CLAIM: ['claim lineage', 'evidence bundle reference', 'publication controls'],
  PROTOCOL_USAGE_RIGHT: ['runtime allowance', 'module usage rights', 'metering schedule'],
};

const rwaDisclosures = [
  'LEGAL_REVIEW_REQUIRED',
  'No live token sale logic is enabled.',
  'This package is metadata-only and not a securities offer.',
];

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const record = value as JsonRecord;
    const keys = Object.keys(record).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(',')}}`;
  }

  return JSON.stringify(value ?? null);
}

function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'document';
}

function normalizeVisibility(value?: string): VisibilityLevel {
  if (value === 'public' || value === 'restricted' || value === 'private') {
    return value;
  }

  return 'restricted';
}

function normalizeReviewStatus(value?: string): ReviewStatus | undefined {
  switch (value) {
    case 'PENDING_REVIEW':
    case 'APPROVED':
    case 'REJECTED':
    case 'NEEDS_LEGAL_REVIEW':
    case 'NEEDS_MEDICAL_REVIEW':
    case 'NEEDS_REGULATORY_REVIEW':
    case 'READY_FOR_ANCHOR':
    case 'ANCHORED':
      return value;
    default:
      return undefined;
  }
}

function resolveStoragePath(documentId: string, visibility: VisibilityLevel): string {
  switch (visibility) {
    case 'public':
      return `storage/public/ipfs/${documentId}.json`;
    case 'private':
      return `storage/private/vault/${documentId}.json`;
    default:
      return `storage/restricted/encrypted/${documentId}.json`;
  }
}

function hasIpfsConfiguration(): boolean {
  return Boolean(process.env.IPFS_API_URL || process.env.PINATA_JWT || process.env.WEB3_STORAGE_TOKEN);
}

function placeholderCidFromValue(value: string): string {
  return `bafy${sha256Hex(value).slice(0, 28)}`;
}

function defaultReviewStatusForCategory(category: ClaimCategory): ReviewStatus {
  switch (category) {
    case 'medical':
      return 'NEEDS_MEDICAL_REVIEW';
    case 'financial':
      return 'NEEDS_LEGAL_REVIEW';
    case 'regulatory':
      return 'NEEDS_REGULATORY_REVIEW';
    default:
      return 'PENDING_REVIEW';
  }
}

function classifyClaimCategory(claimText: string): ClaimCategory {
  const lower = claimText.toLowerCase();

  for (const category of Object.keys(claimKeywordMap) as ClaimCategory[]) {
    if (claimKeywordMap[category].some((keyword) => lower.includes(keyword))) {
      return category;
    }
  }

  return 'operational';
}

function classifyRiskLevel(claimText: string, category: ClaimCategory): ClaimRiskLevel {
  const lower = claimText.toLowerCase();

  if ((category === 'medical' && /(cure|diagnose|treat|remission)/.test(lower)) || (category === 'financial' && /(guarantee|guaranteed|profit)/.test(lower))) {
    return 'critical';
  }

  if (category === 'medical' || category === 'financial' || category === 'regulatory') {
    return 'high';
  }

  if (category === 'technical' && /(secure|guarantee|unbreakable|proven)/.test(lower)) {
    return 'medium';
  }

  return category === 'operational' ? 'low' : 'medium';
}

function publicAllowedForClaim(category: ClaimCategory, riskLevel: ClaimRiskLevel): boolean {
  return category === 'technical' && riskLevel !== 'high' && riskLevel !== 'critical';
}

function defaultNetworkForChain(chain: AnchorChain): string {
  switch (chain) {
    case 'polygon':
      return 'polygon-amoy';
    case 'xrpl':
      return 'xrpl-testnet';
    case 'unykorn-l1':
      return 'unykorn-devnet';
  }
}

function broadcastFlagForChain(chain: AnchorChain): boolean {
  switch (chain) {
    case 'polygon':
      return process.env.ENABLE_POLYGON_BROADCAST === 'true';
    case 'xrpl':
      return process.env.ENABLE_XRPL_BROADCAST === 'true';
    case 'unykorn-l1':
      return process.env.ENABLE_UNYKORN_BROADCAST === 'true';
  }
}

function hashPair(left: string, right: string): string {
  return sha256Hex(`${left}${right}`);
}

export function buildDocumentProofManifest(input: DocumentProofInput): DocumentProofManifest {
  const visibility = normalizeVisibility(input.visibility);
  const metadata = {
    title: input.title,
    fileName: input.fileName,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
  };
  const sourceValue = typeof input.content === 'string' && input.content.length > 0 ? input.content : stableStringify(input.metadata ?? metadata);

  if (!sourceValue || sourceValue === 'null' || sourceValue === '{}') {
    throw new Error('content or metadata is required');
  }

  const sha256 = sha256Hex(sourceValue);
  const titleSeed = input.title || input.fileName || 'document';
  const documentId = `doc-${slugify(titleSeed)}-${sha256.slice(0, 12)}`;
  const recommendedStoragePath = resolveStoragePath(documentId, visibility);
  const notes = [
    'Do not expose raw KYC, private medical, private formula, private contract, or confidential investor documents.',
    visibility === 'public'
      ? 'Public storage is limited to public-safe metadata and proofs.'
      : 'Private or restricted content must remain encrypted before any off-vault storage.',
  ];

  return {
    documentId,
    sha256,
    generatedAt: new Date().toISOString(),
    visibility,
    recommendedStoragePath,
    proofManifestVersion: '1.0',
    sourceType: typeof input.content === 'string' && input.content.length > 0 ? 'text' : 'metadata',
    publicAllowed: visibility === 'public',
    encryptedRequired: visibility !== 'public',
    metadata,
    proofManifest: {
      algorithm: 'sha256',
      hash: sha256,
      visibility,
      recommendedStoragePath,
      publicCid: input.publicCid ?? null,
      encryptedCid: input.encryptedCid ?? null,
      notes,
    },
  };
}

export function verifyMerklePath(leaf: string, proof: MerkleProofNode[], root: string): boolean {
  let cursor = leaf;

  for (const step of proof) {
    cursor = step.position === 'left' ? hashPair(step.hash, cursor) : hashPair(cursor, step.hash);
  }

  return cursor === root;
}

export function buildMerkleProof(hashes: string[]): MerkleProof {
  const normalizedLeaves = hashes
    .map((hash) => hash.toLowerCase())
    .filter((hash) => hashHexPattern.test(hash))
    .sort();

  if (normalizedLeaves.length === 0) {
    throw new Error('at least one valid sha256 hash is required');
  }

  const levels: string[][] = [normalizedLeaves];

  while (levels[levels.length - 1].length > 1) {
    const previousLevel = levels[levels.length - 1];
    const nextLevel: string[] = [];

    for (let index = 0; index < previousLevel.length; index += 2) {
      const left = previousLevel[index];
      const right = previousLevel[index + 1] ?? previousLevel[index];
      nextLevel.push(hashPair(left, right));
    }

    levels.push(nextLevel);
  }

  const root = levels[levels.length - 1][0];

  return {
    root,
    leaves: hashes,
    sortedLeaves: normalizedLeaves,
    treeDepth: levels.length - 1,
    proofs: normalizedLeaves.map((leaf, index) => {
      const proof: MerkleProofNode[] = [];
      let cursorIndex = index;

      for (let levelIndex = 0; levelIndex < levels.length - 1; levelIndex += 1) {
        const level = levels[levelIndex];
        const isRightNode = cursorIndex % 2 === 1;
        const siblingIndex = isRightNode ? cursorIndex - 1 : cursorIndex + 1;
        const siblingHash = level[siblingIndex] ?? level[cursorIndex];

        proof.push({
          position: isRightNode ? 'left' : 'right',
          hash: siblingHash,
        });

        cursorIndex = Math.floor(cursorIndex / 2);
      }

      return {
        leaf,
        index,
        proof,
        verifies: verifyMerklePath(leaf, proof, root),
      };
    }),
    timestamp: new Date().toISOString(),
    verificationHelper: {
      algorithm: 'sha256',
      leafOrdering: 'lexicographic-ascending',
      pairingRule: 'left-right-concatenation',
      oddLeafRule: 'duplicate-last-leaf',
    },
  };
}

export function buildAnchorPayload(input: AnchorPayloadInput): AnchorPayload {
  const chain = input.chain;
  const network = input.network || defaultNetworkForChain(chain);
  const moduleId = input.moduleId || 'ait.biofield.v1';
  const eventType = input.eventType || 'DOCUMENT_SET_ANCHOR';
  const generatedAt = new Date().toISOString();
  const payloadBody = {
    moduleId,
    eventType,
    merkleRoot: input.merkleRoot,
    generatedAt,
  };

  return {
    chain,
    network,
    moduleId,
    eventType,
    merkleRoot: input.merkleRoot,
    memo: `${moduleId}:${eventType}:${input.merkleRoot.slice(0, 16)}`,
    dataField: stableStringify(payloadBody),
    status: broadcastFlagForChain(chain) ? 'READY_FOR_SIGNING' : 'BROADCAST_DISABLED',
    unsigned: true,
    broadcastEnabled: broadcastFlagForChain(chain),
    generatedAt,
  };
}

export function verifyAnchorPayload(input: { anchorPayload: AnchorPayload; merkleProof?: MerkleProof; leaf?: string; proofIndex?: number }) {
  const proofIndex = input.proofIndex ?? 0;
  const selectedProof = input.merkleProof?.proofs[proofIndex];
  const leaf = input.leaf || selectedProof?.leaf;
  const rootMatches = !input.merkleProof || input.anchorPayload.merkleRoot === input.merkleProof.root;
  const proofMatches = Boolean(
    input.merkleProof &&
      selectedProof &&
      leaf &&
      verifyMerklePath(leaf, selectedProof.proof, input.merkleProof.root),
  );

  return {
    verified: rootMatches && (input.merkleProof ? proofMatches : true),
    rootMatches,
    proofMatches: input.merkleProof ? proofMatches : null,
    status: rootMatches ? 'READY_FOR_SIGNING' : 'MERKLE_ROOT_MISMATCH',
  };
}

export function buildIpfsPayload(input: { manifest: DocumentProofManifest; metadata?: JsonRecord; encryptedPayload?: string }) {
  const visibility = input.manifest.visibility;

  if (visibility !== 'public' && !input.encryptedPayload) {
    return {
      ok: false,
      status: 'ENCRYPTION_REQUIRED',
      visibility,
      placeholder: false,
      cid: null,
      payload: null,
    };
  }

  const payload = visibility === 'public'
    ? {
        documentId: input.manifest.documentId,
        visibility,
        metadata: input.metadata ?? {},
        proofManifest: input.manifest.proofManifest,
      }
    : {
        documentId: input.manifest.documentId,
        visibility,
        encryptedPayload: input.encryptedPayload,
        proofManifest: input.manifest.proofManifest,
      };

  if (hasIpfsConfiguration()) {
    return {
      ok: true,
      status: 'READY_FOR_UPLOAD',
      visibility,
      placeholder: false,
      cid: null,
      payload,
    };
  }

  return {
    ok: true,
    status: 'MOCK_ONLY',
    visibility,
    placeholder: true,
    cid: placeholderCidFromValue(stableStringify(payload)),
    payload,
  };
}

export function classifyClaim(input: { claimText: string }): ClaimReview {
  const claimText = input.claimText.trim();

  if (!claimText) {
    throw new Error('claimText is required');
  }

  const category = classifyClaimCategory(claimText);
  const riskLevel = classifyRiskLevel(claimText, category);
  const publicAllowed = publicAllowedForClaim(category, riskLevel);
  const reviewStatus = publicAllowed ? 'PENDING_REVIEW' : defaultReviewStatusForCategory(category);
  const claimId = `claim-${sha256Hex(claimText).slice(0, 12)}`;

  return {
    claimId,
    claimText,
    category,
    riskLevel,
    publicAllowed,
    requiredDisclaimer: categoryDisclaimers[category],
    requiredEvidenceChecklist: categoryEvidence[category],
    reviewStatus,
    recommendedStoragePath: publicAllowed ? `claims/public/${claimId}.json` : `claims/restricted/${claimId}.json`,
    notes: [
      publicAllowed ? 'Claim may be summarized publicly after review.' : 'Claim must remain non-public until gated review is complete.',
    ],
  };
}

export function reviewClaim(input: ClaimReviewInput): ClaimReview {
  const claim = classifyClaim({ claimText: input.claimText });
  const requestedStatus = normalizeReviewStatus(input.requestedStatus);

  if (!requestedStatus) {
    return claim;
  }

  if (requestedStatus === 'REJECTED') {
    return {
      ...claim,
      reviewStatus: 'REJECTED',
      notes: [...claim.notes, 'Reviewer rejected the claim for publication or anchoring.'],
    };
  }

  if (requestedStatus === 'APPROVED' && claim.publicAllowed) {
    return {
      ...claim,
      reviewStatus: 'APPROVED',
      notes: [...claim.notes, 'Claim cleared for approved internal/public-safe use.'],
    };
  }

  if (requestedStatus === 'READY_FOR_ANCHOR' && claim.publicAllowed) {
    return {
      ...claim,
      reviewStatus: 'READY_FOR_ANCHOR',
      notes: [...claim.notes, 'Claim package is ready to join an anchor batch.'],
    };
  }

  return {
    ...claim,
    notes: [...claim.notes, `Requested status ${requestedStatus} cannot override current compliance gates.`],
  };
}

export function buildClaimEvidence(claimText: string) {
  const claim = classifyClaim({ claimText });

  return {
    claimId: claim.claimId,
    category: claim.category,
    evidenceChecklist: claim.requiredEvidenceChecklist,
    disclaimer: claim.requiredDisclaimer,
    reviewStatus: claim.reviewStatus,
  };
}

export function buildRwaPackage(input: RwaPackageInput = {}): RwaPackage {
  const assetType = input.assetType || 'PROTOCOL_USAGE_RIGHT';
  const title = input.title || `${assetType.replace(/_/g, ' ')} Package`;
  const moduleId = input.moduleId || 'rwa.asset-registry.v1';
  const packageId = `rwa-${sha256Hex(`${assetType}:${title}`).slice(0, 12)}`;

  return {
    packageId,
    assetType,
    title,
    moduleId,
    legalStatus: 'LEGAL_REVIEW_REQUIRED',
    liveTokenSaleEnabled: false,
    rightsSummary: rwaRightsMap[assetType],
    requiredDisclosures: rwaDisclosures,
    reviewStatus: 'NEEDS_LEGAL_REVIEW',
    metadata: input.metadata ?? {},
  };
}

export function buildRwaWaterfall(assetType: RwaAssetType = 'PROTOCOL_USAGE_RIGHT') {
  return {
    assetType,
    legalStatus: 'LEGAL_REVIEW_REQUIRED',
    steps: [
      'intake',
      'diligence',
      'rights mapping',
      'legal structuring',
      'compliance review',
      'proof manifest generation',
      'anchor-ready packaging',
      'post-approval issuance preparation',
    ],
  };
}

export function buildX402Challenge(input: X402ChallengeInput = {}): X402Challenge {
  const route = input.route || '/api/agents/rag/query';
  const amount = typeof input.amount === 'number' && Number.isFinite(input.amount) ? input.amount : 0.01;
  const asset = input.asset || 'ATP';
  const ttlSeconds = typeof input.ttlSeconds === 'number' && Number.isFinite(input.ttlSeconds) ? input.ttlSeconds : 300;
  const challengeId = `x402-${randomUUID()}`;

  return {
    challengeId,
    route,
    amount,
    asset,
    nonce: sha256Hex(`${challengeId}:${route}`).slice(0, 32),
    expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
    status: 'PENDING',
  };
}

export function buildX402Receipt(challenge: X402Challenge, units = 1): X402Receipt {
  return {
    receiptId: `receipt-${sha256Hex(`${challenge.challengeId}:${challenge.route}`).slice(0, 12)}`,
    challengeId: challenge.challengeId,
    route: challenge.route,
    amount: challenge.amount,
    asset: challenge.asset,
    status: 'ISSUED',
    verifiedAt: new Date().toISOString(),
    meter: {
      units,
      unitType: 'request',
    },
  };
}

export function verifyX402Challenge(input: { challenge: X402Challenge; proof?: string }) {
  const expired = new Date(input.challenge.expiresAt).getTime() <= Date.now();
  const isDevelopment = process.env.AIT_X402_DEV_PROOF === 'true' || (process.env.AIT_X402_DEV_PROOF == null && process.env.NODE_ENV !== 'production');
  const proofAccepted = isDevelopment && input.proof === 'dev-pass';

  return {
    ok: proofAccepted && !expired,
    expired,
    status: expired ? 'EXPIRED' : proofAccepted ? 'VERIFIED' : 'REJECTED',
    receipt: proofAccepted && !expired ? buildX402Receipt({ ...input.challenge, status: 'VERIFIED' }) : null,
  };
}

export function buildMeterRecord(challenge: X402Challenge, units = 1) {
  return {
    challengeId: challenge.challengeId,
    route: challenge.route,
    amount: challenge.amount,
    asset: challenge.asset,
    units,
    unitType: 'request',
    estimatedTotal: Number((challenge.amount * units).toFixed(4)),
    status: 'METERED',
  };
}

export function buildExamplePayloads() {
  const documentManifest = buildDocumentProofManifest({
    content: 'AIT dossier summary: hash-only public proof, encrypted vault for restricted content.',
    title: 'AIT Dossier Summary',
    fileName: 'ait-dossier-summary.txt',
    mimeType: 'text/plain',
    sizeBytes: 84,
    visibility: 'restricted',
  });
  const merkleProof = buildMerkleProof([
    documentManifest.sha256,
    sha256Hex('ait-claim-proof'),
    sha256Hex('ait-license-proof'),
  ]);
  const polygonAnchor = buildAnchorPayload({ chain: 'polygon', merkleRoot: merkleProof.root });
  const xrplAnchor = buildAnchorPayload({ chain: 'xrpl', merkleRoot: merkleProof.root });
  const unykornAnchor = buildAnchorPayload({ chain: 'unykorn-l1', merkleRoot: merkleProof.root });
  const claimReview = classifyClaim({ claimText: 'The protocol mesh provides audited runtime hashing and encrypted packaging workflows.' });
  const rwaPackage = buildRwaPackage({ assetType: 'PROTOCOL_USAGE_RIGHT', title: 'AIT Protocol Usage Right' });
  const x402Challenge = buildX402Challenge({ route: '/api/ait/rwa/packages', amount: 0.25 });

  return {
    documentManifest,
    merkleProof,
    polygonAnchor,
    xrplAnchor,
    unykornAnchor,
    claimReview,
    rwaPackage,
    rwaWaterfall: buildRwaWaterfall(rwaPackage.assetType),
    x402Challenge,
    x402Receipt: buildX402Receipt(x402Challenge),
    reviewStatuses: [
      'PENDING_REVIEW',
      'APPROVED',
      'REJECTED',
      'NEEDS_LEGAL_REVIEW',
      'NEEDS_MEDICAL_REVIEW',
      'NEEDS_REGULATORY_REVIEW',
      'READY_FOR_ANCHOR',
      'ANCHORED',
    ] as ReviewStatus[],
  };
}