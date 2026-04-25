import { NextResponse } from 'next/server';
import { siteVoiceMap } from '@/data/ait/siteVoiceMap';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const includeAdmin = url.searchParams.get('includeAdmin') === 'true';
  const items = includeAdmin ? siteVoiceMap : siteVoiceMap.filter((entry) => entry.publicSafe && !entry.requiresAdmin);

  return NextResponse.json({
    ok: true,
    route: '/api/voice/routes',
    count: items.length,
    items,
  });
}
