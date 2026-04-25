import { describe, expect, it } from 'vitest';
import { buildClaimEvidence, buildDocumentProofManifest, buildIpfsPayload, buildMerkleProof, buildRwaPackage, buildX402Challenge, buildX402Receipt, classifyClaim, verifyMerklePath, verifyX402Challenge } from './engine';

describe('AIT engine', () => {
  it('builds deterministic document proof hashes', () => {
    const first = buildDocumentProofManifest({ content: 'same-content', title: 'Deterministic' });
    const second = buildDocumentProofManifest({ content: 'same-content', title: 'Deterministic' });

    expect(first.sha256).toBe(second.sha256);
  });

  it('builds deterministic Merkle roots', () => {
    const first = buildMerkleProof([
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    ]);
    const second = buildMerkleProof([
      'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    ]);

    expect(first.root).toBe(second.root);
  });

  it('fails verification for tampered documents', () => {
    const proof = buildMerkleProof([
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    ]);

    expect(verifyMerklePath('cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', proof.proofs[0].proof, proof.root)).toBe(false);
  });

  it('classifies claim evidence', () => {
    const claim = classifyClaim({ claimText: 'The therapy treats renal disease and improves oxygenation.' });
    const evidence = buildClaimEvidence(claim.claimText);

    expect(claim.category).toBe('medical');
    expect(claim.reviewStatus).toBe('NEEDS_MEDICAL_REVIEW');
    expect(evidence.evidenceChecklist.length).toBeGreaterThan(0);
  });

  it('requires encryption for private IPFS payloads', () => {
    const manifest = buildDocumentProofManifest({
      content: 'private-dataset-reference',
      title: 'Private Payload',
      visibility: 'private',
    });

    const payload = buildIpfsPayload({ manifest });

    expect(payload.ok).toBe(false);
    expect(payload.status).toBe('ENCRYPTION_REQUIRED');
  });

  it('generates RWA packages', () => {
    const rwaPackage = buildRwaPackage({ assetType: 'IP_LICENSE', title: 'AIT IP License' });

    expect(rwaPackage.assetType).toBe('IP_LICENSE');
    expect(rwaPackage.liveTokenSaleEnabled).toBe(false);
  });

  it('generates x402 challenge and receipt', () => {
    const challenge = buildX402Challenge({ route: '/api/ait/rwa/packages', amount: 2 });
    const receipt = buildX402Receipt(challenge, 3);

    expect(challenge.route).toBe('/api/ait/rwa/packages');
    expect(receipt.meter.units).toBe(3);
  });

  it('isolates x402 mock verification to development mode', () => {
    const originalDevFlag = process.env.AIT_X402_DEV_PROOF;
    const challenge = buildX402Challenge({ route: '/api/ait/rwa/packages', amount: 2, ttlSeconds: 60 });

    process.env.AIT_X402_DEV_PROOF = 'true';
    const developmentResult = verifyX402Challenge({ challenge, proof: 'dev-pass' });

    process.env.AIT_X402_DEV_PROOF = 'false';
    const productionResult = verifyX402Challenge({ challenge, proof: 'dev-pass' });

    process.env.AIT_X402_DEV_PROOF = originalDevFlag;

    expect(developmentResult.ok).toBe(true);
    expect(productionResult.ok).toBe(false);
  });
});