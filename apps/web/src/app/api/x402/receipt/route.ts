import { NextResponse } from 'next/server';
import { buildExamplePayloads, buildX402Challenge, buildX402Receipt } from '@/lib/ait/engine';
import { persistX402Challenge, persistX402Receipt } from '@/lib/ait/workflows';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/x402/receipt',
    example: buildExamplePayloads().x402Receipt,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const challenge = body.challenge && typeof body.challenge === 'object'
    ? body.challenge
    : buildX402Challenge({
        route: typeof body.route === 'string' ? body.route : undefined,
        amount: typeof body.amount === 'number' ? body.amount : undefined,
        asset: typeof body.asset === 'string' ? body.asset : undefined,
      });
  const receipt = buildX402Receipt(challenge, typeof body.units === 'number' ? body.units : 1);
  await persistX402Challenge(challenge);
  const saved = await persistX402Receipt(receipt);

  return NextResponse.json({
    ok: true,
    route: '/api/x402/receipt',
    receipt,
    persisted: saved,
  });
}