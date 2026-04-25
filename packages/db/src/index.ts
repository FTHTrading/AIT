// ─── BIOFIELD DB Client ───
// Re-exports the generated Prisma client for use across packages.

export { PrismaClient } from '@prisma/client';
export type { Prisma } from '@prisma/client';

let _client: InstanceType<typeof import('@prisma/client').PrismaClient> | undefined;

/** Singleton Prisma client — reused across hot reloads in dev. */
export function getDbClient() {
  if (!_client) {
    const { PrismaClient } = require('@prisma/client');
    _client = new PrismaClient();
  }
  return _client!;
}
