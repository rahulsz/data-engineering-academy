import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualizerControlsProps {
  step: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
}

export function VisualizerControls({
  step, totalSteps, isPlaying, onPlayPause, onNext, onPrev, onReset
}: VisualizerControlsProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card border-t border-border relative overflow-hidden">
      {/* Subtle background glow when playing */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-cyan-500/5 blur-2xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1.5 relative z-10">
        <button 
          onClick={onReset}
          className="p-2 text-slate-400 hover:text-cyan-300 transition-all duration-300 rounded-lg hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        <div className="h-4 w-px bg-white/10 mx-2" />
        
        <button 
          onClick={onPrev}
          disabled={step === 0}
          className="p-2 text-slate-400 hover:text-cyan-300 transition-all duration-300 rounded-lg hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:shadow-none"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        
        <button 
          onClick={onPlayPause}
          className={cn(
            "p-3 rounded-full text-[#050505] transition-all duration-300 mx-1",
            isPlaying 
              ? "bg-rose-400 hover:bg-rose-300 shadow-[0_0_15px_rgba(251,113,133,0.4)]" 
              : "bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          )}
        >
          <motion.div
            initial={false}
            animate={{ scale: isPlaying ? 0.9 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-[1px]" />}
          </motion.div>
        </button>
        
        <button 
          onClick={onNext}
          disabled={step === totalSteps - 1}
          className="p-2 text-slate-400 hover:text-cyan-300 transition-all duration-300 rounded-lg hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:shadow-none"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex flex-col items-end relative z-10">
        <span className="text-[10px] text-cyan-500/50 font-bold tracking-widest uppercase font-mono">Step</span>
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-sm text-cyan-50">{step + 1}</span>
          <span className="text-xs text-slate-600">/</span>
          <span className="text-xs text-slate-500">{totalSteps}</span>
        </div>
      </div>
    </div>
  );
}
