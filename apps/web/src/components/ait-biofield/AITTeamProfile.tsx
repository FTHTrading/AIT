import { aitTeam } from '@/data/systems/ait-biofield/team';

export function AITTeamProfile() {
  return (
    <section className="space-y-3">
      <h2 className="panel-title">Who They Are</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {aitTeam.map((member) => (
          <article key={member.name} className="panel space-y-1">
            <h3 className="text-base font-semibold text-cyan-300">{member.name}</h3>
            <p className="text-xs uppercase tracking-wider text-gray-500">{member.role}</p>
            <p className="text-sm text-gray-300">{member.summary}</p>
          </article>
        ))}
      </div>
      <p className="text-xs text-gray-500">Private KYC identifiers are excluded from this public module by design.</p>
    </section>
  );
}
