interface VoiceControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onExplain: () => void;
  onSummarize: () => void;
  onRead: () => void;
  speaking: boolean;
}

function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-md border border-[#00AEEF]/40 bg-[#06111F]/80 px-2 py-1 text-xs text-[#F8FAFC] hover:border-[#4DEBFF]">
      {label}
    </button>
  );
}

export function VoiceControls({ onPlay, onPause, onStop, onExplain, onSummarize, onRead, speaking }: VoiceControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button label={speaking ? 'Replay' : 'Play'} onClick={onPlay} />
      <Button label="Pause" onClick={onPause} />
      <Button label="Stop" onClick={onStop} />
      <Button label="Explain this page" onClick={onExplain} />
      <Button label="Summarize this section" onClick={onSummarize} />
      <Button label="Read page aloud" onClick={onRead} />
    </div>
  );
}
