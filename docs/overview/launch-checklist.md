# Launch Checklist

## Code Readiness

- [ ] `apps/web` build passes in CI and local (`npx next build`).
- [ ] AIT proof, claims, RWA, anchors, x402, and admin endpoints return typed responses.
- [ ] No TODO-level blockers in release-critical routes.
- [ ] File-backed persistence fallback is validated.

## Docs Readiness

- [ ] README launch and boundary sections are current.
- [ ] Security, contributing, and compliance docs are linked from root README.
- [ ] Demo-safe dataset and examples are present.

## Proof Readiness

- [ ] SHA-256 hashing deterministic checks pass.
- [ ] Merkle root deterministic checks pass.
- [ ] Anchor payload status and broadcast flags behave per environment.

## Admin Readiness

- [ ] Admin login and logout are operational.
- [ ] Review actions are role-gated and audited.
- [ ] Admin review queue can update status end to end.

## Privacy Readiness

- [ ] Private/restricted payloads require encrypted references.
- [ ] No raw sensitive records are present in repo fixtures.
- [ ] IPFS public/private boundary behavior is validated.

## Investor Readiness

- [ ] One-page explainer and system overview assets are current.
- [ ] RWA and claim governance matrices include review gates.
- [ ] Data-room structure and access policy are documented.

## Demo Readiness

- [ ] Demo pages render with synthetic samples only.
- [ ] No medical efficacy claims or token-sale logic in demos.
- [ ] Demo script references only safe endpoints and sample data.

## Legal/Medical/Regulatory Gates

- [ ] Legal review gate acknowledged for offering-related items.
- [ ] Medical review gate acknowledged for medical category claims.
- [ ] Regulatory review gate acknowledged before public commercialization statements.

## Deployment Readiness

- [ ] Environment variables are defined and documented.
- [ ] x402 dev/prod verification mode explicitly configured.
- [ ] Anchor broadcast and IPFS adapter flags verified.
- [ ] Rollback path and restore procedures documented.

## Post-Launch Monitoring

- [ ] Admin audit events are being recorded.
- [ ] x402 route metering records are persisted.
- [ ] Error logs and incident response runbook are active.
- [ ] Backup and restore job checks are scheduled.
