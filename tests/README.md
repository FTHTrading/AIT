# Tests

This top-level directory is reserved for future AIT-specific integration and contract tests.

Current executable coverage remains in the workspace packages and apps. Add new tests here only when they are wired into the existing test runner and do not introduce private fixtures.

## Current Runner

- Existing runner: Vitest (`vitest.config.ts`)
- App-level tests currently run from `apps/web/src/**/*.test.ts`

## Current AIT Test Coverage

- Deterministic SHA-256 document proof behavior
- Deterministic Merkle root behavior
- Private payload encryption boundary behavior
- Medical claim gating defaults
- RWA legal review defaults
- x402 development-mode verification isolation
- Admin header auth/token gating behavior

