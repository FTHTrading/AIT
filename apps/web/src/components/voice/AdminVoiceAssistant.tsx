import { AITGlassCard } from '@/components/ait-brand';

export function AdminVoiceAssistant({
  route,
  totalItems,
  statuses,
}: {
  route: string;
  totalItems: number;
  statuses: Array<{ label: string; count: number }>;
}) {
  return (
    <AITGlassCard title="Admin Voice Assistant" accent="gold">
      <p className="text-sm text-slate-300">
        Route summary for {route}. This assistant narrates metadata and status counts only. Private raw payloads are never narrated.
      </p>
      <p className="mt-2 text-xs text-[#F5D36B]">Admin review content may include restricted metadata. Private data is not narrated.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-md border border-slate-700 bg-[#02070D]/70 px-3 py-2 text-xs text-slate-200">Total queue items: {totalItems}</div>
        {statuses.map((status) => (
          <div key={status.label} className="rounded-md border border-slate-700 bg-[#02070D]/70 px-3 py-2 text-xs text-slate-200">
            {status.label}: {status.count}
          </div>
        ))}
      </div>
    </AITGlassCard>
  );
}
