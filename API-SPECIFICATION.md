# BIOFIELD OS — API Specification

> Version 0.1 · All services use JSON over HTTP + WebSocket · Ports 5010–5070

---

## Common Patterns

| Pattern | Convention |
|---------|-----------|
| List | `GET /v1/{resource}?page=1&limit=50` |
| Get | `GET /v1/{resource}/:id` |
| Create | `POST /v1/{resource}` |
| Update | `PATCH /v1/{resource}/:id` |
| Delete | `DELETE /v1/{resource}/:id` |
| Health | `GET /health` → `{ ok, service, version, uptime }` |
| Error | `{ error: { code, message, details? } }` |
| Envelope | `{ data, meta?: { page, limit, total } }` |

---

## 1. Telemetry Service `:5010`

### WebSocket

| Path | Direction | Description |
|------|-----------|-------------|
| `ws://host:5010/v1/stream/:profileId` | Server → Client | Real-time simulation state (organ, gas, signal snapshots) at tick rate |
| `ws://host:5010/v1/alarms/:profileId` | Server → Client | Alarm events as they fire |

### REST

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/sessions` | List active simulation sessions |
| GET | `/v1/sessions/:id` | Session details + status |
| POST | `/v1/sessions` | Create session (body: `{ profileId, mode, protocolId?, speedMultiplier }`) |
| POST | `/v1/sessions/:id/start` | Start simulation |
| POST | `/v1/sessions/:id/pause` | Pause simulation |
| POST | `/v1/sessions/:id/resume` | Resume simulation |
| POST | `/v1/sessions/:id/stop` | Stop and finalize session |
| GET | `/v1/sessions/:id/snapshot` | Current full state snapshot |

---

## 2. Gas Simulation Service `:5020`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/gas/:profileId/state` | Current gas circuit state |
| POST | `/v1/gas/:profileId/command` | Issue gas command (body: `GasCommand`) |
| GET | `/v1/gas/:profileId/commands` | Command history |
| GET | `/v1/gas/:profileId/circuit` | Full circuit detail (channels, flows, pressures) |
| POST | `/v1/gas/:profileId/preset` | Apply gas preset from protocol |
| GET | `/v1/gas/types` | List available gas types + properties |

---

## 3. Signal Simulation Service `:5030`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/signals/:profileId/active` | Active signal channels |
| POST | `/v1/signals/:profileId/program` | Load signal program (body: `SignalProgram`) |
| PATCH | `/v1/signals/:profileId/channel/:channelId` | Adjust channel parameters live |
| GET | `/v1/signals/:profileId/waveform/:channelId` | Buffered waveform data (query: `fromMs`, `toMs`) |
| POST | `/v1/signals/programs` | Create/save signal program |
| GET | `/v1/signals/programs` | List saved signal programs |
| GET | `/v1/signals/programs/:id` | Get program definition |

---

## 4. Organ Twin Service `:5040`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/organs/:profileId` | All organ states (latest tick) |
| GET | `/v1/organs/:profileId/:organ` | Single organ state (lung, cardiac, renal, metabolic, inflammatory) |
| GET | `/v1/organs/:profileId/:organ/history` | Organ state history (query: `fromMs`, `toMs`, `resolution`) |
| GET | `/v1/organs/:profileId/:organ/trends` | Derived trend analysis |
| PATCH | `/v1/organs/:profileId/:organ/override` | Override parameter (research mode, requires approval) |

### Patient Profiles

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/profiles` | Create patient simulation profile |
| GET | `/v1/profiles` | List profiles |
| GET | `/v1/profiles/:id` | Get profile |
| PATCH | `/v1/profiles/:id` | Update profile |
| DELETE | `/v1/profiles/:id` | Delete profile |

---

## 5. Safety Service `:5050`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/safety/:profileId/locks` | Active safety locks |
| GET | `/v1/safety/:profileId/alarms` | Active alarms (filter: `severity`, `organ`, `acknowledged`) |
| POST | `/v1/safety/:profileId/alarms/:id/acknowledge` | Acknowledge alarm |
| POST | `/v1/safety/:profileId/emergency-stop` | Trigger emergency stop |
| POST | `/v1/safety/:profileId/emergency-stop/resolve` | Resolve emergency stop (body: `{ resolvedBy, notes }`) |
| GET | `/v1/safety/:profileId/constraints` | Active constraints |
| POST | `/v1/safety/:profileId/constraints` | Add runtime constraint |
| DELETE | `/v1/safety/:profileId/constraints/:id` | Remove constraint |
| POST | `/v1/safety/:profileId/override` | Request safety override (creates ApprovalRequest) |

---

## 6. AI Recommendation Service `:5060`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/ai/:profileId/recommendations` | Pending recommendations |
| POST | `/v1/ai/:profileId/recommendations/:id/accept` | Accept recommendation |
| POST | `/v1/ai/:profileId/recommendations/:id/reject` | Reject (body: `{ reason }`) |
| GET | `/v1/ai/models` | List registered model versions |
| GET | `/v1/ai/models/:id` | Model details + metrics |
| POST | `/v1/ai/models` | Register new model version |
| POST | `/v1/ai/models/:id/approve` | Approve model for use (creates ApprovalRequest) |

---

## 7. Audit Service `:5070`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/audit/events` | Query audit events (filter: `sessionId`, `profileId`, `eventType`, `actor`, `from`, `to`) |
| GET | `/v1/audit/events/:id` | Single event with full before/after state |
| GET | `/v1/audit/sessions/:sessionId/playback` | Session playback metadata |
| GET | `/v1/audit/sessions/:sessionId/timeline` | Ordered event timeline for replay |
| POST | `/v1/audit/events/verify` | Verify content hash of event |
| GET | `/v1/audit/sessions/:sessionId/export` | Export full session log (JSON) |

### Approval Workflow

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/approvals` | List pending approvals |
| GET | `/v1/approvals/:id` | Approval detail |
| POST | `/v1/approvals/:id/approve` | Approve request |
| POST | `/v1/approvals/:id/reject` | Reject request (body: `{ notes }`) |

---

## WebSocket Event Types (via Telemetry Service)

| Event | Payload |
|-------|---------|
| `tick` | `{ tickMs, organStates, gasCircuit, signalSamples }` |
| `alarm.fired` | `AlarmEvent` |
| `alarm.resolved` | `{ alarmId, resolvedAt }` |
| `gas.command.executed` | `GasCommand` |
| `gas.command.rejected` | `{ commandId, reason, safetyLockId }` |
| `safety.lock.activated` | `SafetyLock` |
| `safety.lock.deactivated` | `{ lockId, deactivatedBy }` |
| `emergency.stop` | `EmergencyStopEvent` |
| `emergency.resolved` | `{ eventId, resolvedBy }` |
| `recommendation.new` | `Recommendation` |
| `session.state.changed` | `{ sessionId, from, to }` |
| `operator.action` | `OperatorAction` |

