/**
 * Real x402 settlement verification adapter.
 *
 * Queries the Apostle Chain facilitator (APOSTLE_URL or AIT_X402_FACILITATOR_URL)
 * for a receipt matching the submitted challenge ID and verifies it is settled.
 *
 * Activated when:
 *   - APOSTLE_URL or AIT_X402_FACILITATOR_URL is set, AND
 *   - AIT_X402_DEV_PROOF !== 'true'
 *
 * Falls back to dev-proof mode when not configured.
 */

export type X402VerifyResult =
  | { ok: true; status: 'VERIFIED'; settledAt: string | null; amount: string | null; asset: string | null; source: 'apostle' | 'facilitator' }
  | { ok: false; status: 'NOT_FOUND' | 'PENDING' | 'FAILED' | 'ERROR'; reason: string };

interface ApostleReceipt {
  receipt_id?: string;
  challenge_id?: string;
  status?: string;
  settled_at?: string;
  amount?: string;
  asset?: string;
  // Apostle may return different shapes — be permissive
  [key: string]: unknown;
}

function getFacilitatorUrl(): string | null {
  return process.env.AIT_X402_FACILITATOR_URL || process.env.APOSTLE_URL || null;
}

export function isLiveX402VerificationEnabled(): boolean {
  return Boolean(getFacilitatorUrl()) && process.env.AIT_X402_DEV_PROOF !== 'true';
}

async function fetchReceipts(baseUrl: string): Promise<ApostleReceipt[]> {
  const url = `${baseUrl.replace(/\/$/, '')}/v1/receipts`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    // Hard timeout via AbortSignal — 5s
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    throw new Error(`Facilitator returned ${res.status} from ${url}`);
  }

  const data = await res.json() as { receipts?: ApostleReceipt[] } | ApostleReceipt[];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.receipts)) return data.receipts;
  return [];
}

function isSettled(status?: string): boolean {
  if (!status) return false;
  const normalized = status.toUpperCase();
  return normalized === 'SETTLED' || normalized === 'VERIFIED' || normalized === 'COMPLETE' || normalized === 'CONFIRMED';
}

/**
 * Verify a submitted x402 receipt/challenge against the configured facilitator.
 *
 * @param receiptId  The receipt_id from the x402 payment receipt, if available.
 * @param challengeId  The challenge_id of the original AIT x402 challenge.
 */
export async function verifyX402Receipt(receiptId: string | null, challengeId: string): Promise<X402VerifyResult> {
  if (!isLiveX402VerificationEnabled()) {
    return { ok: false, status: 'ERROR', reason: 'Live x402 verification is not enabled (set APOSTLE_URL or AIT_X402_FACILITATOR_URL and ensure AIT_X402_DEV_PROOF is not "true")' };
  }

  const baseUrl = getFacilitatorUrl()!;

  try {
    const receipts = await fetchReceipts(baseUrl);

    // Match by receipt_id first, fall back to challenge_id
    const match = receipts.find((r) => {
      if (receiptId && (r.receipt_id === receiptId || r.id === receiptId)) return true;
      return r.challenge_id === challengeId;
    });

    if (!match) {
      return { ok: false, status: 'NOT_FOUND', reason: `No receipt found for challengeId=${challengeId}${receiptId ? ` / receiptId=${receiptId}` : ''}` };
    }

    if (isSettled(match.status)) {
      return {
        ok: true,
        status: 'VERIFIED',
        settledAt: (typeof match.settled_at === 'string' ? match.settled_at : null),
        amount: (typeof match.amount === 'string' ? match.amount : null),
        asset: (typeof match.asset === 'string' ? match.asset : null),
        source: baseUrl.includes('7332') ? 'apostle' : 'facilitator',
      };
    }

    const rawStatus = typeof match.status === 'string' ? match.status.toUpperCase() : 'PENDING';
    if (rawStatus === 'FAILED' || rawStatus === 'REJECTED') {
      return { ok: false, status: 'FAILED', reason: `Receipt status is ${rawStatus}` };
    }

    return { ok: false, status: 'PENDING', reason: `Receipt found but status is ${match.status ?? 'unknown'} — not yet settled` };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown error querying facilitator';
    return { ok: false, status: 'ERROR', reason };
  }
}
