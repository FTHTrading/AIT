import { AITGlassCard } from './AITGlassCard';
import { AITStatusBadge } from './AITStatusBadge';

interface AITLogoHeroProps {
  title: string;
  subtitle: string;
  supportingLine: string;
}

export function AITLogoHero({ title, subtitle, supportingLine }: AITLogoHeroProps) {
  return (
    <AITGlassCard className="relative overflow-hidden" accent="gold">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,174,239,0.22),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(212,175,55,0.18),transparent_35%)]" />
      <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <AITStatusBadge status="DILIGENCE" />
          <h1 className="text-4xl font-bold text-[#F8FAFC] md:text-5xl">{title}</h1>
          <p className="text-xl text-[#4DEBFF] md:text-2xl">{subtitle}</p>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">{supportingLine}</p>
          <p className="text-sm font-semibold text-[#F5D36B]">Protect the IP. Prove the evidence. Govern the claims. Package the rights. Monetize the infrastructure.</p>
        </div>
        <div className="rounded-2xl border border-[#D4AF37]/45 bg-[#06111F]/70 p-4">
          <img
            src="/assets/ait/logos/ait-biofield-liquid-glass-logo.png"
            alt="AIT Biofield OS liquid glass logo"
            className="mx-auto h-full max-h-[300px] w-full rounded-xl object-contain"
          />
        </div>
      </div>
    </AITGlassCard>
  );
}
