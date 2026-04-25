'use client';

export default function SafetyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-cyan-400">Safety Controls</h1>

      {/* Emergency Stop */}
      <div className="panel border-red-900/50">
        <h2 className="panel-title text-red-400">Emergency Stop</h2>
        <div className="flex gap-4 items-center">
          <button
            className="bg-red-800 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-red-700 transition"
            onClick={() =>
              fetch('/api/v1/safety/emergency-stop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: 'Manual operator E-stop', triggeredBy: 'operator' }),
              })
            }
          >
            E-STOP
          </button>
          <button
            className="bg-gray-800 text-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-700 transition"
            onClick={() =>
              fetch('/api/v1/safety/emergency-stop/resolve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resolvedBy: 'operator' }),
              })
            }
          >
            Resolve E-Stop
          </button>
        </div>
      </div>

      {/* Active Alarms */}
      <div className="panel">
        <h2 className="panel-title">Active Alarms</h2>
        <p className="text-gray-600 text-sm">No active alarms — connect to safety service for live data</p>
      </div>

      {/* Safety Locks */}
      <div className="panel">
        <h2 className="panel-title">Safety Locks</h2>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <div className="stat-value text-green-400">0</div>
            <div className="stat-label">Advisory</div>
          </div>
          <div className="text-center">
            <div className="stat-value text-yellow-400">0</div>
            <div className="stat-label">Enforced</div>
          </div>
          <div className="text-center">
            <div className="stat-value text-red-400">0</div>
            <div className="stat-label">Emergency</div>
          </div>
        </div>
      </div>

      {/* Constraints */}
      <div className="panel">
        <h2 className="panel-title">Active Constraints</h2>
        <p className="text-gray-600 text-sm">9 default constraints loaded — SpO2, plateau, MAP, HR, pH, lactate, UO, SOFA</p>
      </div>
    </div>
  );
}
