import { NextResponse } from 'next/server';
import { prepareAnchorAdapterPayload } from '@/lib/ait/adapters';
import { isChainSigningEnabled, signAnchorPayload } from '@/lib/ait/chain-signing';
import { buildAnchorPayload, buildExamplePayloads } from '@/lib/ait/engine';
import { persistAnchorPayload } from '@/lib/ait/workflows';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/anchors/unykorn',
    anchorPayload: buildExamplePayloads().unykornAnchor,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const merkleRoot = typeof body.merkleRoot === 'string' ? body.merkleRoot : '';

  if (!merkleRoot) {
    return NextResponse.json({ ok: false, error: 'merkleRoot is required' }, { status: 400 });
  }

  const anchorPayload = buildAnchorPayload({
    chain: 'unykorn-l1',
    merkleRoot,
    moduleId: typeof body.moduleId === 'string' ? body.moduleId : undefined,
    eventType: typeof body.eventType === 'string' ? body.eventType : undefined,
    network: typeof body.network === 'string' ? body.network : undefined,
  });
  const adapterPayload = prepareAnchorAdapterPayload(anchorPayload);
  const signingResult = isChainSigningEnabled() ? signAnchorPayload(adapterPayload.dataField ?? merkleRoot) : null;
  const anchorId = typeof body.anchorId === 'string' ? body.anchorId : `anchor-unykorn-${anchorPayload.merkleRoot.slice(0, 12)}`;
  const saved = await persistAnchorPayload(anchorId, adapterPayload, typeof body.batchId === 'string' ? body.batchId : null);

  return NextResponse.json({
    ok: true,
    route: '/api/anchors/unykorn',
    anchorPayload: adapterPayload,
    signing: signingResult,
    persisted: saved,
  });
}