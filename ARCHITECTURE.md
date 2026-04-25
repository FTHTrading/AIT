# BIOFIELD OS — Architecture

> AI-Orchestrated Gas, Signal, and Organ Support Research Platform
> Version 0.1 · April 2026

---

## 1. Mission

BIOFIELD OS is a simulation-first research platform for modeling gas delivery, physiological signal generation, organ-system digital twins, and AI-driven clinical decision support. It is an **educational / research tool**, not a medical device. All outputs are synthetic simulations for study, training, and protocol development.

---

## 2. System Overview

```
┌──────────────────────────────────────────────────────────┐
│                    BIOFIELD OS                           │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  apps/web    │  │ apps/sim-lab│  │   apps/api      │  │
│  │  Command     │  │ Simulation  │  │   REST/WS       │  │
│  │  Center      │  │ Workbench   │  │   Gateway       │  │
│  └──────┬───────┘  └──────┬──────┘  └──────┬──────────┘  │
│         │                 │                │              │
│  ═══════╪═════════════════╪════════════════╪══════════    │
│         │        WebSocket + REST           │             │
│  ═══════╪═════════════════╪════════════════╪══════════    │
│         ▼                 ▼                ▼              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                  Service Layer                      │ │
│  │  telemetry · gas-sim · signal-sim · organ-twin      │ │
│  │  safety · ai-recommendation · audit                 │ │
│  └─────────────────────────────────────────────────────┘ │
│         │                 │                │              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │               Package Layer (shared)                │ │
│  │  types · core-engine · gas-engine · signal-engine   │ │
│  │  organ-models · safety-engine · ai-engine           │ │
│  │  audit-kit · ui · db                                │ │
│  └─────────────────────────────────────────────────────┘ │
│         │                                                │
│  ┌──────▼──────────────────────────────────────────────┐ │
│  │  PostgreSQL 16          Redis Streams / NATS        │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Package Map

| Package | Purpose |
|---------|---------|
| `packages/types` | All 22 domain entities, enums, value types — single source of truth |
| `packages/core-engine` | Simulation session lifecycle, clock, tick loop, event bus |
| `packages/gas-engine` | Gas circuit modeling, flow calculations, mixing, delivery simulation |
| `packages/signal-engine` | Waveform generation (ECG, EEG, SpO2, capnography, etc.), noise injection |
| `packages/organ-models` | Digital twin ODEs: lung, cardiac, renal, metabolic, inflammatory |
| `packages/safety-engine` | Constraint evaluation, alarm generation, safety locks, emergency stop |
| `packages/ai-engine` | Recommendation pipeline, model registry, inference adapter |
| `packages/audit-kit` | Immutable event logging, content-addressed hashing, session playback |
| `packages/ui` | Shared React components (gauges, waveform viewers, alarm strips) |
| `packages/db` | Prisma schema, migrations, client |

---

## 4. Service Map

| Service | Port | Role |
|---------|------|------|
| `telemetry-service` | 5010 | WebSocket fan-out of real-time organ/gas/signal state |
| `gas-sim-service` | 5020 | Gas circuit simulation, command execution, flow control |
| `signal-sim-service` | 5030 | Signal/waveform generation and streaming |
| `organ-twin-service` | 5040 | Organ-system ODE solvers, state progression |
| `safety-service` | 5050 | Constraint checking, alarm management, lock enforcement |
| `ai-recommendation-service` | 5060 | AI inference, recommendation generation |
| `audit-service` | 5070 | Immutable event ingestion, playback API |

---

## 5. Application Map

| App | Purpose |
|-----|---------|
| `apps/web` | **Command Center** — operator dashboard, gas console, signal designer, organ-state panels, alarm strip, safety controls |
| `apps/sim-lab` | **Simulation Workbench** — scenario builder, protocol designer, batch runs, result comparison |
| `apps/api` | **API Gateway** — REST + WebSocket entry point, auth, rate limiting, route aggregation |

---

## 6. Data Flow

### 6.1 Simulation Tick (10 ms default)

```
Clock tick
  → organ-twin-service: advance ODE (lung, cardiac, renal, metabolic, inflammatory)
  → gas-sim-service: apply gas commands, compute flows, update circuit state
  → signal-sim-service: generate waveform samples for active channels
  → safety-service: evaluate constraints, fire alarms, enforce locks
  → ai-recommendation-service: (every N ticks) analyze trends, emit recommendations
  → telemetry-service: fan-out snapshot via WebSocket to all connected clients
  → audit-service: append tick event to immutable log
```

### 6.2 Operator Interaction

```
Operator action (UI)
  → apps/api: validate, authenticate
  → target service (gas command / signal change / safety override)
  → safety-service: pre-flight constraint check
  → execute or reject
  → audit-service: log OperatorAction + before/after state
  → telemetry-service: broadcast updated state
```

---

## 7. Technology Stack

| Layer | Choice |
|-------|--------|
| Language | TypeScript (Node 22+) |
| Monorepo | npm workspaces + Turborepo |
| API Framework | Fastify 5 |
| WebSocket | Fastify WebSocket / ws |
| Frontend | Next.js 15 (React 19) |
| Charts/Waveforms | visx, D3, or custom Canvas renderers |
| Database | PostgreSQL 16 + Prisma ORM |
| Event Streaming | Redis Streams (dev) / NATS JetStream (prod) |
| AI Inference | ONNX Runtime, local model adapter |
| Testing | Vitest |
| CI | GitHub Actions |
| Infra | Docker Compose (dev), Kubernetes (prod) |

---

## 8. Security & Safety Principles

1. **Simulation only** — no real patient data, no real device control.
2. **Safety-first architecture** — every gas command, signal change, and AI recommendation passes through the safety engine before execution.
3. **Emergency stop** — any operator or the safety engine can trigger an immediate halt of all gas flow and signal output.
4. **Immutable audit trail** — every state change, operator action, AI recommendation, and alarm is content-hash logged via audit-kit.
5. **Approval gates** — AI model deployment, safety overrides, and protocol changes require explicit approval workflow.
6. **No external network dependency** — the platform runs fully offline after initial install; AI models are local.

---

## 9. Repository Structure

```
biofield-os/
├── apps/
│   ├── web/              Command Center (Next.js)
│   ├── api/              API Gateway (Fastify)
│   └── sim-lab/          Simulation Workbench (Next.js)
├── packages/
│   ├── types/            Domain types (22 entities)
│   ├── core-engine/      Session lifecycle, clock, tick loop
│   ├── gas-engine/       Gas circuit simulation
│   ├── signal-engine/    Waveform generation
│   ├── organ-models/     Organ digital twins (ODE)
│   ├── safety-engine/    Constraints, alarms, locks
│   ├── ai-engine/        Recommendation pipeline
│   ├── audit-kit/        Immutable logging, playback
│   ├── ui/               Shared React components
│   └── db/               Prisma schema + migrations
├── services/
│   ├── telemetry-service/
│   ├── gas-sim-service/
│   ├── signal-sim-service/
│   ├── organ-twin-service/
│   ├── safety-service/
│   ├── ai-recommendation-service/
│   └── audit-service/
├── ARCHITECTURE.md       ← this file
├── API-SPECIFICATION.md
├── ROADMAP.md
├── package.json
├── turbo.json
└── tsconfig.json
```

