'use client';

export default function ProfilesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-emerald-400">Patient Profiles</h1>

      <div className="border border-gray-800 rounded-lg bg-gray-900/50 p-4">
        <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">Create Profile</h2>
        <form className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <label className="text-gray-400">
            Label
            <input className="block w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1" defaultValue="Adult Default" />
          </label>
          <label className="text-gray-400">
            Age
            <input type="number" className="block w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1" defaultValue={45} />
          </label>
          <label className="text-gray-400">
            Weight (kg)
            <input type="number" className="block w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1" defaultValue={70} />
          </label>
          <label className="text-gray-400">
            Height (cm)
            <input type="number" className="block w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 mt-1" defaultValue={175} />
          </label>
        </form>
        <button className="mt-3 bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60 px-4 py-2 rounded text-sm font-medium">
          Save Profile
        </button>
      </div>

      <div className="border border-gray-800 rounded-lg bg-gray-900/50 p-4">
        <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">Saved Profiles</h2>
        <p className="text-gray-600 text-sm">Connect to organ-twin service to manage patient profiles.</p>
      </div>
    </div>
  );
}
