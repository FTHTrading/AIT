import type { VisibilityLevel } from './types';

const sensitivePatterns = [/kyc/i, /patient/i, /formula/i, /dose/i, /ratio/i, /contract/i, /investor/i, /confidential/i, /private/i];

function hasSensitiveKey(input: unknown): boolean {
  if (!input || typeof input !== 'object') {
    return false;
  }

  return Object.entries(input as Record<string, unknown>).some(([key, value]) => {
    if (sensitivePatterns.some((pattern) => pattern.test(key))) {
      return true;
    }

    if (typeof value === 'string' && sensitivePatterns.some((pattern) => pattern.test(value))) {
      return true;
    }

    return hasSensitiveKey(value);
  });
}

export function enforcePrivateVaultBoundary(input: {
  visibility: VisibilityLevel;
  metadata?: Record<string, unknown>;
  payload?: Record<string, unknown> | null;
  encryptedPayload?: string | null;
  encryptedPayloadRef?: string | null;
}) {
  if (input.visibility === 'public') {
    return { ok: true as const };
  }

  const includesSensitiveMaterial = hasSensitiveKey(input.metadata) || hasSensitiveKey(input.payload);
  const hasEncryptedReference = Boolean(input.encryptedPayload || input.encryptedPayloadRef);

  if (includesSensitiveMaterial && !hasEncryptedReference) {
    return {
      ok: false as const,
      error:
        'Sensitive private material requires encryptedPayload or encryptedPayloadRef. Raw KYC, patient, formula, dosing, contract, or confidential investor content cannot be stored directly.',
    };
  }

  return { ok: true as const };
}