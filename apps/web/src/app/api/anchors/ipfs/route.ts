import { NextResponse } from 'next/server';
import { resolveIpfsAdapterStatus } from '@/lib/ait/adapters';
import { buildDocumentProofManifest, buildExamplePayloads, buildIpfsPayload } from '@/lib/ait/engine';
import { isLiveIpfsEnabled, uploadToIpfs } from '@/lib/ait/ipfs-upload';
import { enforcePrivateVaultBoundary } from '@/lib/ait/privacy';
import { persistDocumentProof, persistIpfsPayload } from '@/lib/ait/workflows';

export async function GET() {
  const example = buildExamplePayloads();
  return NextResponse.json({
    ok: true,
    route: '/api/anchors/ipfs',
    payload: buildIpfsPayload({
      manifest: example.documentManifest,
      encryptedPayload: 'base64:encrypted-placeholder',
      metadata: { scope: 'example' },
    }),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  try {
    const manifest = body.manifest && typeof body.manifest === 'object'
      ? body.manifest
      : buildDocumentProofManifest({
          content: typeof body.content === 'string' ? body.content : undefined,
          metadata: typeof body.metadata === 'object' && body.metadata ? body.metadata : undefined,
          title: typeof body.title === 'string' ? body.title : undefined,
          fileName: typeof body.fileName === 'string' ? body.fileName : undefined,
          mimeType: typeof body.mimeType === 'string' ? body.mimeType : undefined,
          sizeBytes: typeof body.sizeBytes === 'number' ? body.sizeBytes : undefined,
          visibility: typeof body.visibility === 'string' ? body.visibility : undefined,
        });
    const privacyBoundary = enforcePrivateVaultBoundary({
      visibility: manifest.visibility,
      metadata: typeof body.metadata === 'object' && body.metadata ? (body.metadata as Record<string, unknown>) : undefined,
      payload: typeof body.payload === 'object' && body.payload ? (body.payload as Record<string, unknown>) : null,
      encryptedPayload: typeof body.encryptedPayload === 'string' ? body.encryptedPayload : null,
      encryptedPayloadRef: typeof body.encryptedPayloadRef === 'string' ? body.encryptedPayloadRef : null,
    });

    if (!privacyBoundary.ok) {
      return NextResponse.json({ ok: false, error: privacyBoundary.error }, { status: 400 });
    }

    await persistDocumentProof(manifest, typeof body.encryptedPayloadRef === 'string' ? body.encryptedPayloadRef : null);
    const result = buildIpfsPayload({
      manifest,
      metadata: typeof body.metadata === 'object' && body.metadata ? body.metadata : undefined,
      encryptedPayload: typeof body.encryptedPayload === 'string' ? body.encryptedPayload : undefined,
    });

    // Attempt live IPFS upload when provider is configured and payload is public-safe
    let liveCid: string | null = null;
    let liveProvider: string | null = null;
    let liveUrl: string | null = null;
    if (isLiveIpfsEnabled() && result.payload && privacyBoundary.ok) {
      const uploadResult = await uploadToIpfs(result.payload);
      if (uploadResult.ok) {
        liveCid = uploadResult.cid;
        liveProvider = uploadResult.provider;
        liveUrl = uploadResult.url;
      }
    }

    const finalCid = liveCid ?? result.cid;
    const adapterStatus = resolveIpfsAdapterStatus({
      placeholder: !liveCid && Boolean(result.placeholder),
      hasEncryptedPayload: typeof body.encryptedPayload === 'string' || typeof body.encryptedPayloadRef === 'string',
      liveUploadConfigured: isLiveIpfsEnabled(),
    });
    const saved = await persistIpfsPayload({
      ipfsId: typeof body.ipfsId === 'string' ? body.ipfsId : `ipfs-${manifest.documentId}`,
      documentId: manifest.documentId,
      visibility: manifest.visibility,
      cid: finalCid,
      placeholder: liveCid ? false : Boolean(result.placeholder),
      payload: result.payload as Record<string, unknown> | null,
      encryptedPayloadRef: typeof body.encryptedPayloadRef === 'string' ? body.encryptedPayloadRef : null,
      proofHash: manifest.sha256,
      reviewStatus: result.status === 'ENCRYPTION_REQUIRED' ? 'PENDING_REVIEW' : manifest.visibility === 'public' ? 'READY_FOR_ANCHOR' : 'PENDING_REVIEW',
      recommendedAction: result.status === 'ENCRYPTION_REQUIRED'
        ? 'Encryption required before storing non-public payload off vault.'
        : liveCid
        ? `Live IPFS upload successful via ${liveProvider}. CID: ${liveCid}`
        : result.placeholder
        ? 'Mock-only IPFS record created. Replace placeholder CID with live IPFS upload once environment flags are configured.'
        : 'Review payload and CID for anchor readiness.',
    });

    return NextResponse.json({
      ok: true,
      route: '/api/anchors/ipfs',
      adapterStatus,
      result: { ...result, cid: finalCid, placeholder: liveCid ? null : result.placeholder },
      liveUpload: liveCid ? { cid: liveCid, provider: liveProvider, url: liveUrl } : null,
      persisted: saved,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to prepare IPFS payload';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}