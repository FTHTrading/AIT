import { describe, expect, it } from 'vitest';
import { canNarrateRoute, getVoiceDisclaimer, safetyCheck } from './safety';

describe('voice safety', () => {
  it('blocks private and KYC-like text', () => {
    const result = safetyCheck('/ait/docs', 'This includes private KYC passport details and formula ratio data.', 'ANON');

    expect(result.allowed).toBe(false);
    expect(result.contentType).toBe('private');
  });

  it('includes medical disclaimer for medical routes', () => {
    const disclaimer = getVoiceDisclaimer('/ait/claims');

    expect(disclaimer.toLowerCase()).toContain('not medical advice');
  });

  it('includes legal disclaimer for rwa routes', () => {
    const disclaimer = getVoiceDisclaimer('/ait/rwa');

    expect(disclaimer.toLowerCase()).toContain('not an investment offer');
  });

  it('requires admin voice flag for admin narration', () => {
    const allowed = canNarrateRoute('/admin/ait', 'ADMIN');

    expect(allowed).toBe(false);
  });
});
