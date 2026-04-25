import { NextResponse } from 'next/server';
import { buildDocumentProofManifest } from '@/lib/ait/engine';
import { persistDocumentProof } from '@/lib/ait/workflows';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  try {
    const manifest = buildDocumentProofManifest({
      content: typeof body.content === 'string' ? body.content : undefined,
      metadata: typeof body.metadata === 'object' && body.metadata ? body.metadata : undefined,
      title: typeof body.title === 'string' ? body.title : undefined,
      fileName: typeof body.fileName === 'string' ? body.fileName : undefined,
      mimeType: typeof body.mimeType === 'string' ? body.mimeType : undefined,
      sizeBytes: typeof body.sizeBytes === 'number' ? body.sizeBytes : undefined,
      visibility: typeof body.visibility === 'string' ? body.visibility : undefined,
      publicCid: typeof body.publicCid === 'string' ? body.publicCid : undefined,
      encryptedCid: typeof body.encryptedCid === 'string' ? body.encryptedCid : undefined,
    });
    const saved = await persistDocumentProof(manifest, typeof body.encryptedPayloadRef === 'string' ? body.encryptedPayloadRef : null);

    return NextResponse.json({
      ok: true,
      route: '/api/ait/documents/hash',
      documentId: manifest.documentId,
      sha256: manifest.sha256,
      visibility: manifest.visibility,
      recommendedStoragePath: manifest.recommendedStoragePath,
      proofManifest: manifest,
      persisted: saved,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to build proof manifest';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
