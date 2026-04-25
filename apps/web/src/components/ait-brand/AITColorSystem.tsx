import { aitBrandColors } from '@/data/ait/media';
import { AITGlassCard } from './AITGlassCard';

const swatchClassByHex: Record<string, string> = {
  '#06111F': 'bg-[#06111F]',
  '#02070D': 'bg-[#02070D]',
  '#00AEEF': 'bg-[#00AEEF]',
  '#4DEBFF': 'bg-[#4DEBFF]',
  '#D4AF37': 'bg-[#D4AF37]',
  '#F5D36B': 'bg-[#F5D36B]',
  '#F8FAFC': 'bg-[#F8FAFC]',
  '#94A3B8': 'bg-[#94A3B8]',
  '#F97316': 'bg-[#F97316]',
  '#22C55E': 'bg-[#22C55E]',
  '#EF4444': 'bg-[#EF4444]',
};

function getSwatchClass(hex: string): string {
  return swatchClassByHex[hex] ?? 'bg-[#02070D]';
}

export function AITColorSystem() {
  return (
    <AITGlassCard title="Brand Color System" accent="gold">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {aitBrandColors.map((color) => (
          <div key={color.hex} className="rounded-xl border border-slate-700/70 bg-[#02070D]/70 p-3">
            <div className={`h-16 rounded-lg border border-white/10 ${getSwatchClass(color.hex)}`} />
            <p className="mt-2 text-sm font-semibold text-white">{color.label}</p>
            <p className="text-xs text-slate-300">{color.hex}</p>
          </div>
        ))}
      </div>
    </AITGlassCard>
  );
}
