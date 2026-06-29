'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Frown, Meh, Smile } from 'lucide-react';

interface Flashcard {
  _id: string;
  front: string;
  back: string;
  hint?: string;
}

interface FlashcardDeckProps {
  cards: Flashcard[];
}

type Rating = 'easy' | 'medium' | 'hard';
type RatingsState = Record<string, Rating>;

export function FlashcardDeck({ cards: initialCards }: FlashcardDeckProps) {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ratings, setRatings] = useState<RatingsState>({});
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('de_flashcard_ratings');
    if (saved) {
      setRatings(JSON.parse(saved));
    }
  }, []);

  const saveRating = (id: string, rating: Rating) => {
    const newRatings = { ...ratings, [id]: rating };
    setRatings(newRatings);
    localStorage.setItem('de_flashcard_ratings', JSON.stringify(newRatings));
    setSessionReviewed(p => Math.min(cards.length, p + 1));
    handleNext();
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setTimeout(() => {
      setCurrentIndex((p) => (p + 1) % cards.length);
    }, 150); // wait for flip to finish before changing text
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setTimeout(() => {
      setCurrentIndex((p) => (p - 1 + cards.length) % cards.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setShowHint(false);
    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIndex(0);
      setSessionReviewed(0);
    }, 150);
  };

  const studyAgain = () => {
    setIsFlipped(false);
    setShowHint(false);
    setTimeout(() => {
      // Hard first, then Medium, skip Easy if possible. If all easy, show all.
      const hard = cards.filter(c => ratings[c._id] === 'hard');
      const med = cards.filter(c => ratings[c._id] === 'medium');
      const easy = cards.filter(c => ratings[c._id] === 'easy');
      
      let newQueue = [...hard, ...med];
      if (newQueue.length === 0) newQueue = [...cards]; // Fallback if all easy or unrated
      
      setCards(newQueue);
      setCurrentIndex(0);
      setSessionReviewed(0);
    }, 150);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsFlipped(p => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length]);

  if (cards.length === 0) {
    return <div className="p-8 text-center text-slate-400">No flashcards available in this deck.</div>;
  }

  const currentCard = cards[currentIndex];
  
  const stats = {
    easy: Object.values(ratings).filter(r => r === 'easy').length,
    medium: Object.values(ratings).filter(r => r === 'medium').length,
    hard: Object.values(ratings).filter(r => r === 'hard').length,
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      
      {/* Progress */}
      <div className="w-full mb-8 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>Session Progress</span>
          <span>{sessionReviewed} / {cards.length} cards</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-500" 
            initial={{ width: 0 }}
            animate={{ width: `${(sessionReviewed / cards.length) * 100}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-xl aspect-[4/3] perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* FRONT */}
              <div 
                className="absolute inset-0 backface-hidden bg-card border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                  <span className="text-xs font-bold text-white/30 tracking-widest uppercase">Question</span>
                  {ratings[currentCard._id] && (
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider
                      ${ratings[currentCard._id] === 'easy' ? 'bg-emerald-500/20 text-emerald-400' : 
                        ratings[currentCard._id] === 'hard' ? 'bg-red-500/20 text-red-400' : 
                        'bg-amber-500/20 text-amber-400'}`}
                    >
                      {ratings[currentCard._id]}
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl font-medium text-white leading-relaxed">{currentCard.front}</h3>
                
                {currentCard.hint && !showHint && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowHint(true); }}
                    className="absolute bottom-8 text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Show Hint
                  </button>
                )}
                {showHint && currentCard.hint && (
                  <div className="absolute bottom-6 left-6 right-6 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl text-indigo-300 text-sm">
                    {currentCard.hint}
                  </div>
                )}
              </div>

              {/* BACK */}
              <div 
                className="absolute inset-0 backface-hidden bg-background border-2 border-indigo-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_50px_rgba(99,102,241,0.1)]"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="absolute top-6 left-6 right-6 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-400/50 tracking-widest uppercase">Answer</span>
                </div>
                
                <div className="text-xl text-slate-300 leading-relaxed overflow-y-auto max-h-[60%] scrollbar-thin">
                  {currentCard.back}
                </div>

                <div 
                  className="absolute bottom-6 left-6 right-6 flex items-center gap-3"
                  onClick={e => e.stopPropagation()}
                >
                  <button onClick={() => saveRating(currentCard._id, 'hard')} className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                    <Frown className="w-4 h-4" /> Hard
                  </button>
                  <button onClick={() => saveRating(currentCard._id, 'medium')} className="flex-1 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                    <Meh className="w-4 h-4" /> Medium
                  </button>
                  <button onClick={() => saveRating(currentCard._id, 'easy')} className="flex-1 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                    <Smile className="w-4 h-4" /> Easy
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-6">
        <button onClick={handlePrev} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors" title="Previous (Left Arrow)">
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-white tracking-widest">
            {currentIndex + 1} / {cards.length}
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
            Space to flip
          </div>
        </div>
        
        <button onClick={handleNext} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors" title="Next (Right Arrow)">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Footer Actions & Stats */}
      <div className="w-full mt-12 pt-6 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
            <Smile className="w-3.5 h-3.5" /> Easy: {stats.easy}
          </div>
          <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
            <Meh className="w-3.5 h-3.5" /> Medium: {stats.medium}
          </div>
          <div className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-1 rounded">
            <Frown className="w-3.5 h-3.5" /> Hard: {stats.hard}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleShuffle} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors">
            <Shuffle className="w-3.5 h-3.5" /> Shuffle
          </button>
          <button onClick={studyAgain} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Study Weakest
          </button>
        </div>
      </div>
      
    </div>
  );
}
