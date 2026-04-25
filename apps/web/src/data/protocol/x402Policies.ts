export interface X402Policy {
  route: string;
  mode: 'free' | 'paid' | 'subscription' | 'enterprise' | 'admin-only';
  priceUsd?: number;
  description: string;
}

export const x402Policies: X402Policy[] = [
  {
    route: '/api/ait/documents/hash',
    mode: 'free',
    description: 'Hashing endpoint for proof generation during onboarding.',
  },
  {
    route: '/api/agents/rag/query',
    mode: 'paid',
    priceUsd: 0.01,
    description: 'Metered RAG query endpoint.',
  },
  {
    route: '/api/ait/rwa/packages',
    mode: 'enterprise',
    priceUsd: 25,
    description: 'Generate RWA package with compliance and licensing metadata.',
  },
  {
    route: '/api/l1/modules/register',
    mode: 'admin-only',
    description: 'Module registration is restricted to authorized operators.',
  },
];
