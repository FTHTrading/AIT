import { NextResponse } from 'next/server';
import { requireAdminApiAccess } from '@/lib/ait/access';
import { getAdminSnapshot } from '@/lib/ait/admin';

export async function GET(req: Request) {
  const session = await requireAdminApiAccess(req);

  if (session instanceof NextResponse) {
    return session;
  }

  const snapshot = await getAdminSnapshot();

  return NextResponse.json({
    ok: true,
    route: '/api/admin/ait/reviews',
    actor: session.username,
    reviews: snapshot.adminReviews,
  });
}