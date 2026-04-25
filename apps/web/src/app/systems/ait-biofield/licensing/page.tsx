import { RouteScaffold, ComplianceGateMatrix } from '@/components/protocol-mesh';

export default function AITSystemLicensingPage() {
  return (
    <div className="space-y-6">
      <RouteScaffold
        title="AIT Licensing Engine"
        description="Rights packaging by territory, center, use case, protocol access, and compliance gate status."
        route="/systems/ait-biofield/licensing"
      />
      <ComplianceGateMatrix />
    </div>
  );
}
