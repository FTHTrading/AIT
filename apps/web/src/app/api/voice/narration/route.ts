import { NextResponse } from 'next/server';
import { getNarrationByRoute } from '@/data/ait/voiceNarrations';
import { resolveVoiceProvider } from '@/lib/voice/providers';
import { canNarrateRoute, getVoiceDisclaimer, type VoiceRole } from '@/lib/voice/safety';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const route = typeof body.route === 'string' ? body.route : '/ait';
  const role = (typeof body.userRole === 'string' ? body.userRole : 'ANON') as VoiceRole;
  const narration = getNarrationByRoute(route);

  if (!canNarrateRoute(route, role)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Route narration is not allowed for this role or environment.',
        route,
        providerMode: resolveVoiceProvider(),
      },
      { status: 403 },
    );
  }

  return NextResponse.json({
    ok: true,
    route: '/api/voice/narration',
    providerMode: resolveVoiceProvider(),
    narration: narration || null,
    disclaimer: getVoiceDisclaimer(route),
    publicSafe: narration ? narration.publicSafe : true,
  });
}
