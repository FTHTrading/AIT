import { NextResponse } from 'next/server';
import { buildExamplePayloads, buildMerkleProof } from '@/lib/ait/engine';
import { persistMerkleBatch } from '@/lib/ait/workflows';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/anchors/merkle',
    example: buildExamplePayloads().merkleProof,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  try {
    const proof = buildMerkleProof(Array.isArray(body.hashes) ? body.hashes : []);
    const batchId = typeof body.batchId === 'string' ? body.batchId : `merkle-${proof.root.slice(0, 12)}`;
    const saved = await persistMerkleBatch(batchId, proof, Array.isArray(body.documentIds) ? body.documentIds : []);
    return NextResponse.json({ ok: true, route: '/api/anchors/merkle', ...proof, batchId, persisted: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to build Merkle proof';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}