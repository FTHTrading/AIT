import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BIOFIELD OS — Command Center',
  description: 'AI-Orchestrated Gas, Signal, and Organ Support Research Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen font-mono antialiased">
        <header className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-wider text-cyan-400">BIOFIELD OS</span>
            <span className="text-xs text-gray-500">Command Center</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <a href="/ait" className="hover:text-cyan-400 transition">AIT Home</a>
            <a href="/systems" className="hover:text-cyan-400 transition">Systems</a>
            <a href="/ait" className="hover:text-cyan-400 transition">AIT</a>
            <a href="/protocol" className="hover:text-cyan-400 transition">Protocol</a>
            <a href="/l1" className="hover:text-cyan-400 transition">L1</a>
            <a href="/mesh" className="hover:text-cyan-400 transition">Mesh</a>
            <a href="/agents" className="hover:text-cyan-400 transition">Agents</a>
            <a href="/developers" className="hover:text-cyan-400 transition">Developers</a>
            <a href="/systems/ait-biofield" className="hover:text-cyan-400 transition">AIT Biofield</a>
            <a href="/admin/ait" className="hover:text-cyan-400 transition">Admin AIT</a>
            <a href="/gas" className="hover:text-cyan-400 transition">Gas Console</a>
            <a href="/signals" className="hover:text-cyan-400 transition">Signals</a>
            <a href="/organs" className="hover:text-cyan-400 transition">Organs</a>
            <a href="/safety" className="hover:text-cyan-400 transition">Safety</a>
            <a href="/audit" className="hover:text-cyan-400 transition">Audit</a>
          </nav>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
