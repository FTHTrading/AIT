import React from 'react';

export function StatCard({ label, value, warn }: { label: string; value: string | number; warn?: boolean }) {
  return (
    <div className="border border-gray-800 rounded-lg bg-gray-900/50 p-4 text-center">
      <div className={`text-2xl font-bold tabular-nums ${warn ? 'text-red-400' : 'text-cyan-400'}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
