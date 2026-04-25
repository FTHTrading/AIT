import { L1OverviewHero, ModuleRegistryTable, PolicyDecisionPanel, AnchorProofViewer } from '@/components/protocol-mesh';

export default function L1Page() {
  return (
    <div className="space-y-6">
      <L1OverviewHero />
      <ModuleRegistryTable />
      <PolicyDecisionPanel />
      <AnchorProofViewer />
    </div>
  );
}
