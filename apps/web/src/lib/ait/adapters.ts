import type { AnchorPayload } from './types';

export const x402PaidRouteExamples = [
  '/api/anchors/verify',
  '/api/ait/claims/evidence',
  '/api/ait/rwa/packages',
  '/api/demo/investor-data-room',
  '/api/anchors/verify/proof',
];

export function prepareAnchorAdapterPayload(anchorPayload: AnchorPayload) {
  if (anchorPayload.broadcastEnabled) {
    return {
      ...anchorPayload,
      status: anchorPayload.unsigned ? 'READY_FOR_SIGNING' : 'BROADCAST_SENT',
    } satisfies AnchorPayload;
  }

  return {
    ...anchorPayload,
    status: 'BROADCAST_DISABLED',
  } satisfies AnchorPayload;
}

export function resolveIpfsAdapterStatus(input: { placeholder: boolean; hasEncryptedPayload: boolean; liveUploadConfigured: boolean }) {
  if (input.liveUploadConfigured) {
    return 'READY_FOR_UPLOAD' as const;
  }

  if (input.placeholder || input.hasEncryptedPayload) {
    return 'MOCK_ONLY' as const;
  }

  return 'READY_FOR_UPLOAD' as const;
}

export function isDevelopmentProofModeEnabled() {
  return process.env.AIT_X402_DEV_PROOF === 'true' || (process.env.AIT_X402_DEV_PROOF == null && process.env.NODE_ENV !== 'production');
}