import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { verifyOidcBearerToken } from './oidc-auth';
import { AIT_ADMIN_SESSION_COOKIE } from './session';
import type { AdminRole, AdminSession } from './types';

export type { AdminSession };

export const ADMIN_ROLES: AdminRole[] = [
  'ADMIN',
  'LEGAL_REVIEWER',
  'MEDICAL_REVIEWER',
  'REGULATORY_REVIEWER',
  'TECHNICAL_REVIEWER',
  'VIEW_ONLY',
];

interface AdminCredentialRecord {
  username: string;
  password: string;
  role: AdminRole;
  displayName?: string;
}

const legacyRoleMap: Record<string, AdminRole> = {
  'ait-admin': 'ADMIN',
  'ait-reviewer': 'TECHNICAL_REVIEWER',
  viewer: 'VIEW_ONLY',
};

function sessionSecret() {
  return process.env.AIT_SESSION_SECRET || process.env.AIT_ADMIN_TOKEN || 'dev-ait-admin-secret';
}

function sessionTtlSeconds() {
  const parsed = Number(process.env.AIT_SESSION_TTL_SECONDS ?? '43200');
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 43200;
}

function parseRole(value: unknown): AdminRole | null {
  return typeof value === 'string' && ADMIN_ROLES.includes(value as AdminRole) ? (value as AdminRole) : null;
}

function encodePayload(session: AdminSession) {
  return Buffer.from(JSON.stringify(session)).toString('base64url');
}

function signPayload(payload: string) {
  return createHmac('sha256', sessionSecret()).update(payload).digest('hex');
}

function parseCookieHeader(header: string | null) {
  if (!header) {
    return {} as Record<string, string>;
  }

  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...rest] = part.split('=');
        return [key, decodeURIComponent(rest.join('='))];
      }),
  );
}

function verifySessionToken(token?: string | null): AdminSession | null {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split('.');

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);

  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AdminSession;

    if (!session?.username || !session?.expiresAt || !parseRole(session.role)) {
      return null;
    }

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

function resolveCredentials(): AdminCredentialRecord[] {
  const raw = process.env.AIT_ADMIN_USERS_JSON;

  if (!raw) {
    return process.env.NODE_ENV === 'production'
      ? []
      : [
          {
            username: 'dev-admin',
            password: 'dev-admin',
            role: 'ADMIN',
            displayName: 'Development Admin',
          },
        ];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((entry) => {
      if (!entry || typeof entry !== 'object') {
        return [];
      }

      const role = parseRole((entry as { role?: unknown }).role);
      const username = (entry as { username?: unknown }).username;
      const password = (entry as { password?: unknown }).password;

      if (!role || typeof username !== 'string' || typeof password !== 'string') {
        return [];
      }

      return [
        {
          username,
          password,
          role,
          displayName:
            typeof (entry as { displayName?: unknown }).displayName === 'string'
              ? (entry as { displayName?: string }).displayName
              : username,
        },
      ];
    });
  } catch {
    return [];
  }
}

export function roleAllows(role: AdminRole, allowedRoles: AdminRole[]) {
  return allowedRoles.includes(role) || role === 'ADMIN';
}

export function buildSessionCookieValue(session: AdminSession) {
  const payload = encodePayload(session);
  return `${payload}.${signPayload(payload)}`;
}

export function createAdminSession(username: string, role: AdminRole, displayName?: string): AdminSession {
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + sessionTtlSeconds() * 1000);

  return {
    username,
    displayName: displayName || username,
    role,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

export function authenticateAdminCredentials(username: string, password: string): AdminSession | null {
  const record = resolveCredentials().find((candidate) => candidate.username === username && candidate.password === password);

  if (!record) {
    return null;
  }

  return createAdminSession(record.username, record.role, record.displayName);
}

export async function getAdminSessionFromCookies() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(AIT_ADMIN_SESSION_COOKIE)?.value ?? null);
}

export async function getAdminSessionFromRequest(req: Request): Promise<AdminSession | null> {
  const cookieSession = verifySessionToken(parseCookieHeader(req.headers.get('cookie'))[AIT_ADMIN_SESSION_COOKIE]);

  if (cookieSession) {
    return cookieSession;
  }

  // OIDC Bearer token (external identity provider)
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7);
    const oidcSession = await verifyOidcBearerToken(bearerToken);
    if (oidcSession) {
      return oidcSession;
    }
  }

  const headerRole = req.headers.get('x-ait-admin-role');
  const mappedRole = headerRole ? legacyRoleMap[headerRole] ?? parseRole(headerRole) : null;
  const token = req.headers.get('x-ait-admin-token');

  if (mappedRole && process.env.AIT_ADMIN_TOKEN && token === process.env.AIT_ADMIN_TOKEN) {
    return createAdminSession(req.headers.get('x-ait-admin-user') || 'legacy-admin', mappedRole, 'Legacy Header Admin');
  }

  if (mappedRole && process.env.NODE_ENV !== 'production') {
    return createAdminSession(req.headers.get('x-ait-admin-user') || 'dev-header-admin', mappedRole, 'Development Header Admin');
  }

  return null;
}

export async function requireAdminPageAccess(allowedRoles: AdminRole[] = ADMIN_ROLES) {
  const session = await getAdminSessionFromCookies();

  if (!session) {
    redirect('/admin/login?error=signin');
  }

  if (!roleAllows(session.role, allowedRoles)) {
    redirect('/admin/login?error=unauthorized');
  }

  return session;
}

export function forbidAdminRead(message = 'admin auth required') {
  return NextResponse.json({ ok: false, error: message }, { status: 401 });
}

export function forbidAdminWrite(message = 'admin write access required') {
  return NextResponse.json({ ok: false, error: message }, { status: 403 });
}

export async function requireAdminApiAccess(req: Request, allowedRoles: AdminRole[] = ADMIN_ROLES) {
  const session = await getAdminSessionFromRequest(req);

  if (!session) {
    return forbidAdminRead();
  }

  if (!roleAllows(session.role, allowedRoles)) {
    return forbidAdminWrite();
  }

  return session;
}

export async function hasAdminWriteAccess(req: Request, allowedRoles: AdminRole[] = ['ADMIN', 'LEGAL_REVIEWER', 'MEDICAL_REVIEWER', 'REGULATORY_REVIEWER', 'TECHNICAL_REVIEWER']) {
  const session = await getAdminSessionFromRequest(req);
  return session ? roleAllows(session.role, allowedRoles) : false;
}