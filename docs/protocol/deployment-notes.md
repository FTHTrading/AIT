# Deployment Notes

## Local Development

```powershell
cd apps/web
npm install
npx next dev
```

## Build Commands

```powershell
cd apps/web
npx next build
```

## Environment Variables

- `AIT_STORAGE_BACKEND` (`file` or `prisma`)
- `AIT_ADMIN_USERS_JSON`
- `AIT_SESSION_SECRET`
- `AIT_SESSION_TTL_SECONDS`
- `AIT_ADMIN_TOKEN` (legacy header compatibility path)
- `AIT_X402_DEV_PROOF`
- `IPFS_API_URL`, `PINATA_JWT`, `WEB3_STORAGE_TOKEN`
- `ENABLE_POLYGON_BROADCAST`, `ENABLE_XRPL_BROADCAST`, `ENABLE_UNYKORN_BROADCAST`

## File-Backed Store Warning

Current durable fallback persists to:

- `apps/web/.data/ait-review-store.json`

This is suitable for demos and controlled environments, not for multi-instance production deployments.

## Planned Prisma/Postgres Migration

- Keep repository abstraction (`aitRepository`) as the control surface.
- Generate Prisma client with AIT delegates present.
- Switch `AIT_STORAGE_BACKEND=prisma` in staged rollout.
- Verify admin, audit, and meter record read/write parity before cutover.

## Adapter Flags

- IPFS live upload behavior is flag-driven by IPFS provider envs.
- Anchor broadcast behavior is disabled by default and enabled per chain flag.
- x402 development verification must be disabled in production (`AIT_X402_DEV_PROOF=false`).

## Deployment Target

- Recommended: managed Node runtime with secure secret injection and private storage.
- Keep admin routes behind authenticated edge/network controls.

## Rollback Plan

1. Disable broadcast flags.
2. Disable production x402 verification mode if needed.
3. Revert to known good release tag.
4. Restore store/database snapshot.
5. Re-run smoke checks for proof, claims, RWA, x402, and admin routes.
