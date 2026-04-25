import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getAitPrismaClient } from '@/lib/db';
import type {
  AitAuditEvent,
  AitAdminReview,
  AitAnchorPayloadRecord,
  AitClaimReviewRecord,
  AitDocumentProofRecord,
  AitEvidenceRequestRecord,
  AitIpfsPayloadRecord,
  AitMerkleBatchRecord,
  AitPersistenceStore,
  AitRouteMeterRecord,
  AitRwaPackageRecord,
  AitStorageBackend,
  AitX402ChallengeRecord,
  AitX402ReceiptRecord,
} from './types';

const STORE_DIRECTORY = path.join(process.cwd(), '.data');
const STORE_PATH = path.join(STORE_DIRECTORY, 'ait-review-store.json');

const EMPTY_STORE: AitPersistenceStore = {
  documentProofs: [],
  merkleBatches: [],
  anchorPayloads: [],
  ipfsPayloads: [],
  claimReviews: [],
  evidenceRequests: [],
  rwaPackages: [],
  x402Challenges: [],
  x402Receipts: [],
  adminReviews: [],
  auditEvents: [],
  routeMeterRecords: [],
};

type CollectionKey = keyof AitPersistenceStore;

type CollectionRecord<K extends CollectionKey> = AitPersistenceStore[K][number];

export interface AitRepositoryBackend {
  readonly backend: AitStorageBackend;
  readonly storePath?: string;
  readonly fallbackReason?: string;
  listDocumentProofs(): Promise<AitDocumentProofRecord[]>;
  saveDocumentProof(record: AitDocumentProofRecord): Promise<AitDocumentProofRecord>;
  listMerkleBatches(): Promise<AitMerkleBatchRecord[]>;
  saveMerkleBatch(record: AitMerkleBatchRecord): Promise<AitMerkleBatchRecord>;
  listAnchorPayloads(): Promise<AitAnchorPayloadRecord[]>;
  saveAnchorPayload(record: AitAnchorPayloadRecord): Promise<AitAnchorPayloadRecord>;
  listIpfsPayloads(): Promise<AitIpfsPayloadRecord[]>;
  saveIpfsPayload(record: AitIpfsPayloadRecord): Promise<AitIpfsPayloadRecord>;
  listClaimReviews(): Promise<AitClaimReviewRecord[]>;
  saveClaimReview(record: AitClaimReviewRecord): Promise<AitClaimReviewRecord>;
  listEvidenceRequests(): Promise<AitEvidenceRequestRecord[]>;
  saveEvidenceRequest(record: AitEvidenceRequestRecord): Promise<AitEvidenceRequestRecord>;
  listRwaPackages(): Promise<AitRwaPackageRecord[]>;
  saveRwaPackage(record: AitRwaPackageRecord): Promise<AitRwaPackageRecord>;
  listX402Challenges(): Promise<AitX402ChallengeRecord[]>;
  saveX402Challenge(record: AitX402ChallengeRecord): Promise<AitX402ChallengeRecord>;
  listX402Receipts(): Promise<AitX402ReceiptRecord[]>;
  saveX402Receipt(record: AitX402ReceiptRecord): Promise<AitX402ReceiptRecord>;
  listAdminReviews(): Promise<AitAdminReview[]>;
  saveAdminReview(review: AitAdminReview): Promise<AitAdminReview>;
  listAuditEvents(): Promise<AitAuditEvent[]>;
  saveAuditEvent(event: AitAuditEvent): Promise<AitAuditEvent>;
  listRouteMeterRecords(): Promise<AitRouteMeterRecord[]>;
  saveRouteMeterRecord(record: AitRouteMeterRecord): Promise<AitRouteMeterRecord>;
}

async function ensureStoreFile() {
  await mkdir(STORE_DIRECTORY, { recursive: true });

  try {
    await readFile(STORE_PATH, 'utf8');
  } catch {
    await writeFile(STORE_PATH, JSON.stringify(EMPTY_STORE, null, 2), 'utf8');
  }
}

async function readStore(): Promise<AitPersistenceStore> {
  await ensureStoreFile();

  try {
    const raw = await readFile(STORE_PATH, 'utf8');
    return { ...EMPTY_STORE, ...(JSON.parse(raw) as Partial<AitPersistenceStore>) };
  } catch {
    return { ...EMPTY_STORE };
  }
}

async function writeStore(store: AitPersistenceStore) {
  await ensureStoreFile();
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

async function upsertRecord<K extends CollectionKey>(collection: K, identifierKey: keyof CollectionRecord<K>, record: CollectionRecord<K>) {
  const store = await readStore();
  const records = [...store[collection]] as CollectionRecord<K>[];
  const nextIdentifier = record[identifierKey];
  const index = records.findIndex((item) => item[identifierKey] === nextIdentifier);

  if (index >= 0) {
    records[index] = record;
  } else {
    records.unshift(record);
  }

  const nextStore = { ...store, [collection]: records } as AitPersistenceStore;
  await writeStore(nextStore);
  return record;
}

async function listRecords<K extends CollectionKey>(collection: K): Promise<CollectionRecord<K>[]> {
  const store = await readStore();
  return store[collection] as CollectionRecord<K>[];
}

async function appendAdminReview(review: AitAdminReview) {
  return upsertRecord('adminReviews', 'reviewId', review);
}

const fileBackend: AitRepositoryBackend = {
  backend: 'file',
  storePath: STORE_PATH,
  listDocumentProofs() {
    return listRecords('documentProofs');
  },
  saveDocumentProof(record: AitDocumentProofRecord) {
    return upsertRecord('documentProofs', 'documentId', record);
  },
  listMerkleBatches() {
    return listRecords('merkleBatches');
  },
  saveMerkleBatch(record: AitMerkleBatchRecord) {
    return upsertRecord('merkleBatches', 'batchId', record);
  },
  listAnchorPayloads() {
    return listRecords('anchorPayloads');
  },
  saveAnchorPayload(record: AitAnchorPayloadRecord) {
    return upsertRecord('anchorPayloads', 'anchorId', record);
  },
  listIpfsPayloads() {
    return listRecords('ipfsPayloads');
  },
  saveIpfsPayload(record: AitIpfsPayloadRecord) {
    return upsertRecord('ipfsPayloads', 'ipfsId', record);
  },
  listClaimReviews() {
    return listRecords('claimReviews');
  },
  saveClaimReview(record: AitClaimReviewRecord) {
    return upsertRecord('claimReviews', 'claimId', record);
  },
  listEvidenceRequests() {
    return listRecords('evidenceRequests');
  },
  saveEvidenceRequest(record: AitEvidenceRequestRecord) {
    return upsertRecord('evidenceRequests', 'evidenceRequestId', record);
  },
  listRwaPackages() {
    return listRecords('rwaPackages');
  },
  saveRwaPackage(record: AitRwaPackageRecord) {
    return upsertRecord('rwaPackages', 'packageId', record);
  },
  listX402Challenges() {
    return listRecords('x402Challenges');
  },
  saveX402Challenge(record: AitX402ChallengeRecord) {
    return upsertRecord('x402Challenges', 'challengeId', record);
  },
  listX402Receipts() {
    return listRecords('x402Receipts');
  },
  saveX402Receipt(record: AitX402ReceiptRecord) {
    return upsertRecord('x402Receipts', 'receiptId', record);
  },
  listAdminReviews() {
    return listRecords('adminReviews');
  },
  saveAdminReview(review: AitAdminReview) {
    return appendAdminReview(review);
  },
  listAuditEvents() {
    return listRecords('auditEvents');
  },
  saveAuditEvent(event: AitAuditEvent) {
    return upsertRecord('auditEvents', 'auditEventId', event);
  },
  listRouteMeterRecords() {
    return listRecords('routeMeterRecords');
  },
  saveRouteMeterRecord(record: AitRouteMeterRecord) {
    return upsertRecord('routeMeterRecords', 'meterId', record);
  },
};

type PrismaDelegateMap = {
  [key in CollectionKey]: {
    delegate: string;
    identifier: string;
    orderBy: string;
  };
};

const prismaDelegateMap: PrismaDelegateMap = {
  documentProofs: { delegate: 'aitDocumentProof', identifier: 'documentId', orderBy: 'createdAt' },
  merkleBatches: { delegate: 'aitMerkleBatch', identifier: 'batchId', orderBy: 'createdAt' },
  anchorPayloads: { delegate: 'aitAnchorPayload', identifier: 'anchorId', orderBy: 'createdAt' },
  ipfsPayloads: { delegate: 'aitIpfsPayload', identifier: 'ipfsId', orderBy: 'createdAt' },
  claimReviews: { delegate: 'aitClaimReview', identifier: 'claimId', orderBy: 'createdAt' },
  evidenceRequests: { delegate: 'aitEvidenceRequest', identifier: 'evidenceRequestId', orderBy: 'createdAt' },
  rwaPackages: { delegate: 'aitRwaPackage', identifier: 'packageId', orderBy: 'createdAt' },
  x402Challenges: { delegate: 'aitX402Challenge', identifier: 'challengeId', orderBy: 'createdAt' },
  x402Receipts: { delegate: 'aitX402Receipt', identifier: 'receiptId', orderBy: 'createdAt' },
  adminReviews: { delegate: 'aitAdminReview', identifier: 'reviewId', orderBy: 'createdAt' },
  auditEvents: { delegate: 'aitAuditEvent', identifier: 'auditEventId', orderBy: 'createdAt' },
  routeMeterRecords: { delegate: 'aitRouteMeterRecord', identifier: 'meterId', orderBy: 'createdAt' },
};

let cachedBackend: AitRepositoryBackend | null = null;

function requestedBackend(): AitStorageBackend {
  return process.env.AIT_STORAGE_BACKEND === 'prisma' ? 'prisma' : 'file';
}

function createPrismaBackend(client: any): AitRepositoryBackend | null {
  if (!client || typeof client !== 'object' || !(prismaDelegateMap.documentProofs.delegate in client)) {
    return null;
  }

  const list = async <K extends CollectionKey>(collection: K): Promise<CollectionRecord<K>[]> => {
    const config = prismaDelegateMap[collection];
    const result = await client[config.delegate].findMany({
      orderBy: { [config.orderBy]: 'desc' },
    });
    return result as CollectionRecord<K>[];
  };

  const save = async <K extends CollectionKey>(collection: K, record: CollectionRecord<K>): Promise<CollectionRecord<K>> => {
    const config = prismaDelegateMap[collection];
    const identifier = record[config.identifier as keyof CollectionRecord<K>];
    const result = await client[config.delegate].upsert({
      where: { [config.identifier]: identifier },
      update: record,
      create: record,
    });
    return result as CollectionRecord<K>;
  };

  return {
    backend: 'prisma',
    listDocumentProofs() {
      return list('documentProofs');
    },
    saveDocumentProof(record: AitDocumentProofRecord) {
      return save('documentProofs', record);
    },
    listMerkleBatches() {
      return list('merkleBatches');
    },
    saveMerkleBatch(record: AitMerkleBatchRecord) {
      return save('merkleBatches', record);
    },
    listAnchorPayloads() {
      return list('anchorPayloads');
    },
    saveAnchorPayload(record: AitAnchorPayloadRecord) {
      return save('anchorPayloads', record);
    },
    listIpfsPayloads() {
      return list('ipfsPayloads');
    },
    saveIpfsPayload(record: AitIpfsPayloadRecord) {
      return save('ipfsPayloads', record);
    },
    listClaimReviews() {
      return list('claimReviews');
    },
    saveClaimReview(record: AitClaimReviewRecord) {
      return save('claimReviews', record);
    },
    listEvidenceRequests() {
      return list('evidenceRequests');
    },
    saveEvidenceRequest(record: AitEvidenceRequestRecord) {
      return save('evidenceRequests', record);
    },
    listRwaPackages() {
      return list('rwaPackages');
    },
    saveRwaPackage(record: AitRwaPackageRecord) {
      return save('rwaPackages', record);
    },
    listX402Challenges() {
      return list('x402Challenges');
    },
    saveX402Challenge(record: AitX402ChallengeRecord) {
      return save('x402Challenges', record);
    },
    listX402Receipts() {
      return list('x402Receipts');
    },
    saveX402Receipt(record: AitX402ReceiptRecord) {
      return save('x402Receipts', record);
    },
    listAdminReviews() {
      return list('adminReviews');
    },
    saveAdminReview(review: AitAdminReview) {
      return save('adminReviews', review);
    },
    listAuditEvents() {
      return list('auditEvents');
    },
    saveAuditEvent(event: AitAuditEvent) {
      return save('auditEvents', event);
    },
    listRouteMeterRecords() {
      return list('routeMeterRecords');
    },
    saveRouteMeterRecord(record: AitRouteMeterRecord) {
      return save('routeMeterRecords', record);
    },
  };
}

async function resolveBackend(): Promise<AitRepositoryBackend> {
  if (cachedBackend) {
    return cachedBackend;
  }

  if (requestedBackend() === 'prisma') {
    try {
      const client = getAitPrismaClient();
      const prismaBackend = client ? createPrismaBackend(client) : null;

      if (prismaBackend) {
        cachedBackend = prismaBackend;
        return prismaBackend;
      }

      cachedBackend = {
        ...fileBackend,
        fallbackReason: 'Prisma client is installed, but AIT models are not generated yet or DATABASE_URL is not set. Falling back to file storage.',
      };
      return cachedBackend;
    } catch {
      cachedBackend = {
        ...fileBackend,
        fallbackReason: 'Prisma backend requested, but Prisma client is unavailable in the current runtime. Falling back to file storage.',
      };
      return cachedBackend;
    }
  }

  cachedBackend = fileBackend;
  return cachedBackend;
}

export const aitRepository = {
  async getInfo() {
    const backend = await resolveBackend();
    return {
      backend: backend.backend,
      storePath: backend.storePath,
      fallbackReason: backend.fallbackReason,
    };
  },
  getStorePath() {
    return STORE_PATH;
  },
  async listDocumentProofs() {
    return (await resolveBackend()).listDocumentProofs();
  },
  async saveDocumentProof(record: AitDocumentProofRecord) {
    return (await resolveBackend()).saveDocumentProof(record);
  },
  async listMerkleBatches() {
    return (await resolveBackend()).listMerkleBatches();
  },
  async saveMerkleBatch(record: AitMerkleBatchRecord) {
    return (await resolveBackend()).saveMerkleBatch(record);
  },
  async listAnchorPayloads() {
    return (await resolveBackend()).listAnchorPayloads();
  },
  async saveAnchorPayload(record: AitAnchorPayloadRecord) {
    return (await resolveBackend()).saveAnchorPayload(record);
  },
  async listIpfsPayloads() {
    return (await resolveBackend()).listIpfsPayloads();
  },
  async saveIpfsPayload(record: AitIpfsPayloadRecord) {
    return (await resolveBackend()).saveIpfsPayload(record);
  },
  async listClaimReviews() {
    return (await resolveBackend()).listClaimReviews();
  },
  async saveClaimReview(record: AitClaimReviewRecord) {
    return (await resolveBackend()).saveClaimReview(record);
  },
  async listEvidenceRequests() {
    return (await resolveBackend()).listEvidenceRequests();
  },
  async saveEvidenceRequest(record: AitEvidenceRequestRecord) {
    return (await resolveBackend()).saveEvidenceRequest(record);
  },
  async listRwaPackages() {
    return (await resolveBackend()).listRwaPackages();
  },
  async saveRwaPackage(record: AitRwaPackageRecord) {
    return (await resolveBackend()).saveRwaPackage(record);
  },
  async listX402Challenges() {
    return (await resolveBackend()).listX402Challenges();
  },
  async saveX402Challenge(record: AitX402ChallengeRecord) {
    return (await resolveBackend()).saveX402Challenge(record);
  },
  async listX402Receipts() {
    return (await resolveBackend()).listX402Receipts();
  },
  async saveX402Receipt(record: AitX402ReceiptRecord) {
    return (await resolveBackend()).saveX402Receipt(record);
  },
  async listAdminReviews() {
    return (await resolveBackend()).listAdminReviews();
  },
  async saveAdminReview(review: AitAdminReview) {
    return (await resolveBackend()).saveAdminReview(review);
  },
  async listAuditEvents() {
    return (await resolveBackend()).listAuditEvents();
  },
  async saveAuditEvent(event: AitAuditEvent) {
    return (await resolveBackend()).saveAuditEvent(event);
  },
  async listRouteMeterRecords() {
    return (await resolveBackend()).listRouteMeterRecords();
  },
  async saveRouteMeterRecord(record: AitRouteMeterRecord) {
    return (await resolveBackend()).saveRouteMeterRecord(record);
  },
};