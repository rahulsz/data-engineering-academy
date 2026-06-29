'use client';

import React, { useState } from "react";
import { Layers } from "lucide-react";
import { FlashcardDeck } from "@/app/(learn)/learn/_components/FlashcardDeck";

export function FlashcardEmbed({ moduleSlug }: { moduleSlug: string }) {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <div className="my-8">
        <FlashcardDeck moduleSlug={moduleSlug} />
      </div>
    );
  }

  return (
    <div className="my-8 rounded-xl border border-blue-500/30 bg-blue-950/10 p-8 text-center flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="p-4 bg-blue-500/20 rounded-2xl mb-4 relative z-10">
        <Layers className="w-8 h-8 text-blue-400" />
      </div>
      <h4 className="text-lg font-display font-semibold text-white mb-2 relative z-10">
        Active Recall: Flashcards
      </h4>
      <p className="text-slate-400 max-w-md relative z-10">
        Review key concepts with spaced repetition flashcards.
      </p>
      <button 
        onClick={() => setStarted(true)}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-500 transition-colors relative z-10 shadow-lg shadow-blue-500/20"
      >
        Start Review
      </button>
    </div>
  );
}
