import { NextResponse } from 'next/server';
import { buildExamplePayloads, buildX402Challenge } from '@/lib/ait/engine';
import { persistX402Challenge } from '@/lib/ait/workflows';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/x402/challenge',
    example: buildExamplePayloads().x402Challenge,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const challenge = buildX402Challenge({
    route: typeof body.route === 'string' ? body.route : undefined,
    amount: typeof body.amount === 'number' ? body.amount : undefined,
    asset: typeof body.asset === 'string' ? body.asset : undefined,
    ttlSeconds: typeof body.ttlSeconds === 'number' ? body.ttlSeconds : undefined,
  });
  const saved = await persistX402Challenge(challenge);

  return NextResponse.json({
    ok: true,
    route: '/api/x402/challenge',
    challenge,
    persisted: saved,
  });
}