import React from 'react';

export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`border border-gray-800 rounded-lg bg-gray-900/50 p-4 ${className}`}>{children}</div>;
}

export function PanelTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">{children}</h2>;
}
