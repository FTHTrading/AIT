# Voice Intelligence Layer

The AIT Voice Intelligence Layer adds a browser-first narration system for public-safe pages, route summaries, and guided infrastructure walkthroughs.

## Core Principles

- Browser TTS first via Web Speech API.
- External providers are disabled by default.
- Narration is public-safe and compliance-aware.
- Admin narration is metadata-only and flag-gated.

## Route Coverage

Primary routes include AIT landing pages, docs/media/videos/brand, protocol pages, systems pages, and demo-safe routes.

## External Provider Activation

Environment controls:
- AIT_VOICE_ENABLED=true
- AIT_VOICE_PROVIDER=browser
- AIT_VOICE_EXTERNAL_ENABLED=false
- AIT_VOICE_ALLOW_ADMIN=false

Keep non-browser modes in placeholder state until legal, security, and platform approvals are complete.
