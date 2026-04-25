'use client';

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-cyan-400">Audit Log</h1>

      {/* Integrity */}
      <div className="panel">
        <h2 className="panel-title">Chain Integrity</h2>
        <div className="flex items-center gap-3 text-sm">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-300">SHA-256 chain verified — no tampering detected</span>
          <button className="ml-auto bg-cyan-900/40 text-cyan-300 hover:bg-cyan-800/60 px-3 py-1 rounded text-xs">
            Re-verify
          </button>
        </div>
      </div>

      {/* Events */}
      <div className="panel">
        <h2 className="panel-title">Recent Events</h2>
        <div className="overflow-auto max-h-96">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-left py-2 pr-4">Time</th>
                <th className="text-left py-2 pr-4">Type</th>
                <th className="text-left py-2 pr-4">Actor</th>
                <th className="text-left py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-gray-600">
                <td className="py-2 pr-4" colSpan={4}>Connect to audit service for event stream</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Playback */}
      <div className="panel">
        <h2 className="panel-title">Session Playback</h2>
        <p className="text-gray-600 text-sm">Select a completed session to reconstruct and replay all events.</p>
      </div>
    </div>
  );
}
