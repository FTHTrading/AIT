import type { ReactNode } from 'react';

interface AITGlassCardProps {
  title?: string;
  children: ReactNode;
  accent?: 'gold' | 'blue' | 'neutral';
  className?: string;
}

const accentClassMap: Record<NonNullable<AITGlassCardProps['accent']>, string> = {
  gold: 'border-[#D4AF37]/45 shadow-[0_0_30px_rgba(212,175,55,0.15)]',
  blue: 'border-[#00AEEF]/45 shadow-[0_0_30px_rgba(0,174,239,0.16)]',
  neutral: 'border-slate-700/60 shadow-[0_0_22px_rgba(77,235,255,0.08)]',
};

export function AITGlassCard({ title, children, accent = 'neutral', className }: AITGlassCardProps) {
  return (
    <section className={`rounded-2xl border bg-[#06111F]/55 p-5 backdrop-blur-md ${accentClassMap[accent]} ${className ?? ''}`}>
      {title ? <h2 className="mb-3 text-lg font-semibold text-[#F8FAFC]">{title}</h2> : null}
      {children}
    </section>
  );
}
