/**
 * Prisma client singleton for Next.js.
 *
 * In production a single PrismaClient instance is used for the lifetime of
 * the process.  In development, Next.js hot-reload spins the module up
 * repeatedly, so we cache the client on the global object to avoid exhausting
 * the Postgres connection pool.
 *
 * Activated when `AIT_STORAGE_BACKEND=prisma` AND `DATABASE_URL` are set.
 */

import type { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __aitPrismaClient: PrismaClient | undefined;
}

let _client: PrismaClient | null = null;

function createClient(): PrismaClient {
  const { PrismaClient: PC } = require('@prisma/client') as { PrismaClient: typeof PrismaClient };
  return new PC({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

/**
 * Returns a PrismaClient singleton.  Returns `null` if Prisma is not
 * available (package not installed or client not generated yet).
 */
export function getAitPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    if (process.env.NODE_ENV === 'production') {
      if (!_client) {
        _client = createClient();
      }
      return _client;
    }

    // Development: use global to survive hot-reload
    if (!globalThis.__aitPrismaClient) {
      globalThis.__aitPrismaClient = createClient();
    }
    return globalThis.__aitPrismaClient;
  } catch {
    return null;
  }
}
