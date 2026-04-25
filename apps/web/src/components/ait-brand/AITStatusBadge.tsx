interface AITStatusBadgeProps {
  status: 'LIVE' | 'DILIGENCE' | 'REVIEW_REQUIRED' | 'RESTRICTED' | 'READY_FOR_ANCHOR' | 'LEGAL_REVIEW_REQUIRED' | 'READY_FOR_RENDER' | 'STORYBOARD_READY';
  className?: string;
}

const statusClassMap: Record<AITStatusBadgeProps['status'], string> = {
  LIVE: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/50',
  DILIGENCE: 'bg-[#D4AF37]/15 text-[#F5D36B] border-[#D4AF37]/50',
  REVIEW_REQUIRED: 'bg-orange-500/15 text-orange-300 border-orange-400/50',
  RESTRICTED: 'bg-red-500/15 text-red-300 border-red-400/50',
  READY_FOR_ANCHOR: 'bg-sky-500/15 text-sky-300 border-sky-400/50',
  LEGAL_REVIEW_REQUIRED: 'bg-violet-500/15 text-violet-300 border-violet-400/50',
  READY_FOR_RENDER: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/50',
  STORYBOARD_READY: 'bg-blue-500/15 text-blue-300 border-blue-400/50',
};

export function AITStatusBadge({ status, className }: AITStatusBadgeProps) {
  return <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold tracking-wide ${statusClassMap[status]} ${className ?? ''}`}>{status}</span>;
}
