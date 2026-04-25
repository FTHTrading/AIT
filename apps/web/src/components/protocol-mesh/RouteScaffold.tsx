export function RouteScaffold({
  title,
  description,
  route,
  tags,
}: {
  title: string;
  description: string;
  route: string;
  tags?: string[];
}) {
  return (
    <div className="space-y-6">
      <section className="panel space-y-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-gray-300">{description}</p>
        <p className="text-xs text-gray-500">Route: {route}</p>
      </section>
      {tags && tags.length > 0 && (
        <section className="panel">
          <h2 className="panel-title">Tags</h2>
          <div className="flex flex-wrap gap-2 text-xs text-gray-300">
            {tags.map((tag) => (
              <span key={tag} className="rounded border border-gray-700 px-2 py-1">{tag}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
