import { describe, expect, it } from 'vitest';
import { siteVoiceMap } from './siteVoiceMap';
import { voiceNarrations } from './voiceNarrations';

describe('voice narration registry', () => {
  it('contains a homepage narration entry', () => {
    const home = voiceNarrations.find((entry) => entry.route === '/ait');

    expect(home).toBeDefined();
    expect(home?.publicSafe).toBe(true);
  });

  it('marks admin narration as non-public-safe', () => {
    const adminNarration = voiceNarrations.find((entry) => entry.route === '/admin/ait');

    expect(adminNarration?.publicSafe).toBe(false);
  });

  it('route voice map can be filtered to public-safe routes', () => {
    const publicRoutes = siteVoiceMap.filter((entry) => entry.publicSafe && !entry.requiresAdmin);

    expect(publicRoutes.length).toBeGreaterThan(0);
    expect(publicRoutes.some((entry) => entry.route === '/admin/ait')).toBe(false);
  });
});
