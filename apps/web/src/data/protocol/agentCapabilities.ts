export interface AgentCapability {
  id: string;
  name: string;
  scope: string;
  requiresSimulation: boolean;
  requiresPolicyGate: boolean;
  requiresHumanApproval: boolean;
}

export const agentCapabilities: AgentCapability[] = [
  {
    id: 'cap-doc-intel',
    name: 'Document Intelligence',
    scope: 'Extract claims, entities, and schema candidates from source docs.',
    requiresSimulation: false,
    requiresPolicyGate: true,
    requiresHumanApproval: false,
  },
  {
    id: 'cap-module-codegen',
    name: 'Module Code Generation',
    scope: 'Generate schema and route scaffolds for registered modules.',
    requiresSimulation: true,
    requiresPolicyGate: true,
    requiresHumanApproval: true,
  },
  {
    id: 'cap-action-proposal',
    name: 'Protocol Action Proposal',
    scope: 'Propose events and state transitions; cannot execute directly.',
    requiresSimulation: true,
    requiresPolicyGate: true,
    requiresHumanApproval: true,
  },
];
