import { RouteScaffold } from '@/components/protocol-mesh';

export default function AITContactPage() {
  return (
    <RouteScaffold
      title="AIT Contact"
      description="Counterparty intake for licensing, diligence-room access, and enterprise integration requests."
      route="/ait/contact"
      tags={['licensing', 'investors', 'implementation']}
    />
  );
}
