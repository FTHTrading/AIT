export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const resolved = await searchParams;
  const errorMessage =
    resolved.error === 'unauthorized'
      ? 'Your session is valid, but your role does not allow access to that admin surface.'
      : resolved.error === 'invalid'
      ? 'The supplied admin credentials were rejected.'
      : resolved.error === 'signin'
      ? 'Sign in to continue to the AIT admin surfaces.'
      : null;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-6">
      <section className="panel w-full space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">AIT Admin Sign In</h1>
          <p className="text-sm text-gray-300">
            Use an env-configured admin account from <span className="font-mono">AIT_ADMIN_USERS_JSON</span> to access the hardened
            review control plane.
          </p>
        </div>

        {errorMessage ? <div className="rounded border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-200">{errorMessage}</div> : null}

        <form method="POST" action="/api/admin/auth/login" className="space-y-4">
          <input type="hidden" name="next" value={resolved.next || '/admin/ait'} />
          <label className="block space-y-2 text-sm text-gray-200">
            <span>Username</span>
            <input
              name="username"
              required
              className="w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-cyan-500"
            />
          </label>
          <label className="block space-y-2 text-sm text-gray-200">
            <span>Password</span>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100 outline-none focus:border-cyan-500"
            />
          </label>
          <button type="submit" className="rounded border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200">
            Sign In
          </button>
        </form>
      </section>
    </div>
  );
}