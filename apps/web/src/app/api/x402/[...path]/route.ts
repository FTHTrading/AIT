import { NextResponse } from 'next/server';
import { x402Policies } from '@/data/protocol';

const x402ChallengeTemplate = {
  challengeId: 'x402-challenge-demo',
  status: 'PENDING',
  settlementRail: 'x402',
  receiptMode: 'hash-anchored',
};

function buildDataset(path: string[]) {
  const [segment] = path;

  switch (segment) {
    case 'policies':
      return { policies: x402Policies };
    case 'challenge':
    case 'invoice':
      return { challenge: x402ChallengeTemplate, policies: x402Policies };
    case 'receipts':
      return {
        receipts: [
          {
            receiptId: 'x402-receipt-demo-001',
            route: '/api/agents/rag/query',
            amountUsd: 0.01,
            status: 'VERIFIED',
          },
        ],
      };
    default:
      return { policies: x402Policies, challenge: x402ChallengeTemplate };
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  const dataset = buildDataset(resolved.path);
  return NextResponse.json({
    ok: true,
    namespace: 'x402',
    route: `/api/x402/${resolved.path.join('/')}`,
    message: 'x402 API route active.',
    dataset,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  const body = await req.json().catch(() => null);
  const dataset = buildDataset(resolved.path);
  return NextResponse.json({
    ok: true,
    namespace: 'x402',
    route: `/api/x402/${resolved.path.join('/')}`,
    message: 'x402 API route active.',
    dataset,
    body,
    timestamp: new Date().toISOString(),
  });
}
