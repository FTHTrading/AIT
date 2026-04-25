# BIOFIELD OS — 90-Day Build Roadmap

> AI-Orchestrated Gas, Signal, and Organ Support Research Platform
> Version 0.1 · Start date: TBD

---

## Phase 1: Core Engines (Days 1–21)

### Sprint 1 (Days 1–7) — Types, Core Engine, Database

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 1.1 | Domain types finalized | All 22 entities compile, exported from `@biofield/types` |
| 1.2 | Prisma schema + first migration | `prisma migrate dev` creates all tables |
| 1.3 | Core engine: clock + tick loop | Configurable tick rate (10ms default), start/pause/stop lifecycle |
| 1.4 | Core engine: event bus | In-process pub/sub for inter-engine communication |
| 1.5 | Telemetry service: session CRUD | Create/start/pause/stop sessions, store in DB |
| 1.6 | CI pipeline | GitHub Actions: lint → typecheck → test → build |

### Sprint 2 (Days 8–14) — Gas + Signal Engines

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 2.1 | Gas engine: circuit model | Multi-channel gas mixing, flow calculation, pressure/humidity |
| 2.2 | Gas engine: command execution | Issue commands with ramp, validate against safety constraints |
| 2.3 | Gas sim service API | REST endpoints for gas state, commands, circuit readings |
| 2.4 | Signal engine: waveform generators | ECG, SpO2, capnography, EEG, ventilator waveform generators |
| 2.5 | Signal engine: program player | Load SignalProgram, run channels at configured sample rates |
| 2.6 | Signal sim service API | REST endpoints + buffered waveform retrieval |

### Sprint 3 (Days 15–21) — Organ Models

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 3.1 | Lung model ODE | Tidal volume, compliance, gas exchange, PaO2/PaCO2 dynamics |
| 3.2 | Cardiac model ODE | Heart rate, BP, cardiac output, stroke volume, SVR |
| 3.3 | Renal model | Urine output, creatinine clearance, electrolyte balance |
| 3.4 | Metabolic model | Glucose, lactate, pH, base excess, VO2/VCO2 |
| 3.5 | Inflammatory model | WBC, CRP, procalcitonin, SOFA score trending |
| 3.6 | Organ twin service API | REST endpoints for all organ states + history |
| 3.7 | Cross-organ coupling | Gas circuit output → lung PaO2 → cardiac response chain |

---

## Phase 2: Safety + AI (Days 22–42)

### Sprint 4 (Days 22–28) — Safety Engine

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 4.1 | Constraint evaluator | Check all SignalConstraints per tick, generate alarms |
| 4.2 | Alarm manager | Fire, acknowledge, auto-resolve alarms with severity levels |
| 4.3 | Safety locks | Advisory → enforced → emergency stop escalation |
| 4.4 | Emergency stop | Immediate halt of all gas/signal output, full state snapshot |
| 4.5 | Safety service API | REST endpoints for locks, alarms, constraints, e-stop |
| 4.6 | Gas command pre-flight | Every gas command validated against active constraints before execution |

### Sprint 5 (Days 29–35) — AI Recommendation Engine

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 5.1 | Model version registry | Register models with input/output schemas + metrics |
| 5.2 | Inference adapter | Pluggable adapter: ONNX Runtime (local), REST endpoint (remote) |
| 5.3 | Recommendation pipeline | Analyze organ trends → generate recommendations with confidence |
| 5.4 | Accept/reject workflow | Operator can accept (auto-execute) or reject (with reason) |
| 5.5 | Approval workflow | Model deployment + safety overrides require multi-party approval |
| 5.6 | AI recommendation service API | REST endpoints for recommendations, models, approvals |

### Sprint 6 (Days 36–42) — Audit + Playback

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 6.1 | Audit event ingestion | Every state change, operator action, alarm → content-hash logged |
| 6.2 | Audit service API | Query events by session/profile/type/time, export logs |
| 6.3 | Session playback | Replay session timeline with organ/gas/signal state reconstruction |
| 6.4 | Verification endpoint | Verify content hash integrity of any audit event |
| 6.5 | Protocol templates | Create, version, and apply protocol templates to sessions |

---

## Phase 3: First Vertical Slice UI (Days 43–63)

### Sprint 7 (Days 43–49) — Command Center Shell

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 7.1 | Next.js 15 app scaffold | App router, server components, Tailwind, WebSocket setup |
| 7.2 | Session management panel | Create/start/pause/stop sessions, select patient profiles |
| 7.3 | Organ-state dashboard | 5-panel view (lung, cardiac, renal, metabolic, inflammatory) with live values |
| 7.4 | Alarm strip | Real-time alarm bar with severity colors, acknowledge button |
| 7.5 | WebSocket integration | Live tick data driving all dashboard panels |

### Sprint 8 (Days 50–56) — Gas Console + Signal Designer

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 8.1 | Gas console | Gas channel controls, flow sliders, concentration inputs, mix visualization |
| 8.2 | Gas command history | Timestamped command log with outcome indicators |
| 8.3 | Signal designer | Channel list, waveform type selection, parameter adjustment |
| 8.4 | Waveform viewer | Real-time canvas-rendered waveform strips (ECG, SpO2, capno, etc.) |
| 8.5 | Safety controls | Safety lock indicator, emergency stop button, constraint list |

### Sprint 9 (Days 57–63) — Sim Lab + Audit Viewer

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 9.1 | Simulation workbench shell | Scenario builder, protocol designer, batch run controls |
| 9.2 | Protocol designer | Step-based protocol creation with gas presets and safety checks |
| 9.3 | Audit log viewer | Filterable event timeline with before/after state diff |
| 9.4 | Session playback player | Scrubber-based replay of recorded sessions |
| 9.5 | AI recommendations panel | Pending recommendations with accept/reject + rationale display |

---

## Phase 4: Integration + Hardening (Days 64–84)

### Sprint 10 (Days 64–70) — End-to-End Integration

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 10.1 | Full loop test | Create profile → start session → gas commands → organ responses → alarms → AI recommendations → audit log |
| 10.2 | Protocol execution | Load protocol template → auto-advance steps → verify gas/signal/safety behavior |
| 10.3 | Emergency stop E2E | Trigger e-stop → verify all gas halted, state snapshot captured, audit logged |
| 10.4 | Cross-organ coupling verified | Change FiO2 → lung PaO2 changes → cardiac compensates → metabolic shifts |

### Sprint 11 (Days 71–77) — Performance + Reliability

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 11.1 | Tick performance | 10ms tick sustains 5 organ models + gas circuit + 8 signal channels |
| 11.2 | WebSocket throughput | 100 connected clients receive tick data < 5ms latency |
| 11.3 | Database query optimization | Organ history queries < 50ms for 1hr of data at 100Hz |
| 11.4 | Safety engine latency | Constraint evaluation completes within single tick |

### Sprint 12 (Days 78–84) — Infrastructure

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 12.1 | Docker Compose full stack | All 7 services + PostgreSQL + Redis in one `docker compose up` |
| 12.2 | Local-first deployment | Works fully offline after initial install |
| 12.3 | Database migrations | Forward-only via `prisma migrate deploy` in CI |
| 12.4 | Health check + monitoring | All services expose `/health`, Prometheus metrics endpoints |

---

## Phase 5: Polish + Demo (Days 85–90)

### Sprint 13 (Days 85–90) — Launch Readiness

| # | Deliverable | Acceptance Criteria |
|---|-------------|-----|
| 13.1 | Demo scenario | Pre-built patient profile + protocol that showcases all systems |
| 13.2 | Documentation | README, API docs, architecture guide, operator manual |
| 13.3 | Shared UI component library | Gauges, waveform viewer, alarm strip, organ cards — documented in Storybook |
| 13.4 | CI green on main | All lint + typecheck + test + build passes |
| 13.5 | Second organ scenario | ARDS patient profile with ventilator management protocol |

---

## Success Metrics (Day 90)

- [ ] 7 services healthy, all passing `/health`
- [ ] 5 organ models producing physiologically plausible outputs
- [ ] Gas circuit supports 4+ simultaneous gas types with mixing
- [ ] 6+ waveform types rendering in real-time
- [ ] Safety engine catches constraint violations within 1 tick
- [ ] Emergency stop halts all output within 50ms
- [ ] Audit trail captures every state change with verifiable content hash
- [ ] AI recommendation pipeline generates clinically reasonable suggestions
- [ ] Full session playback reproduces recorded sessions faithfully
- [ ] Command Center UI operational with live WebSocket data

