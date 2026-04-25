# System Overview

AIT Biofield OS is the infrastructure layer for AIT diligence, proof, licensing, claim governance, RWA packaging, and paid-access workflows.

Primary runtime surface:

- `apps/web/src/app` for public, admin, and API routes
- `apps/web/src/lib/ait` for typed AIT engines, persistence, and workflow helpers
- `docs/` for policy, protocol, and diligence-safe operating guidance

The system uses a public-proof/private-content model:

- Public: hashes, Merkle roots, safe metadata, unsigned anchors
- Restricted: non-public metadata, gated claims, internal review records
- Private: raw KYC, formulas, contracts, medical material, vault-only payloads
