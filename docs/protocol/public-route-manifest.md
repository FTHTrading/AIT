# Public Route Manifest

This manifest tracks public route ownership and deployment readiness for AIT Biofield OS.

| Route | Page file | Public/private | Expected HTTP status | Deployment status | Notes |
| --- | --- | --- | --- | --- | --- |
| / | apps/web/src/app/page.tsx | Public | 200 | Live (current) | Root currently serves old deployment branding publicly. |
| /ait | apps/web/src/app/ait/page.tsx | Public | 200 | Pending public sync | Primary target route. |
| /ait/docs | apps/web/src/app/ait/docs/page.tsx | Public | 200 | Pending public sync | Public-safe docs route. |
| /ait/media | apps/web/src/app/ait/media/page.tsx | Public | 200 | Pending public sync | Public-safe media listing. |
| /ait/videos | apps/web/src/app/ait/videos/page.tsx | Public | 200 | Pending public sync | Public-safe videos listing. |
| /ait/brand | apps/web/src/app/ait/brand/page.tsx | Public | 200 | Pending public sync | Brand usage route. |
| /ait/voice | apps/web/src/app/ait/voice/page.tsx | Public | 200 | Pending public sync | Voice layer public route. |
| /systems/ait-biofield | apps/web/src/app/systems/ait-biofield/page.tsx | Public | 200 | Pending public sync | Systems overview route. |
| /protocol | apps/web/src/app/protocol/page.tsx | Public | 200 | Pending public sync | Protocol landing route. |
| /demo/proof-vault | apps/web/src/app/demo/proof-vault/page.tsx | Public | 200 | Pending public sync | Demo proof vault route. |
| /admin/ait | apps/web/src/app/admin/ait/page.tsx | Protected | 200 after auth | Live | Admin-only, session and role gated. |
| /admin/ait/anchors | apps/web/src/app/admin/ait/anchors/page.tsx | Protected | 200 after auth | Live | Admin-only workflow route. |
| /admin/ait/claims | apps/web/src/app/admin/ait/claims/page.tsx | Protected | 200 after auth | Live | Admin-only workflow route. |
| /admin/ait/documents | apps/web/src/app/admin/ait/documents/page.tsx | Protected | 200 after auth | Live | Admin-only workflow route. |
| /admin/ait/reviews | apps/web/src/app/admin/ait/reviews/page.tsx | Protected | 200 after auth | Live | Admin-only workflow route. |
| /admin/ait/rwa | apps/web/src/app/admin/ait/rwa/page.tsx | Protected | 200 after auth | Live | Admin-only workflow route. |
| /admin/ait/x402 | apps/web/src/app/admin/ait/x402/page.tsx | Protected | 200 after auth | Live | Admin-only workflow route. |
| /admin/login | apps/web/src/app/admin/login/page.tsx | Public | 200 | Live | Admin entry point. |

## Deployment gate

Production-safe launch flags must remain set as follows until final adapter go-live:

- AIT_STORAGE_BACKEND=file
- AIT_X402_DEV_PROOF=false
- AIT_IPFS_UPLOAD_ENABLED=false
- AIT_POLYGON_BROADCAST_ENABLED=false
- AIT_XRPL_BROADCAST_ENABLED=false
- AIT_UNYKORN_BROADCAST_ENABLED=false
- AIT_VOICE_ENABLED=true
- AIT_VOICE_PROVIDER=browser
- AIT_VOICE_EXTERNAL_ENABLED=false
- AIT_VOICE_ALLOW_ADMIN=false
