import { NextResponse } from 'next/server';
import { safetyCheck, type VoiceRole } from '@/lib/voice/safety';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const route = typeof body.route === 'string' ? body.route : '/ait';
  const text = typeof body.text === 'string' ? body.text : '';
  const role = (typeof body.userRole === 'string' ? body.userRole : 'ANON') as VoiceRole;

  return NextResponse.json({
    ok: true,
    route: '/api/voice/safety-check',
    result: safetyCheck(route, text, role),
  });
}
