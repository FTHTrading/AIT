import type { VoiceProviderMode } from './types';

export function voiceEnabled() {
  return process.env.AIT_VOICE_ENABLED !== 'false';
}

export function externalVoiceEnabled() {
  return process.env.AIT_VOICE_EXTERNAL_ENABLED === 'true';
}

export function adminVoiceEnabled() {
  return process.env.AIT_VOICE_ALLOW_ADMIN === 'true';
}

export function resolveVoiceProvider(): VoiceProviderMode {
  if (!voiceEnabled()) {
    return 'disabled';
  }

  const configured = process.env.AIT_VOICE_PROVIDER;

  if (
    configured === 'browser' ||
    configured === 'disabled' ||
    configured === 'elevenlabs-placeholder' ||
    configured === 'openai-tts-placeholder' ||
    configured === 'local-tts-placeholder'
  ) {
    return configured;
  }

  return 'browser';
}
