import { aitBiofieldSystemCard } from '@/data/systems/ait-biofield/ait-biofield';

export function AITHero() {
  return (
    <section className="panel space-y-3">
      <p className="text-xs uppercase tracking-widest text-cyan-400">{aitBiofieldSystemCard.category}</p>
      <h1 className="text-3xl font-bold">AIT Biofield Infrastructure Layer</h1>
      <p className="text-gray-300">
        Evidence, licensing, protocol, and RWA infrastructure for Autologous Infusion Technologies and Therapies.
      </p>
      <p className="text-sm text-gray-400">
        Turning therapeutic innovation into verifiable, financeable, protocol-governed infrastructure.
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="rounded border border-cyan-700 bg-cyan-950/50 px-2 py-1 text-xs text-cyan-300">Status: {aitBiofieldSystemCard.status}</span>
        <span className="rounded border border-gray-700 bg-gray-800/60 px-2 py-1 text-xs text-gray-200">Claims Governance Enabled</span>
        <span className="rounded border border-gray-700 bg-gray-800/60 px-2 py-1 text-xs text-gray-200">KYC Private by Design</span>
      </div>
    </section>
  );
}
