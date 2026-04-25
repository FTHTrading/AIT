import React from 'react';

const SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-yellow-900/30 text-yellow-400',
  medium: 'bg-orange-900/30 text-orange-400',
  high: 'bg-red-900/30 text-red-400',
  critical: 'bg-red-700/50 text-red-300 animate-pulse',
};

export function AlarmBadge({ severity, label }: { severity: string; label: string }) {
  const colors = SEVERITY_COLORS[severity] ?? 'bg-gray-800 text-gray-400';
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors}`}>{label}</span>;
}
