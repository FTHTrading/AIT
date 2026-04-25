'use client';

export default function ScenariosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-emerald-400">Scenario Library</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Healthy Baseline', desc: 'Normal vitals, room air, all organs stable', difficulty: 'Easy' },
          { name: 'Hypoxemia Response', desc: 'Progressive SpO2 drop with O2 titration challenge', difficulty: 'Medium' },
          { name: 'Sepsis Cascade', desc: 'Inflammatory response → organ dysfunction cascade', difficulty: 'Hard' },
          { name: 'Anesthesia Induction', desc: 'N2O/O2 mix delivery with hemodynamic monitoring', difficulty: 'Medium' },
          { name: 'Ventilator Weaning', desc: 'Step-down O2 with spontaneous breathing trial', difficulty: 'Medium' },
          { name: 'Multi-Organ Failure', desc: 'Full cascade: lung → cardiac → renal → metabolic', difficulty: 'Expert' },
        ].map((s) => (
          <div key={s.name} className="border border-gray-800 rounded-lg bg-gray-900/50 p-4 hover:border-emerald-700 transition cursor-pointer">
            <h3 className="text-sm font-medium text-emerald-300">{s.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
            <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded ${
              s.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' :
              s.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
              s.difficulty === 'Hard' ? 'bg-orange-900/30 text-orange-400' :
              'bg-red-900/30 text-red-400'
            }`}>
              {s.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
