import { NextResponse } from 'next/server';
import { buildExamplePayloads, classifyClaim } from '@/lib/ait/engine';
import { persistClaimReview } from '@/lib/ait/workflows';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/ait/claims/classify',
    example: buildExamplePayloads().claimReview,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  try {
    const claimReview = classifyClaim({ claimText: typeof body.claimText === 'string' ? body.claimText : '' });
    const saved = await persistClaimReview(claimReview);
    return NextResponse.json({
      ok: true,
      route: '/api/ait/claims/classify',
      claimReview,
      persisted: saved,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to classify claim';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}