'use client';

import { useMemo, useState } from 'react';
import { getNarrationByRoute } from '@/data/ait/voiceNarrations';
import { getVoiceDisclaimer, safetyCheck, type VoiceRole } from '@/lib/voice/safety';
import { VoiceControls } from './VoiceControls';
import { VoiceTranscript } from './VoiceTranscript';

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
  return true;
}

export function AITVoiceGuide({ route, role = 'ANON' }: { route: string; role?: VoiceRole }) {
  const [open, setOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const narration = useMemo(() => getNarrationByRoute(route), [route]);
  const disclaimer = useMemo(() => getVoiceDisclaimer(route), [route]);
  const safeNarrationText = narration?.fullNarration || 'This route has no dedicated narration yet. Public-safe summary mode is active.';

  function runVoice(text: string) {
    const check = safetyCheck(route, text, role);
    if (!check.allowed) {
      setTranscript(`Narration blocked: ${check.reasons.join(' ')}`);
      return;
    }

    setTranscript(`${check.sanitizedText}\n\nDisclaimer: ${check.disclaimer}`);
    const started = speak(`${check.sanitizedText}. ${check.disclaimer}`);
    setSpeaking(started);
  }

  function handlePause() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause();
      setSpeaking(false);
    }
  }

  function handleStop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[330px]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="mb-2 ml-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-gradient-to-br from-[#06111F] to-[#02070D] shadow-[0_0_24px_rgba(0,174,239,0.45)]"
        aria-label="Toggle voice guide"
      >
        <span className="text-xs font-semibold text-[#4DEBFF]">Listen</span>
      </button>

      {open ? (
        <section className="space-y-3 rounded-2xl border border-[#00AEEF]/45 bg-[#06111F]/85 p-4 backdrop-blur-xl">
          <div>
            <h3 className="text-sm font-semibold text-[#F8FAFC]">AIT Voice Guide</h3>
            <p className="text-xs text-slate-300">{narration?.shortIntro || 'Public-safe narration helper'}</p>
          </div>

          <VoiceControls
            speaking={speaking}
            onPlay={() => runVoice(safeNarrationText)}
            onPause={handlePause}
            onStop={handleStop}
            onExplain={() => runVoice(safeNarrationText)}
            onSummarize={() => runVoice(narration?.shortIntro || 'Summary is not available for this route yet.')}
            onRead={() => runVoice(`${safeNarrationText} ${disclaimer}`)}
          />

          <VoiceTranscript text={transcript} />

          <p className="text-[11px] text-[#F5D36B]">{disclaimer}</p>
        </section>
      ) : null}
    </div>
  );
}
