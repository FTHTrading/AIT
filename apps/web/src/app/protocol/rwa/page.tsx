import { RwaModuleCard, ComplianceGateMatrix } from '@/components/protocol-mesh';

export default function ProtocolRWAPage() {
  return (
    <div className="space-y-6">
      <RwaModuleCard />
      <ComplianceGateMatrix />
    </div>
  );
}
