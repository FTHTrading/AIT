import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BIOFIELD OS — Simulation Lab',
  description: 'Simulation design, profile editor, and scenario workbench',
};

export default function SimLabLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen font-mono antialiased">
        <header className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-wider text-emerald-400">SIM LAB</span>
            <span className="text-xs text-gray-500">BIOFIELD OS</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <a href="/" className="hover:text-emerald-400 transition">Workbench</a>
            <a href="/profiles" className="hover:text-emerald-400 transition">Profiles</a>
            <a href="/scenarios" className="hover:text-emerald-400 transition">Scenarios</a>
          </nav>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
