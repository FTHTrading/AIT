import { NextResponse } from 'next/server';
import { buildClaimEvidence, buildExamplePayloads } from '@/lib/ait/engine';
import { persistEvidenceRequest } from '@/lib/ait/workflows';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/ait/claims/evidence',
    example: buildClaimEvidence(buildExamplePayloads().claimReview.claimText),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  try {
    const evidence = buildClaimEvidence(typeof body.claimText === 'string' ? body.claimText : '');
    const saved = await persistEvidenceRequest({
      claimId: evidence.claimId,
      evidenceChecklist: evidence.evidenceChecklist,
      disclaimer: evidence.disclaimer,
      reviewStatus: evidence.reviewStatus,
    });
    return NextResponse.json({
      ok: true,
      route: '/api/ait/claims/evidence',
      evidence,
      persisted: saved,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to build evidence checklist';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}