import { NextResponse } from 'next/server';
import { buildExamplePayloads, buildRwaPackage } from '@/lib/ait/engine';
import { persistRwaPackage } from '@/lib/ait/workflows';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/ait/rwa/packages',
    example: buildExamplePayloads().rwaPackage,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const packageRecord = buildRwaPackage({
    assetType: typeof body.assetType === 'string' ? body.assetType : undefined,
    title: typeof body.title === 'string' ? body.title : undefined,
    moduleId: typeof body.moduleId === 'string' ? body.moduleId : undefined,
    metadata: typeof body.metadata === 'object' && body.metadata ? body.metadata : undefined,
  });
  const saved = await persistRwaPackage(packageRecord);

  return NextResponse.json({
    ok: true,
    route: '/api/ait/rwa/packages',
    package: packageRecord,
    persisted: saved,
  });
}