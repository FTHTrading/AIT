export type VoiceProviderMode = 'browser' | 'disabled' | 'elevenlabs-placeholder' | 'openai-tts-placeholder' | 'local-tts-placeholder';

export interface VoiceSynthesisRequest {
  text: string;
  route?: string;
}

export interface VoiceSynthesisResult {
  provider: VoiceProviderMode;
  supported: boolean;
  text: string;
  placeholder?: boolean;
  reason?: string;
}
