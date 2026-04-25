import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AIT_ADMIN_SESSION_COOKIE } from '@/lib/ait/session';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/admin/auth') || pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  if (!pathname.startsWith('/admin/ait') && !pathname.startsWith('/api/admin/ait')) {
    return NextResponse.next();
  }

  if (req.cookies.get(AIT_ADMIN_SESSION_COOKIE)?.value) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin/ait')) {
    return NextResponse.json({ ok: false, error: 'admin auth required' }, { status: 401 });
  }

  const loginUrl = new URL('/admin/login', req.url);
  loginUrl.searchParams.set('error', 'signin');
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/ait/:path*', '/api/admin/ait/:path*', '/admin/login'],
};