'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

interface Flashcard {
  _id: string;
  front: string;
  back: string;
  difficulty: string;
  tags: string[];
}

export function FlashcardDeck({ moduleSlug }: { moduleSlug: string }) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/flashcards/${moduleSlug}`)
      .then(res => res.json())
      .then(data => {
        setCards(data);
        setLoading(false);
      });
  }, [moduleSlug]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      // Wait for flip back before changing content for smoothness
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  if (loading) return <div className="h-64 animate-pulse bg-white/5 rounded-xl border border-border" />;
  if (!cards.length) return null;

  const currentCard = cards[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6 my-8">
      <div className="flex justify-between w-full text-sm text-white/50">
        <span>Card {currentIndex + 1} of {cards.length}</span>
        <div className="flex gap-2">
          {currentCard.tags.map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 text-xs border border-border">{t}</span>
          ))}
          <span className="capitalize px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{currentCard.difficulty}</span>
        </div>
      </div>

      <div 
        className="relative w-full aspect-[4/3] sm:aspect-video cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="w-full h-full relative"
          initial={false}
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black border border-border rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl group-hover:border-white/20 transition-colors"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-white text-center leading-relaxed">
              {currentCard.front}
            </h3>
            <div className="absolute bottom-6 text-xs text-white/30 flex items-center gap-2">
              <RotateCw className="w-3 h-3" /> Click to flip
            </div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-zinc-900 border border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl shadow-indigo-900/20"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
          >
            <div className="text-lg md:text-xl text-white/90 text-center leading-relaxed whitespace-pre-wrap">
              {currentCard.back}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-white/5 border border-border text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="p-3 rounded-full bg-white/5 border border-border text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:border-indigo-500/50 hover:text-indigo-400"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
