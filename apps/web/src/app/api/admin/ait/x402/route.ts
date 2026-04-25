import { NextResponse } from 'next/server';
import { requireAdminApiAccess } from '@/lib/ait/access';
import { aitRepository } from '@/lib/ait/repository';

export async function GET(req: Request) {
  const session = await requireAdminApiAccess(req);

  if (session instanceof NextResponse) {
    return session;
  }

  return NextResponse.json({
    ok: true,
    route: '/api/admin/ait/x402',
    actor: session.username,
    challenges: await aitRepository.listX402Challenges(),
    receipts: await aitRepository.listX402Receipts(),
  });
}