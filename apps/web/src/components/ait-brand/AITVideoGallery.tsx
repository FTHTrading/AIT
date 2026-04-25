"use client";

import { aitVideos } from '@/data/ait/media';
import { aitVideoScripts } from '@/data/ait/videoScripts';
import { AITMediaCard } from './AITMediaCard';

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

export function AITVideoGallery() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {aitVideos.map((video) => (
        <div key={video.slug} className="space-y-2">
          <AITMediaCard
            title={video.title}
            description={`${video.description} Duration: ${video.suggestedDuration}. Voiceover script: ${video.voiceoverScriptStatus}.`}
            typeLabel="Video"
            href={video.status === 'LIVE' ? video.videoPath : undefined}
            status={video.status}
            imagePath={video.posterPath}
            imageAlt={`${video.title} poster`}
            ctaLabel={video.status === 'LIVE' ? 'Watch' : 'Coming Soon'}
            complianceNote={video.status === 'LIVE' ? undefined : 'Storyboard ready. Video render pending.'}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const script = aitVideoScripts.find((item) => item.videoSlug === video.slug);
                speak(script?.script || video.description);
              }}
              className="rounded-md border border-[#00AEEF]/45 bg-[#06111F]/80 px-3 py-2 text-xs text-[#4DEBFF]"
            >
              Play voiceover preview
            </button>
            <details className="rounded-md border border-slate-700 bg-[#02070D]/70 px-3 py-2 text-xs text-slate-200">
              <summary className="cursor-pointer text-[#F5D36B]">View script</summary>
              <p className="mt-2">
                {aitVideoScripts.find((item) => item.videoSlug === video.slug)?.script || 'Script in progress.'}
              </p>
            </details>
          </div>
        </div>
      ))}
    </section>
  );
}
