# Security and Privacy Hardening Checklist

## Access Control

- [ ] Admin authentication enabled and tested.
- [ ] Role-based API enforcement enabled for read/write paths.
- [ ] Unauthorized review mutations return explicit 401/403 responses.

## Audit and Traceability

- [ ] Admin review create/update actions persist audit events.
- [ ] x402 route metering records persist to repository backend.
- [ ] Log retention policy documented.

## Private Vault Rules

- [ ] Non-public sensitive material requires encrypted payload or vault reference.
- [ ] Raw KYC/patient/formula/contract/investor private files are blocked from repository ingestion.
- [ ] Public-safe metadata only for demo and examples.

## Secret and Commit Hygiene

- [ ] Secret scanning enabled in GitHub Security.
- [ ] `.env` and private key patterns ignored and reviewed.
- [ ] Pre-commit or CI checks prevent private-data commit regressions.
- [ ] Environment variable hygiene documented and enforced.

## Adapter Boundaries

- [ ] IPFS public/private boundary validated.
- [ ] Chain anchor broadcast flags controlled by environment.
- [ ] x402 dev proof mode is disabled in production.
- [ ] Mock/prod boundaries are explicit in route responses and docs.

## Data Handling

- [ ] KYC/private data handling procedures documented.
- [ ] Backup and restore process documented and tested.
- [ ] Incident response path documented with ownership and escalation.
