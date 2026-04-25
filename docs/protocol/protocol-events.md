# Protocol Events

Suggested event families:

- `DOCUMENT_SET_ANCHOR`
- `CLAIM_REVIEW_UPDATED`
- `RWA_PACKAGE_PREPARED`
- `X402_RECEIPT_ISSUED`
- `ADMIN_REVIEW_ARCHIVED`

Every event should be:

- Typed
- Hash-linked where appropriate
- Safe for its declared visibility level
- Traceable to a review decision when compliance-gated
