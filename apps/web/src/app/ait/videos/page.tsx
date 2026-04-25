import { AITComplianceFooter, AITGlassCard, AITStatusBadge, AITVideoGallery } from '@/components/ait-brand';
import { AITVoiceGuide } from '@/components/voice';
import { aitVideos } from '@/data/ait/media';

export default function AITVideosPage() {
  return (
    <div className="space-y-6">
      <AITGlassCard title="AIT Video Gallery" accent="gold">
        <p className="text-sm text-slate-300">Cinematic and explainer video pipeline with storyboard-ready cards and voiceover preview scripts.</p>
      </AITGlassCard>

      <AITVideoGallery />

      <AITGlassCard title="Storyboard + Voiceover Status" accent="blue">
        <div className="grid gap-2 md:grid-cols-2">
          {aitVideos.map((video) => (
            <div key={video.slug} className="rounded-lg border border-slate-700/70 bg-[#02070D]/60 p-3">
              <p className="text-sm font-semibold text-white">{video.title}</p>
              <p className="mt-1 text-xs text-slate-300">{video.suggestedDuration}</p>
              <div className="mt-2 flex items-center gap-2">
                <AITStatusBadge status={video.status} />
                <span className="text-xs text-[#4DEBFF]">Voiceover {video.voiceoverScriptStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </AITGlassCard>

      <AITComplianceFooter />
      <AITVoiceGuide route="/ait/videos" />
    </div>
  );
}