import { describe, expect, it } from 'vitest';
import { getAdminSessionFromRequest, roleAllows } from './access';

describe('AIT admin access', () => {
  it('enforces role checks', () => {
    expect(roleAllows('ADMIN', ['TECHNICAL_REVIEWER'])).toBe(true);
    expect(roleAllows('VIEW_ONLY', ['TECHNICAL_REVIEWER'])).toBe(false);
  });

  it('requires admin token for legacy headers in production mode', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalAdminToken = process.env.AIT_ADMIN_TOKEN;

    process.env.NODE_ENV = 'production';
    process.env.AIT_ADMIN_TOKEN = 'secure-token';

    const unauthorizedRequest = new Request('http://localhost/api/admin/ait/reviews', {
      headers: {
        'x-ait-admin-role': 'ait-admin',
      },
    });

    const authorizedRequest = new Request('http://localhost/api/admin/ait/reviews', {
      headers: {
        'x-ait-admin-role': 'ait-admin',
        'x-ait-admin-token': 'secure-token',
        'x-ait-admin-user': 'release-admin',
      },
    });

    const unauthorizedSession = await getAdminSessionFromRequest(unauthorizedRequest);
    const authorizedSession = await getAdminSessionFromRequest(authorizedRequest);

    process.env.NODE_ENV = originalNodeEnv;
    process.env.AIT_ADMIN_TOKEN = originalAdminToken;

    expect(unauthorizedSession).toBeNull();
    expect(authorizedSession?.role).toBe('ADMIN');
  });
});