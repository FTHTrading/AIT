import { NextResponse } from 'next/server';
import { anchorRecords, policyDecisions, protocolEventStream, protocolModules, protocolSchemas } from '@/data/protocol';

function buildDataset(path: string[]) {
  const [segment] = path;

  switch (segment) {
    case 'modules':
    case 'register':
      return { modules: protocolModules };
    case 'schemas':
      return { schemas: protocolSchemas };
    case 'events':
      return { events: protocolEventStream };
    case 'anchors':
    case 'state-roots':
      return { anchors: anchorRecords };
    case 'policies':
      return { decisions: policyDecisions };
    default:
      return {
        modules: protocolModules,
        events: protocolEventStream,
        anchors: anchorRecords,
      };
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  const dataset = buildDataset(resolved.path);
  return NextResponse.json({
    ok: true,
    namespace: 'l1',
    route: `/api/l1/${resolved.path.join('/')}`,
    message: 'L1 API route active.',
    dataset,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  const body = await req.json().catch(() => null);
  const dataset = buildDataset(resolved.path);
  return NextResponse.json({
    ok: true,
    namespace: 'l1',
    route: `/api/l1/${resolved.path.join('/')}`,
    message: 'L1 API route active.',
    dataset,
    body,
    timestamp: new Date().toISOString(),
  });
}
