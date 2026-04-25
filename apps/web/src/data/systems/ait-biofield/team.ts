export interface TeamEntity {
  name: string;
  role: string;
  summary: string;
}

export const aitTeam: TeamEntity[] = [
  {
    name: 'AIT Holdings Trust',
    role: 'Sponsor Entity',
    summary:
      'Sponsor and source entity for Autologous Infusion Technologies and Therapies materials under diligence review.',
  },
  {
    name: 'W. John Flynn',
    role: 'Trust-side Regulatory and Investigations Operator',
    summary:
      'Professional profile includes regulatory and investigations background, accounting/CPA alignment, seminar and instruction experience, trustee-aligned operations, and AIT Holdings Trust participation.',
  },
  {
    name: 'Beneficial Services Trust',
    role: 'Affiliated Trust Entity',
    summary: 'Affiliated trust-side participant where referenced in source materials and diligence records.',
  },
  {
    name: 'UnyKorn Sovereign Infrastructure',
    role: 'Protocol and Infrastructure Operator',
    summary:
      'Provides protocol schemas, software modules, evidence infrastructure, RWA structuring support, and on-chain registry integrations.',
  },
];
