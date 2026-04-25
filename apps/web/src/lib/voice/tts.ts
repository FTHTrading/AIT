import { resolveVoiceProvider } from './providers';
import type { VoiceSynthesisRequest, VoiceSynthesisResult } from './types';

export function synthesizeVoice(request: VoiceSynthesisRequest): VoiceSynthesisResult {
  const provider = resolveVoiceProvider();

  if (provider === 'disabled') {
    return {
      provider,
      supported: false,
      text: request.text,
      placeholder: true,
      reason: 'Voice is disabled by environment configuration.',
    };
  }

  if (provider !== 'browser') {
    return {
      provider,
      supported: false,
      text: request.text,
      placeholder: true,
      reason: 'External voice providers are placeholders until explicitly enabled.',
    };
  }

  return {
    provider,
    supported: true,
    text: request.text,
  };
}
