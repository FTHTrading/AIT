"use client";

import { aitDocuments } from '@/data/ait/documents';
import { AITMediaCard } from './AITMediaCard';

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

export function AITPdfLibrary() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {aitDocuments.map((doc) => (
        <div key={doc.filename} className="space-y-2">
          <AITMediaCard
            title={doc.title}
            description={doc.description}
            typeLabel={`PDF • ${doc.category}`}
            href={doc.href}
            status={doc.status}
            fallbackLabel="PDF preview"
            ctaLabel="View Document"
            complianceNote={doc.complianceNote}
          />
          <button
            type="button"
            onClick={() => speak(`${doc.voiceSummary}. ${doc.complianceNote}`)}
            className="rounded-md border border-[#00AEEF]/45 bg-[#06111F]/80 px-3 py-2 text-xs text-[#4DEBFF]"
          >
            Listen to overview
          </button>
        </div>
      ))}
    </section>
  );
}
