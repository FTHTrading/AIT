import { NextResponse } from 'next/server';
import {
  agentCapabilities,
  anchorRecords,
  policyDecisions,
  programmabilityRoadmap,
  protocolEventStream,
  protocolModules,
  protocolSchemas,
  x402Policies,
} from '@/data/protocol';

function buildDataset(path: string[]) {
  const [segment] = path;

  switch (segment) {
    case 'modules':
      return { modules: protocolModules };
    case 'schemas':
      return { schemas: protocolSchemas };
    case 'events':
      return { events: protocolEventStream };
    case 'policies':
      return { decisions: policyDecisions };
    case 'agents':
      return { capabilities: agentCapabilities };
    case 'anchors':
      return { anchors: anchorRecords };
    case 'roadmap':
      return { roadmap: programmabilityRoadmap };
    case 'x402':
      return { policies: x402Policies };
    default:
      return {
        modules: protocolModules,
        schemas: protocolSchemas,
        policies: policyDecisions,
        roadmap: programmabilityRoadmap,
      };
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  const dataset = buildDataset(resolved.path);
  return NextResponse.json({
    ok: true,
    namespace: 'mesh',
    route: `/api/mesh/${resolved.path.join('/')}`,
    message: 'Mesh API route active.',
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
    namespace: 'mesh',
    route: `/api/mesh/${resolved.path.join('/')}`,
    message: 'Mesh API route active.',
    dataset,
    body,
    timestamp: new Date().toISOString(),
  });
}
