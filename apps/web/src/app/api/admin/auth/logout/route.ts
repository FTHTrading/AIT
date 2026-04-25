import { NextResponse } from 'next/server';
import { AIT_ADMIN_SESSION_COOKIE } from '@/lib/ait/session';

export async function POST(req: Request) {
  const response = NextResponse.redirect(new URL('/admin/login', req.url));
  response.cookies.set(AIT_ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  });
  return response;
}