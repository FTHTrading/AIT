import { NextResponse } from 'next/server';
import { authenticateAdminCredentials, buildSessionCookieValue } from '@/lib/ait/access';
import { AIT_ADMIN_SESSION_COOKIE } from '@/lib/ait/session';

async function readCredentials(req: Request) {
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = await req.json().catch(() => ({}));
    return {
      username: typeof body.username === 'string' ? body.username : '',
      password: typeof body.password === 'string' ? body.password : '',
      next: typeof body.next === 'string' ? body.next : '/admin/ait',
      wantsJson: true,
    };
  }

  const form = await req.formData().catch(() => null);

  return {
    username: typeof form?.get('username') === 'string' ? String(form?.get('username')) : '',
    password: typeof form?.get('password') === 'string' ? String(form?.get('password')) : '',
    next: typeof form?.get('next') === 'string' ? String(form?.get('next')) : '/admin/ait',
    wantsJson: false,
  };
}

export async function POST(req: Request) {
  const credentials = await readCredentials(req);
  const session = authenticateAdminCredentials(credentials.username, credentials.password);

  if (!session) {
    if (credentials.wantsJson) {
      return NextResponse.json({ ok: false, error: 'invalid credentials' }, { status: 401 });
    }

    return NextResponse.redirect(new URL('/admin/login?error=invalid', req.url));
  }

  const target = credentials.next.startsWith('/admin') ? credentials.next : '/admin/ait';
  const response = credentials.wantsJson
    ? NextResponse.json({ ok: true, next: target, session: { username: session.username, role: session.role } })
    : NextResponse.redirect(new URL(target, req.url));

  response.cookies.set(AIT_ADMIN_SESSION_COOKIE, buildSessionCookieValue(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(session.expiresAt),
  });

  return response;
}