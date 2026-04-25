export interface RoadmapStep {
  phase: string;
  title: string;
  outcome: string;
}

export const programmabilityRoadmap: RoadmapStep[] = [
  {
    phase: 'Phase 1',
    title: 'Protect and Prove',
    outcome: 'Document/claim registry, hash workflows, and anchor verification online.',
  },
  {
    phase: 'Phase 2',
    title: 'Package and License',
    outcome: 'License package engine, treatment-center readiness workflows, and diligence rooms live.',
  },
  {
    phase: 'Phase 3',
    title: 'Programmable Mesh',
    outcome: 'Module registry, schema registry, policy engine, and simulation gating live.',
  },
  {
    phase: 'Phase 4',
    title: 'Agentic Execution',
    outcome: 'Agentic RAG proposals, policy review, and controlled execution into L1 events.',
  },
  {
    phase: 'Phase 5',
    title: 'Monetization at Scale',
    outcome: 'x402 metering for API routes, enterprise access, and protocol usage billing.',
  },
];
