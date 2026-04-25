/**
 * Ed25519 signing adapter for AIT chain anchor payloads.
 *
 * Activated when `AIT_CHAIN_SIGNER_PRIVATE_KEY` is set to a 64-hex-char
 * (32-byte) Ed25519 private key seed.
 *
 * The private key seed is wrapped in a PKCS#8 DER envelope so Node.js
 * crypto can use it with the `ed25519` algorithm.
 *
 * PKCS#8 DER structure for Ed25519:
 *   30 2e                            SEQUENCE (46 bytes)
 *     02 01 00                       INTEGER 0 (version)
 *     30 05                          SEQUENCE (5 bytes)
 *       06 03 2b 65 70              OID 1.3.101.112 (id-EdDSA / Ed25519)
 *     04 22                          OCTET STRING (34 bytes)
 *       04 20                        OCTET STRING (32 bytes) — the key seed
 *         <32 bytes of private key>
 */

import { createPrivateKey, createPublicKey, sign as cryptoSign } from 'node:crypto';

export type ChainSigningResult =
  | { ok: true; signature: string; publicKeyHex: string; signingMethod: 'ed25519' }
  | { ok: false; reason: string; signingMethod: 'disabled' | 'error' };

export function isChainSigningEnabled(): boolean {
  return Boolean(process.env.AIT_CHAIN_SIGNER_PRIVATE_KEY);
}

/** Build a PKCS#8 DER buffer from a 32-byte Ed25519 private key seed. */
function buildPkcs8Der(privateKeyBytes: Buffer): Buffer {
  // PKCS#8 header for Ed25519: 302e020100300506032b657004220420
  const header = Buffer.from('302e020100300506032b657004220420', 'hex');
  return Buffer.concat([header, privateKeyBytes]);
}

/** Sign arbitrary data with the configured Ed25519 private key. Returns hex strings. */
export function signAnchorPayload(dataField: string): ChainSigningResult {
  const rawKeyHex = process.env.AIT_CHAIN_SIGNER_PRIVATE_KEY;

  if (!rawKeyHex) {
    return { ok: false, reason: 'AIT_CHAIN_SIGNER_PRIVATE_KEY is not configured', signingMethod: 'disabled' };
  }

  if (!/^[0-9a-fA-F]{64}$/.test(rawKeyHex)) {
    return { ok: false, reason: 'AIT_CHAIN_SIGNER_PRIVATE_KEY must be exactly 64 hex characters (32 bytes)', signingMethod: 'error' };
  }

  try {
    const privateKeyBytes = Buffer.from(rawKeyHex, 'hex');
    const pkcs8Der = buildPkcs8Der(privateKeyBytes);

    const privateKey = createPrivateKey({ key: pkcs8Der, format: 'der', type: 'pkcs8' });
    const publicKey = createPublicKey(privateKey);

    const data = Buffer.from(dataField, 'utf8');
    const signatureBuffer = cryptoSign(null, data, privateKey);

    // Extract the raw 32-byte public key from the SPKI DER (last 32 bytes of a 44-byte SPKI)
    const spkiDer = publicKey.export({ type: 'spki', format: 'der' });
    const publicKeyHex = spkiDer.slice(-32).toString('hex');

    return {
      ok: true,
      signature: signatureBuffer.toString('hex'),
      publicKeyHex,
      signingMethod: 'ed25519',
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Ed25519 signing failed';
    return { ok: false, reason, signingMethod: 'error' };
  }
}
