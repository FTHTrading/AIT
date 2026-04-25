'use client';

export default function SignalsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-cyan-400">Signal Monitor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['ECG', 'SpO2', 'Capnography', 'EEG', 'Ventilator', 'EMG', 'PPG'].map((sig) => (
          <div key={sig} className="panel">
            <h2 className="panel-title">{sig}</h2>
            <div className="h-32 flex items-center justify-center text-gray-600 text-sm border border-gray-800 rounded bg-gray-950">
              Waveform canvas — connect telemetry to render
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2 className="panel-title">Signal Programs</h2>
        <div className="flex gap-3">
          <button className="bg-cyan-900/40 text-cyan-300 hover:bg-cyan-800/60 px-4 py-2 rounded text-sm font-medium">
            Standard Monitoring
          </button>
          <button className="bg-cyan-900/40 text-cyan-300 hover:bg-cyan-800/60 px-4 py-2 rounded text-sm font-medium">
            Neuro Monitoring
          </button>
          <button className="bg-cyan-900/40 text-cyan-300 hover:bg-cyan-800/60 px-4 py-2 rounded text-sm font-medium">
            Custom Program
          </button>
        </div>
      </div>
    </div>
  );
}
