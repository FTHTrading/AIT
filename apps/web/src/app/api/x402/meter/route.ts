import { NextResponse } from 'next/server';
import { x402PaidRouteExamples } from '@/lib/ait/adapters';
import { buildExamplePayloads, buildMeterRecord, buildX402Challenge } from '@/lib/ait/engine';
import { aitRepository } from '@/lib/ait/repository';

export async function GET() {
  const challenge = buildExamplePayloads().x402Challenge;
  return NextResponse.json({
    ok: true,
    route: '/api/x402/meter',
    example: buildMeterRecord(challenge),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const challenge = body.challenge && typeof body.challenge === 'object'
    ? body.challenge
    : buildX402Challenge({
        route: typeof body.route === 'string' ? body.route : undefined,
        amount: typeof body.amount === 'number' ? body.amount : undefined,
        asset: typeof body.asset === 'string' ? body.asset : undefined,
      });

  const meter = buildMeterRecord(challenge, typeof body.units === 'number' ? body.units : 1);
  const saved = await aitRepository.saveRouteMeterRecord({
    meterId: `meter-${challenge.challengeId}-${Date.now()}`,
    challengeId: challenge.challengeId,
    route: meter.route,
    amount: meter.amount,
    asset: meter.asset,
    units: meter.units,
    unitType: meter.unitType,
    estimatedTotal: meter.estimatedTotal,
    status: 'METERED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    route: '/api/x402/meter',
    todo: 'Replace mock usage accounting with signed settlement-backed metering before production billing.',
    paidRouteExamples: x402PaidRouteExamples,
    meter,
    persisted: saved,
  });
}