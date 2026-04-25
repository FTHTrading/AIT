import { NextResponse } from 'next/server';
import { aitVaultDocuments } from '@/data/systems/ait-biofield/documents';
import { aitProtocolDefinition, aitIntegrationMap, aitSampleEvents } from '@/data/systems/ait-biofield/protocolSchemas';
import { aitRwaPathwaySteps, aitRwaStructures, aitGenerateDocs } from '@/data/systems/ait-biofield/rwaModel';
import { aitUseCases } from '@/data/systems/ait-biofield/useCases';
import { anchorRecords } from '@/data/protocol';

const licensePackages = [
  {
    id: 'license-retrofit-tier-a',
    name: 'Retrofit Package A',
    territory: 'US pilot territories',
    status: 'draft',
    complianceGate: 'legal-review-required',
  },
  {
    id: 'license-standalone-center',
    name: 'Standalone Center Package',
    territory: 'jurisdiction-specific',
    status: 'draft',
    complianceGate: 'clinical-and-regulatory-review-required',
  },
  {
    id: 'license-protocol-usage',
    name: 'Protocol Usage Rights',
    territory: 'enterprise',
    status: 'draft',
    complianceGate: 'compliance-review-required',
  },
];

function buildDataset(path: string[]) {
  const [segment] = path;

  switch (segment) {
    case 'overview':
      return {
        module: aitProtocolDefinition,
        documentCounts: {
          total: aitVaultDocuments.length,
          public: aitVaultDocuments.filter((doc) => doc.visibility === 'public').length,
          restricted: aitVaultDocuments.filter((doc) => doc.visibility === 'restricted').length,
          private: aitVaultDocuments.filter((doc) => doc.visibility === 'private').length,
        },
        routeMap: ['/ait/docs', '/ait/claims', '/ait/ip', '/ait/protocol', '/ait/rwa', '/ait/licensing', '/ait/investors'],
      };
    case 'docs':
    case 'documents':
      return {
        documents: aitVaultDocuments,
        generateQueue: aitGenerateDocs,
        anchors: anchorRecords,
      };
    case 'claims':
      return {
        claimCandidates: aitUseCases.map((useCase) => ({
          id: useCase.useCaseId,
          name: useCase.name,
          status: useCase.diligenceStatus,
          risk: useCase.regulatoryRisk,
          evidenceRequired: useCase.evidenceRequired,
          proofObjects: useCase.proofObjects,
        })),
      };
    case 'ip':
      return {
        protectedDocuments: aitVaultDocuments.map((doc) => ({
          documentId: doc.documentId,
          title: doc.title,
          type: doc.type,
          visibility: doc.visibility,
          hashStatus: doc.hashStatus,
        })),
        anchors: anchorRecords,
      };
    case 'protocol':
      return {
        module: aitProtocolDefinition,
        integrationMap: aitIntegrationMap,
        events: aitSampleEvents,
      };
    case 'rwa':
      return {
        pathway: aitRwaPathwaySteps,
        structures: aitRwaStructures,
      };
    case 'licensing':
      return {
        packages: licensePackages,
        structures: aitRwaStructures.filter((structure) =>
          ['IP Licensing Registry', 'Treatment Center Retrofit Package', 'Protocol Usage Rights'].includes(structure.title),
        ),
      };
    case 'investors':
      return {
        qualifiedPackets: aitVaultDocuments.filter((doc) => doc.visibility !== 'private'),
        structures: aitRwaStructures,
      };
    default:
      return null;
  }
}

async function buildResponse(req: Request, params: Promise<{ path: string[] }>) {
  const resolved = await params;
  const body = await req.json().catch(() => null);
  const dataset = buildDataset(resolved.path);

  return NextResponse.json({
    ok: true,
    namespace: 'ait',
    route: `/api/ait/${resolved.path.join('/')}`,
    message: dataset ? 'AIT API route active.' : 'AIT API scaffold route active.',
    dataset,
    body,
    timestamp: new Date().toISOString(),
  });
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const resolved = await params;
  const dataset = buildDataset(resolved.path);

  return NextResponse.json({
    ok: true,
    namespace: 'ait',
    route: `/api/ait/${resolved.path.join('/')}`,
    message: dataset ? 'AIT API route active.' : 'AIT API scaffold route active.',
    dataset,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return buildResponse(req, params);
}
