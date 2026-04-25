export interface AnchorRecord {
  recordId: string;
  documentId: string;
  sha256Hash: string;
  merkleRoot: string;
  ipfsCid?: string;
  polygonTx?: string;
  xrplRef?: string;
  unyL1Event?: string;
  timestamp: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED';
}

export const anchorRecords: AnchorRecord[] = [
  {
    recordId: 'anchor-001',
    documentId: 'doc-ait-exec-summary',
    sha256Hash: 'PENDING_HASH',
    merkleRoot: 'PENDING_MERKLE_ROOT',
    ipfsCid: 'bafybeigdyrztplaceholder',
    polygonTx: '0xplaceholderpolygon',
    xrplRef: 'xrpl-placeholder-ref',
    unyL1Event: 'STATE_ROOT_ANCHORED:ait.biofield.v1:001',
    timestamp: '2026-04-25T00:20:00Z',
    verificationStatus: 'PENDING',
  },
];
