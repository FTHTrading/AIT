'use client';

const ORGANS = ['lung', 'cardiac', 'renal', 'metabolic', 'inflammatory'] as const;

export default function OrgansPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-cyan-400">Organ System Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ORGANS.map((organ) => (
          <div key={organ} className="panel">
            <h2 className="panel-title capitalize">{organ}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-400">Normal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Trend</span>
                <span className="text-gray-300">Stable</span>
              </div>
              <div className="h-20 border border-gray-800 rounded bg-gray-950 flex items-center justify-center text-gray-600 text-xs">
                Trend sparkline — connect telemetry
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2 className="panel-title">Cross-Organ Coupling Map</h2>
        <div className="text-sm text-gray-500">
          Gas → Lung → Cardiac → Renal → Metabolic → Inflammatory (cascade visualization placeholder)
        </div>
      </div>
    </div>
  );
}
