import { adminVoiceEnabled } from './providers';

const privatePatterns = [
  /\bkyc\b/i,
  /passport/i,
  /social security/i,
  /ssn\b/i,
  /formula/i,
  /ratio/i,
  /dosing/i,
  /patient/i,
  /medical record/i,
  /private contract/i,
  /confidential investor/i,
];

const medicalPatterns = [/therapy/i, /clinical/i, /treat/i, /disease/i, /renal/i, /oncology/i];
const rwaPatterns = [/rwa/i, /investor/i, /token/i, /offering/i, /yield/i, /roi/i];

export type VoiceRole = 'ADMIN' | 'LEGAL_REVIEWER' | 'MEDICAL_REVIEWER' | 'REGULATORY_REVIEWER' | 'TECHNICAL_REVIEWER' | 'VIEW_ONLY' | 'ANON';

export function classifyVoiceContent(text: string) {
  if (privatePatterns.some((pattern) => pattern.test(text))) {
    return 'private';
  }

  if (medicalPatterns.some((pattern) => pattern.test(text))) {
    return 'medical';
  }

  if (rwaPatterns.some((pattern) => pattern.test(text))) {
    return 'rwa';
  }

  return 'general';
}

export function sanitizeVoiceText(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\b(FDA approved|clinically proven|guaranteed returns|active token sale)\b/gi, 'review-gated')
    .trim();
}

export function canNarrateRoute(route: string, userRole: VoiceRole = 'ANON') {
  if (route.startsWith('/admin')) {
    return adminVoiceEnabled() && userRole !== 'ANON' && userRole !== 'VIEW_ONLY';
  }

  return true;
}

export function getVoiceDisclaimer(route: string) {
  if (route.includes('/claims') || route.includes('/medical') || route.includes('/systems/ait-biofield')) {
    return 'This narration summarizes public infrastructure materials only. It is not medical advice or clinical validation.';
  }

  if (route.includes('/rwa') || route.includes('/investors')) {
    return 'This narration is not an investment offer. RWA materials require legal review.';
  }

  if (route.startsWith('/admin')) {
    return 'Admin review content may include restricted metadata. Private data is not narrated.';
  }

  return 'Public materials are for infrastructure, diligence, proof, and protocol overview only.';
}

export function safetyCheck(route: string, text: string, userRole: VoiceRole = 'ANON') {
  const allowedRoute = canNarrateRoute(route, userRole);
  const contentType = classifyVoiceContent(text);
  const blockedForContent = contentType === 'private';

  return {
    allowed: allowedRoute && !blockedForContent,
    reasons: [
      ...(allowedRoute ? [] : ['Route narration is disabled for this role or environment.']),
      ...(blockedForContent ? ['Narration text appears to contain private or restricted content.'] : []),
    ],
    sanitizedText: sanitizeVoiceText(text),
    contentType,
    disclaimer: getVoiceDisclaimer(route),
  };
}
