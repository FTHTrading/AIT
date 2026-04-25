export function WasmRuntimeCard() {
  return (
    <section className="panel space-y-2">
      <h2 className="panel-title">WASM Runtime (Scaffold)</h2>
      <p className="text-sm text-gray-300">
        Deterministic sandbox interface for module upload, module hashing, capability permissions, gas metering, and event output.
      </p>
      <p className="text-xs text-gray-500">Current status: interface scaffolded, execution hooks reserved for Rust runtime integration.</p>
    </section>
  );
}
