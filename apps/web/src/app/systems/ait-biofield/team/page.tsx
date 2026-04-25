import { AITTeamProfile, AITDisclaimerBlock } from '@/components/ait-biofield';

export default function AITTeamPage() {
  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Team and Entities</h1>
        <p className="text-sm text-gray-300 mt-2">
          Public-safe team and trust-side profiles with private KYC and sensitive IDs excluded.
        </p>
      </section>
      <AITTeamProfile />
      <AITDisclaimerBlock />
    </div>
  );
}
