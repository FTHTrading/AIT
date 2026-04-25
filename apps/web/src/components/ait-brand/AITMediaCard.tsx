import { AITGlassCard } from './AITGlassCard';
import { AITStatusBadge } from './AITStatusBadge';

interface AITMediaCardProps {
  title: string;
  description: string;
  typeLabel: string;
  href?: string;
  status?: 'LIVE' | 'DILIGENCE' | 'REVIEW_REQUIRED' | 'RESTRICTED' | 'READY_FOR_ANCHOR' | 'LEGAL_REVIEW_REQUIRED' | 'READY_FOR_RENDER' | 'STORYBOARD_READY';
  imagePath?: string;
  imageAlt?: string;
  fallbackLabel?: string;
  ctaLabel?: string;
  complianceNote?: string;
}

export function AITMediaCard({
  title,
  description,
  typeLabel,
  href,
  status,
  imagePath,
  imageAlt,
  fallbackLabel = 'Asset preview',
  ctaLabel = 'Open',
  complianceNote,
}: AITMediaCardProps) {
  return (
    <AITGlassCard accent="blue" className="space-y-3">
      <div className="aspect-video overflow-hidden rounded-xl border border-slate-700/70 bg-gradient-to-br from-[#06111F] to-[#02070D]">
        {imagePath ? (
          <img src={imagePath} alt={imageAlt || title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-300">{fallbackLabel}</div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-[#F8FAFC]">{title}</h3>
          {status ? <AITStatusBadge status={status} /> : null}
        </div>
        <p className="text-xs uppercase tracking-widest text-[#4DEBFF]">{typeLabel}</p>
        <p className="text-sm text-slate-300">{description}</p>
        {complianceNote ? <p className="text-xs text-[#F5D36B]">{complianceNote}</p> : null}
        {href ? (
          <a href={href} className="inline-flex rounded-lg border border-[#D4AF37]/60 bg-[#D4AF37]/10 px-3 py-2 text-xs font-semibold text-[#F5D36B] hover:bg-[#D4AF37]/20">
            {ctaLabel}
          </a>
        ) : (
          <span className="inline-flex rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">Coming Soon</span>
        )}
      </div>
    </AITGlassCard>
  );
}
