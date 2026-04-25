# GitHub Publish Guide

## Repository Profile

- Repository: `FTHTrading/AIT`
- Description:
  `AIT Biofield OS — evidence, IP protection, claim governance, RWA structuring, x402 monetization, and UnyKorn protocol infrastructure for AIT-related technology.`
- Tagline:
  `Protect the IP. Prove the evidence. Govern the claims. Package the rights. Monetize the infrastructure.`
- Topics:
  `ait`, `biofield`, `unykorn`, `rwa`, `ipfs`, `x402`, `protocol`, `service-mesh`, `document-intelligence`, `claim-governance`, `merkle`, `sha256`, `medical-infrastructure`, `proof-engine`, `sovereign-infrastructure`

## Recommended Visibility

- Default: private while legal, medical, and regulatory controls are still in gated review.
- Public release only after final data-room sanitization and legal sign-off.

## Branch Strategy

- `master`: protected release branch.
- `release/*`: launch candidate hardening branches.
- `feature/*`: scoped work branches.
- Require PR review and CI checks before merge to `master`.

## Safe Staging Commands

Use explicit paths. Do not run broad `git add .` in a dirty tree.

```powershell
git add README.md
git add tests/README.md
git add docs/github-publish.md
git add docs/overview/launch-checklist.md
git add docs/rwa/investor-readiness-checklist.md
git add docs/compliance/security-hardening-checklist.md
git add docs/protocol/deployment-notes.md
git add examples/demo-safe-dataset.json
git add apps/web/src/components/ait-admin/ReviewActionForm.tsx
git add apps/web/src/components/ait-admin/ReviewQueuePanel.tsx
git add apps/web/src/app/admin/ait/page.tsx
git add apps/web/src/app/admin/ait/reviews/page.tsx
git add apps/web/src/lib/ait/engine.test.ts
git add apps/web/src/lib/ait/access.test.ts
```

## Push Commands

```powershell
git status
git commit -m "docs: add AIT launch, investor, security, and GitHub readiness guides"
git push origin <branch-name>
```

## Release Checklist

- Confirm `apps/web` build passes (`npx next build`).
- Confirm no private data in staged diff.
- Confirm demo-safe examples are synthetic only.
- Confirm legal/medical/regulatory disclaimers are present.
- Confirm admin auth and role-gates remain enabled.
- Confirm x402 mock/prod boundary remains explicit.
- Create release notes with known placeholders and production bridge plan.

## What Not To Commit

Never commit:

- KYC documents or identity data.
- Raw formulas, ratios, dosing details.
- Patient records or private medical files.
- Private contracts, banking files, confidential investor materials.
- Secrets, API keys, private keys, unredacted `.env` files.

## Set GitHub Metadata

- Settings -> General -> Repository name/description.
- Settings -> General -> Topics and social preview image.
- Security -> enable secret scanning and dependency alerts.
- Branches -> branch protection rules on `master`.
- Actions -> ensure CI workflow badges can resolve.

## Recommended Pinned Sections

- Launch status and current implemented surfaces.
- Demo-safe boundaries and compliance disclaimers.
- Deployment notes and environment flags.
- Investor readiness checklist and data-room gating.
