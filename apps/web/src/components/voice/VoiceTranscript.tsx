export function VoiceTranscript({ text }: { text: string }) {
  return (
    <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-700/60 bg-[#02070D]/80 p-3 text-xs text-slate-200">
      {text || 'No transcript yet. Choose an action to generate narration text.'}
    </div>
  );
}
