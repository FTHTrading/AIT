// ─── BIOFIELD OS — API Gateway (port 4000) ───
// Unified REST + WebSocket gateway that proxies to downstream services.

import Fastify from 'fastify';
import cors from '@fastify/cors';
import httpProxy from '@fastify/http-proxy';
import websocket from '@fastify/websocket';

const PORT = Number(process.env.PORT ?? 4000);

const SERVICES = {
  telemetry: process.env.TELEMETRY_URL ?? 'http://127.0.0.1:5010',
  gasSim: process.env.GAS_SIM_URL ?? 'http://127.0.0.1:5020',
  signalSim: process.env.SIGNAL_SIM_URL ?? 'http://127.0.0.1:5030',
  organTwin: process.env.ORGAN_TWIN_URL ?? 'http://127.0.0.1:5040',
  safety: process.env.SAFETY_URL ?? 'http://127.0.0.1:5050',
  aiRecommendation: process.env.AI_REC_URL ?? 'http://127.0.0.1:5060',
  audit: process.env.AUDIT_URL ?? 'http://127.0.0.1:5070',
} as const;

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(websocket);

// Health — aggregated from all services
app.get('/health', async () => ({
  gateway: 'ok',
  upstreams: Object.fromEntries(
    Object.entries(SERVICES).map(([name, url]) => [name, url]),
  ),
}));

// ── Reverse proxies to downstream services ──
await app.register(httpProxy, { upstream: SERVICES.telemetry, prefix: '/v1/sessions', rewritePrefix: '/v1/sessions' });
await app.register(httpProxy, { upstream: SERVICES.telemetry, prefix: '/v1/stream', rewritePrefix: '/v1/stream' });
await app.register(httpProxy, { upstream: SERVICES.gasSim, prefix: '/v1/gas', rewritePrefix: '/v1/gas' });
await app.register(httpProxy, { upstream: SERVICES.signalSim, prefix: '/v1/signals', rewritePrefix: '/v1/signals' });
await app.register(httpProxy, { upstream: SERVICES.organTwin, prefix: '/v1/organs', rewritePrefix: '/v1/organs' });
await app.register(httpProxy, { upstream: SERVICES.organTwin, prefix: '/v1/profiles', rewritePrefix: '/v1/profiles' });
await app.register(httpProxy, { upstream: SERVICES.safety, prefix: '/v1/safety', rewritePrefix: '/v1/safety' });
await app.register(httpProxy, { upstream: SERVICES.aiRecommendation, prefix: '/v1/recommendations', rewritePrefix: '/v1/recommendations' });
await app.register(httpProxy, { upstream: SERVICES.aiRecommendation, prefix: '/v1/models', rewritePrefix: '/v1/models' });
await app.register(httpProxy, { upstream: SERVICES.aiRecommendation, prefix: '/v1/approvals', rewritePrefix: '/v1/approvals' });
await app.register(httpProxy, { upstream: SERVICES.audit, prefix: '/v1/audit', rewritePrefix: '/v1/audit' });

await app.listen({ port: PORT, host: '0.0.0.0' });
console.log(`BIOFIELD API Gateway listening on ${PORT}`);
