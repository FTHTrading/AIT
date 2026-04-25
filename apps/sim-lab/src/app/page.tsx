'use client';

export default function SimLabWorkbench() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-emerald-400">Simulation Workbench</h1>

      {/* Scenario Designer */}
      <div className="border border-gray-800 rounded-lg bg-gray-900/50 p-4">
        <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">Scenario Designer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-800 rounded p-3">
            <h3 className="text-sm text-emerald-300 mb-2">Patient Profile</h3>
            <select className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm">
              <option>Default Adult (70kg)</option>
              <option>Pediatric (20kg)</option>
              <option>Custom...</option>
            </select>
          </div>
          <div className="border border-gray-800 rounded p-3">
            <h3 className="text-sm text-emerald-300 mb-2">Gas Setup</h3>
            <select className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm">
              <option>Room Air</option>
              <option>Low-flow O2</option>
              <option>High-flow O2</option>
              <option>N2O/O2 Mix</option>
            </select>
          </div>
          <div className="border border-gray-800 rounded p-3">
            <h3 className="text-sm text-emerald-300 mb-2">Signal Program</h3>
            <select className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm">
              <option>Standard Monitoring</option>
              <option>Neuro Monitoring</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="border border-gray-800 rounded-lg bg-gray-900/50 p-4">
        <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">Event Timeline</h2>
        <div className="h-16 border border-gray-800 rounded bg-gray-950 flex items-center justify-center text-gray-600 text-sm">
          Drag events onto timeline — gas changes, signal injections, organ perturbations
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button className="bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60 px-6 py-2 rounded text-sm font-medium">
          Run Scenario
        </button>
        <button className="bg-gray-800 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded text-sm">
          Save Scenario
        </button>
        <button className="bg-gray-800 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded text-sm">
          Load Scenario
        </button>
      </div>
    </div>
  );
}
