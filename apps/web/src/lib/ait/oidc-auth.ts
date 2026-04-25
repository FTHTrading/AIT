/**
 * OIDC / external JWT auth adapter for the AIT admin layer.
 *
 * Activated when `AIT_OIDC_JWKS_URL` (RS256/ES256) or `AIT_OIDC_SECRET`
 * (HS256 shared secret) env vars are configured.
 *
 * The JWT must contain:
 *   - `iss`            matching AIT_OIDC_ISSUER (if set)
 *   - `aud`            matching AIT_OIDC_AUDIENCE (if set)
 *   - `exp`            standard expiry claim
 *   - AIT_OIDC_ROLE_CLAIM (default: "ait_role")  →  AdminRole string
 *
 * Falls back to null (no session) if the JWT is missing, malformed, or
 * the env vars are not configured.
 */

import { createHmac, createPublicKey, verify as cryptoVerify } from 'node:crypto';
import type { AdminRole, AdminSession } from './types';

const ADMIN_ROLES: AdminRole[] = ['ADMIN', 'LEGAL_REVIEWER', 'MEDICAL_REVIEWER', 'REGULATORY_REVIEWER', 'TECHNICAL_REVIEWER', 'VIEW_ONLY'];

function buildOidcSession(username: string, role: AdminRole, displayName: string): AdminSession {
  const now = new Date();
  const exp = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour for OIDC tokens
  return { username, displayName, role, issuedAt: now.toISOString(), expiresAt: exp.toISOString() };
}

// JWKS cache: keyed by JWKS URL, value is the raw JWK array.
const jwksCache = new Map<string, { keys: JwkEntry[]; fetchedAt: number }>();
const JWKS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface JwkEntry {
  kid?: string;
  kty: string;
  n?: string;
  e?: string;
  x?: string;
  y?: string;
  crv?: string;
  use?: string;
  alg?: string;
}

interface JwtHeader {
  alg: string;
  kid?: string;
}

interface JwtPayload {
  iss?: string;
  aud?: string | string[];
  exp?: number;
  sub?: string;
  name?: string;
  preferred_username?: string;
  [key: string]: unknown;
}

function base64urlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(input.length + ((4 - (input.length % 4)) % 4), '=');
  return Buffer.from(padded, 'base64');
}

function parseJwtParts(token: string): { header: JwtHeader; payload: JwtPayload; signingInput: string; signature: Buffer } | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const header = JSON.parse(base64urlDecode(parts[0]).toString('utf8')) as JwtHeader;
    const payload = JSON.parse(base64urlDecode(parts[1]).toString('utf8')) as JwtPayload;
    const signature = base64urlDecode(parts[2]);
    const signingInput = `${parts[0]}.${parts[1]}`;
    return { header, payload, signingInput, signature };
  } catch {
    return null;
  }
}

function verifyClaimsOnly(payload: JwtPayload): boolean {
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const issuer = process.env.AIT_OIDC_ISSUER;
  if (issuer && payload.iss !== issuer) {
    return false;
  }

  const audience = process.env.AIT_OIDC_AUDIENCE;
  if (audience) {
    const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!aud.includes(audience)) {
      return false;
    }
  }

  return true;
}

function extractRole(payload: JwtPayload): AdminRole | null {
  const claimKey = process.env.AIT_OIDC_ROLE_CLAIM ?? 'ait_role';
  const rawRole = payload[claimKey];
  if (typeof rawRole === 'string' && ADMIN_ROLES.includes(rawRole as AdminRole)) {
    return rawRole as AdminRole;
  }
  return null;
}

function resolveDisplayName(payload: JwtPayload): string {
  return (
    (typeof payload.name === 'string' ? payload.name : null) ??
    (typeof payload.preferred_username === 'string' ? payload.preferred_username : null) ??
    (typeof payload.sub === 'string' ? payload.sub : null) ??
    'oidc-user'
  );
}

/** HS256 verification using AIT_OIDC_SECRET shared secret. */
function verifyHs256(signingInput: string, signature: Buffer, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(signingInput).digest();
  if (expected.length !== signature.length) return false;
  // Constant-time compare
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ signature[i];
  return diff === 0;
}

/** Build a Node.js KeyObject from a JWK (RSA or EC). */
function buildPublicKeyFromJwk(jwk: JwkEntry): ReturnType<typeof createPublicKey> | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createPublicKey({ key: jwk as any, format: 'jwk' });
  } catch {
    return null;
  }
}

/** RS256 / ES256 verification using a JWK public key. */
function verifyAsymmetric(alg: string, signingInput: string, signature: Buffer, jwk: JwkEntry): boolean {
  const publicKey = buildPublicKeyFromJwk(jwk);
  if (!publicKey) return false;

  try {
    if (alg === 'RS256') {
      return cryptoVerify('sha256', Buffer.from(signingInput), publicKey, signature);
    }
    if (alg === 'ES256') {
      return cryptoVerify('sha256', Buffer.from(signingInput), { key: publicKey, dsaEncoding: 'ieee-p1363' }, signature);
    }
    return false;
  } catch {
    return false;
  }
}

async function fetchJwks(url: string): Promise<JwkEntry[]> {
  const cached = jwksCache.get(url);
  if (cached && Date.now() - cached.fetchedAt < JWKS_CACHE_TTL_MS) {
    return cached.keys;
  }

  const res = await fetch(url);
  if (!res.ok) return [];

  const json = await res.json() as { keys?: JwkEntry[] };
  const keys = Array.isArray(json.keys) ? json.keys : [];
  jwksCache.set(url, { keys, fetchedAt: Date.now() });
  return keys;
}

export function isOidcAuthEnabled(): boolean {
  return Boolean(process.env.AIT_OIDC_JWKS_URL || process.env.AIT_OIDC_SECRET);
}

/**
 * Verifies a raw JWT Bearer token string.
 * Returns an AdminSession if the token is valid and contains a known AIT role.
 * Returns null otherwise.
 */
export async function verifyOidcBearerToken(token: string): Promise<AdminSession | null> {
  if (!isOidcAuthEnabled()) return null;

  const parts = parseJwtParts(token);
  if (!parts) return null;

  const { header, payload, signingInput, signature } = parts;

  if (!verifyClaimsOnly(payload)) return null;

  const role = extractRole(payload);
  if (!role) return null;

  const hs256Secret = process.env.AIT_OIDC_SECRET;
  const jwksUrl = process.env.AIT_OIDC_JWKS_URL;

  if (header.alg === 'HS256' && hs256Secret) {
    if (!verifyHs256(signingInput, signature, hs256Secret)) return null;
  } else if ((header.alg === 'RS256' || header.alg === 'ES256') && jwksUrl) {
    const keys = await fetchJwks(jwksUrl);
    const matchingKeys = header.kid ? keys.filter((k) => k.kid === header.kid) : keys.filter((k) => k.alg === header.alg || !k.alg);

    const verified = matchingKeys.some((jwk) => verifyAsymmetric(header.alg, signingInput, signature, jwk));
    if (!verified) return null;
  } else {
    // Unsupported alg or missing secret/JWKS
    return null;
  }

  const username = (typeof payload.sub === 'string' ? payload.sub : null) ?? 'oidc-user';
  const displayName = resolveDisplayName(payload);
  return buildOidcSession(username, role, displayName);
}
