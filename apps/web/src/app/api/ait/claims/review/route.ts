import { NextResponse } from 'next/server';
import { buildExamplePayloads, reviewClaim } from '@/lib/ait/engine';
import { persistClaimReview } from '@/lib/ait/workflows';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/ait/claims/review',
    example: reviewClaim({ claimText: buildExamplePayloads().claimReview.claimText, requestedStatus: 'READY_FOR_ANCHOR' }),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  try {
    const claimReview = reviewClaim({
      claimText: typeof body.claimText === 'string' ? body.claimText : '',
      requestedStatus: typeof body.requestedStatus === 'string' ? body.requestedStatus : undefined,
    });
    const saved = await persistClaimReview(claimReview);
    return NextResponse.json({
      ok: true,
      route: '/api/ait/claims/review',
      claimReview,
      persisted: saved,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to review claim';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}