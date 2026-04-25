import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  return NextResponse.json({
    ok: true,
    namespace: 'agents',
    route: `/api/agents/${resolved.path.join('/')}`,
    message: 'Agent API scaffold route active.',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  const body = await req.json().catch(() => null);
  return NextResponse.json({
    ok: true,
    namespace: 'agents',
    route: `/api/agents/${resolved.path.join('/')}`,
    message: 'Agent API scaffold route active.',
    body,
    timestamp: new Date().toISOString(),
  });
}
