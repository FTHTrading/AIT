import { NextResponse } from 'next/server';
import { buildExamplePayloads, verifyAnchorPayload } from '@/lib/ait/engine';

export async function GET() {
  const example = buildExamplePayloads();
  return NextResponse.json({
    ok: true,
    route: '/api/anchors/verify',
    verification: verifyAnchorPayload({ anchorPayload: example.polygonAnchor, merkleProof: example.merkleProof }),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  if (!body.anchorPayload || typeof body.anchorPayload !== 'object') {
    return NextResponse.json({ ok: false, error: 'anchorPayload is required' }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    route: '/api/anchors/verify',
    verification: verifyAnchorPayload({
      anchorPayload: body.anchorPayload,
      merkleProof: body.merkleProof,
      leaf: typeof body.leaf === 'string' ? body.leaf : undefined,
      proofIndex: typeof body.proofIndex === 'number' ? body.proofIndex : undefined,
    }),
  });
}