'use client';

import { useEffect, useState } from 'react';

interface GasPreset {
  name: string;
  channels: { gasType: string; flowLpm: number; concentrationPct: number }[];
}

export default function GasConsolePage() {
  const [presets, setPresets] = useState<GasPreset[]>([]);

  useEffect(() => {
    fetch('/api/v1/gas/presets')
      .then((r) => r.json())
      .then((d) => setPresets(d.presets ?? []))
      .catch(() => {});
  }, []);

  function sendCommand(gasType: string, flow: number, pct: number) {
    fetch('/api/v1/gas/commands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gasType, targetFlowLpm: flow, targetConcentrationPct: pct, rampDurationMs: 5000 }),
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-cyan-400">Gas Console</h1>

      {/* Presets */}
      <div className="panel">
        <h2 className="panel-title">Presets</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presets.map((p) => (
            <button
              key={p.name}
              className="panel text-left hover:border-cyan-700 transition"
              onClick={() => p.channels.forEach((c) => sendCommand(c.gasType, c.flowLpm, c.concentrationPct))}
            >
              <div className="text-sm font-medium text-cyan-300">{p.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {p.channels.map((c) => `${c.gasType} ${c.concentrationPct}%`).join(' + ')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual command */}
      <div className="panel">
        <h2 className="panel-title">Manual Gas Command</h2>
        <form
          className="flex gap-3 items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            sendCommand(
              fd.get('gasType') as string,
              Number(fd.get('flow')),
              Number(fd.get('concentration')),
            );
          }}
        >
          <label className="text-xs text-gray-400">
            Gas
            <select name="gasType" className="block bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1 text-sm">
              <option>O2</option><option>air</option><option>N2O</option><option>CO2</option><option>He</option>
            </select>
          </label>
          <label className="text-xs text-gray-400">
            Flow (L/min)
            <input name="flow" type="number" defaultValue={2} className="block bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1 text-sm w-24" />
          </label>
          <label className="text-xs text-gray-400">
            Concentration (%)
            <input name="concentration" type="number" defaultValue={50} className="block bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1 text-sm w-24" />
          </label>
          <button type="submit" className="bg-cyan-900/40 text-cyan-300 hover:bg-cyan-800/60 px-4 py-2 rounded text-sm font-medium">Send</button>
        </form>
      </div>
    </div>
  );
}
