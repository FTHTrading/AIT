import { NextResponse } from 'next/server';
import { buildExamplePayloads, buildRwaWaterfall } from '@/lib/ait/engine';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/ait/rwa/waterfall',
    example: buildExamplePayloads().rwaWaterfall,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  return NextResponse.json({
    ok: true,
    route: '/api/ait/rwa/waterfall',
    waterfall: buildRwaWaterfall(typeof body.assetType === 'string' ? body.assetType : undefined),
  });
}