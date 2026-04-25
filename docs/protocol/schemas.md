# Schemas

AIT protocol objects should declare:

- Stable identifier
- Created and updated timestamps
- Review status
- Visibility level
- Optional risk level
- Recommended action
- Proof hash or record linkage

Current schema-bearing objects live in `apps/web/src/lib/ait/types.ts` and are materialized through route handlers and admin views.
