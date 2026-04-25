import { buildExamplePayloads } from '@/lib/ait/engine';
import { AITVoiceGuide } from '@/components/voice';

export default function DemoAdminReviewPage() {
  const examples = buildExamplePayloads();

  return (
    <div className="space-y-6">
      <section className="panel">
        <h1 className="text-2xl font-bold">Demo Admin Review</h1>
        <p className="mt-2 text-sm text-gray-300">Static review-status and anchor-ready sample for demo-safe walkthroughs.</p>
      </section>
      <section className="panel grid gap-2 md:grid-cols-2 text-xs text-gray-300">
        {examples.reviewStatuses.map((status) => (
          <div key={status} className="rounded border border-gray-800 px-3 py-2 text-cyan-300">
            {status}
          </div>
        ))}
      </section>
      <section className="panel">
        <pre className="overflow-x-auto rounded border border-gray-800 bg-black/20 p-3 text-xs text-cyan-200">
          {JSON.stringify({ claimReview: examples.claimReview, polygonAnchor: examples.polygonAnchor }, null, 2)}
        </pre>
      </section>
      <AITVoiceGuide route="/demo/admin-review" />
    </div>
  );
}