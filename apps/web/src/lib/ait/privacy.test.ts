import { describe, expect, it } from 'vitest';
import { enforcePrivateVaultBoundary } from './privacy';

describe('private vault boundary', () => {
  it('rejects sensitive private payloads without encryption', () => {
    const result = enforcePrivateVaultBoundary({
      visibility: 'private',
      metadata: { kycDocumentId: '12345' },
      payload: { confidentialFormula: 'ratio-7-3-2' },
    });

    expect(result.ok).toBe(false);
  });

  it('accepts private payloads with encrypted references', () => {
    const result = enforcePrivateVaultBoundary({
      visibility: 'private',
      metadata: { kycDocumentId: '12345' },
      encryptedPayloadRef: 'vault://ait/12345',
    });

    expect(result.ok).toBe(true);
  });
});