/**
 * Live IPFS upload adapter for AIT anchor payloads.
 *
 * Providers (checked in order):
 *   1. Pinata   — set PINATA_JWT
 *   2. web3.storage — set WEB3_STORAGE_TOKEN
 *
 * Falls back to a placeholder CID when no live config is present.
 */

import { createHash } from 'node:crypto';

export type IpfsUploadResult =
  | { ok: true; cid: string; provider: 'pinata' | 'web3storage'; url: string }
  | { ok: false; placeholder: string; reason: string; provider: 'mock' };

export function isLiveIpfsEnabled(): boolean {
  return Boolean(process.env.PINATA_JWT || process.env.WEB3_STORAGE_TOKEN);
}

/** Generate a placeholder CID for dev/fallback use. */
function placeholderCid(content: string): string {
  const hash = createHash('sha256').update(content).digest('hex').slice(0, 38);
  return `bafybeimock${hash}`;
}

async function uploadToPinata(payload: unknown, pinataJwt: string): Promise<IpfsUploadResult> {
  const body = JSON.stringify({
    pinataContent: payload,
    pinataOptions: { cidVersion: 1 },
    pinataMetadata: { name: `ait-payload-${Date.now()}` },
  });

  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pinataJwt}`,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, placeholder: placeholderCid(body), reason: `Pinata error ${res.status}: ${text.slice(0, 200)}`, provider: 'mock' };
  }

  const json = await res.json() as { IpfsHash?: string };
  const cid = json.IpfsHash;
  if (!cid) {
    return { ok: false, placeholder: placeholderCid(body), reason: 'Pinata returned no IpfsHash', provider: 'mock' };
  }

  return { ok: true, cid, provider: 'pinata', url: `https://gateway.pinata.cloud/ipfs/${cid}` };
}

async function uploadToWeb3Storage(payload: unknown, token: string): Promise<IpfsUploadResult> {
  const content = JSON.stringify(payload);
  const blob = Buffer.from(content, 'utf8');

  const res = await fetch('https://api.web3.storage/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: blob,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, placeholder: placeholderCid(content), reason: `web3.storage error ${res.status}: ${text.slice(0, 200)}`, provider: 'mock' };
  }

  const json = await res.json() as { cid?: string };
  const cid = json.cid;
  if (!cid) {
    return { ok: false, placeholder: placeholderCid(content), reason: 'web3.storage returned no cid', provider: 'mock' };
  }

  return { ok: true, cid, provider: 'web3storage', url: `https://w3s.link/ipfs/${cid}` };
}

/**
 * Upload a JSON payload to IPFS using the configured provider.
 * Falls back to a placeholder CID if no live config is available or on error.
 */
export async function uploadToIpfs(payload: unknown): Promise<IpfsUploadResult> {
  const pinataJwt = process.env.PINATA_JWT;
  if (pinataJwt) {
    return uploadToPinata(payload, pinataJwt);
  }

  const web3Token = process.env.WEB3_STORAGE_TOKEN;
  if (web3Token) {
    return uploadToWeb3Storage(payload, web3Token);
  }

  const placeholder = placeholderCid(JSON.stringify(payload));
  return { ok: false, placeholder, reason: 'No live IPFS provider configured (set PINATA_JWT or WEB3_STORAGE_TOKEN)', provider: 'mock' };
}
