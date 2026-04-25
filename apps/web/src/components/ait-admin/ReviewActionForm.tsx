'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminRole } from '@/lib/ait/types';
import { reviewActionOptions, type ReviewAction } from '@/lib/ait/review-actions';

export function ReviewActionForm({ reviewId, role }: { reviewId: string; role: AdminRole }) {
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const allowedActions = reviewActionOptions.filter((action) => action.allowedRoles.includes(role) || role === 'ADMIN');

  function submitAction(action: ReviewAction) {
    startTransition(async () => {
      setError(null);

      const response = await fetch('/api/admin/ait/reviews/update', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          reviewId,
          action,
          notes: notes.trim() ? [notes.trim()] : [],
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error || 'Unable to update review.');
        return;
      }

      setNotes('');
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs text-gray-400">
        <span className="mb-1 block">Reviewer note</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          className="w-full rounded border border-gray-800 bg-gray-950/70 px-3 py-2 text-xs text-gray-200 outline-none focus:border-cyan-500"
          placeholder="Optional audit note for this review action"
        />
      </label>

      {error ? <div className="rounded border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs text-red-200">{error}</div> : null}

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {allowedActions.map((action) => (
          <button
            key={action.action}
            type="button"
            disabled={isPending}
            onClick={() => submitAction(action.action)}
            className="rounded border border-cyan-500/20 px-3 py-1 text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {action.label.toLowerCase()}
          </button>
        ))}
      </div>

      {allowedActions.length === 0 ? (
        <div className="rounded border border-amber-500/20 bg-amber-950/20 px-3 py-2 text-xs text-amber-200">
          This role is read-only for review mutations.
        </div>
      ) : null}
    </div>
  );
}