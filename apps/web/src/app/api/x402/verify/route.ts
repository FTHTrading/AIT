import { NextResponse } from 'next/server';
import { isDevelopmentProofModeEnabled } from '@/lib/ait/adapters';
import { buildExamplePayloads, buildX402Challenge, verifyX402Challenge } from '@/lib/ait/engine';
import { isLiveX402VerificationEnabled, verifyX402Receipt } from '@/lib/ait/x402-verifier';

export async function GET() {
  const example = buildExamplePayloads().x402Challenge;
  return NextResponse.json({
    ok: true,
    route: '/api/x402/verify',
    liveVerificationEnabled: isLiveX402VerificationEnabled(),
    example: verifyX402Challenge({ challenge: example, proof: 'dev-pass' }),
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

  const developmentProofMode = isDevelopmentProofModeEnabled();

  // Live settlement-backed verification path
  if (isLiveX402VerificationEnabled()) {
    const receiptId = typeof body.receiptId === 'string' ? body.receiptId : null;
    const challengeId = typeof challenge.challengeId === 'string' ? challenge.challengeId : (typeof body.challengeId === 'string' ? body.challengeId : '');
    const liveResult = await verifyX402Receipt(receiptId, challengeId);
    return NextResponse.json({
      ok: liveResult.ok,
      route: '/api/x402/verify',
      developmentProofMode: false,
      verification: liveResult,
    }, { status: liveResult.ok ? 200 : 402 });
  }

  // Development proof mode fallback
  return NextResponse.json({
    ok: true,
    route: '/api/x402/verify',
    developmentProofMode,
    verification: verifyX402Challenge({
      challenge,
      proof: typeof body.proof === 'string' ? body.proof : undefined,
    }),
  });
}