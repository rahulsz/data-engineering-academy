'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from './VisualizerControls';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { text: "1. Scan the 'employees' table.", sql: "SELECT *\nFROM employees\nWHERE department = 'Engineering';" },
  { text: "2. The WHERE clause evaluates each row: is department == 'Engineering'?", sql: "SELECT *\nFROM employees\nWHERE department = 'Engineering';" },
  { text: "3. Rows matching the condition are kept. Others are discarded.", sql: "SELECT *\nFROM employees\nWHERE department = 'Engineering';" },
  { text: "4. The filtered result set is returned.", sql: "SELECT *\nFROM employees\nWHERE department = 'Engineering';" }
];

const mockTable = [
  { id: 1, name: "Alice", dept: "Engineering", match: true },
  { id: 2, name: "Bob", dept: "Sales", match: false },
  { id: 3, name: "Charlie", dept: "Engineering", match: true },
  { id: 4, name: "Diana", dept: "HR", match: false },
];

export function WhereVisualizer() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="flex flex-col bg-background rounded-xl overflow-hidden border border-border text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] my-8">
      {/* Mac Window Controls & Header */}
      <div className="h-10 border-b border-border flex items-center px-4 gap-4 bg-card relative">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <h4 className="absolute left-1/2 -translate-x-1/2 font-mono text-xs font-semibold tracking-widest text-slate-400 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          EXECUTION: WHERE FILTERING
        </h4>
      </div>

      <div className="flex flex-col md:flex-row h-full md:h-[450px]">
        {/* SQL & Explanation */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border bg-card/50 p-6 flex flex-col gap-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="bg-background border border-border rounded-lg p-5 font-mono text-sm text-cyan-300 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] whitespace-pre-wrap leading-relaxed">
              {steps[step].sql}
            </div>
            
            <div className="mt-8 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-300 leading-relaxed font-sans"
                >
                  {steps[step].text}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Visualizer Area */}
        <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden bg-card">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          
          <div className="flex flex-col w-full max-w-sm gap-3 relative z-10">
            <motion.div layout className="text-[10px] text-cyan-500/50 mb-1 uppercase tracking-widest font-bold font-mono flex justify-between">
              <span>employees table</span>
              <AnimatePresence>
                {step === 1 && (
                  <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                    className="text-amber-400"
                  >
                    Evaluating...
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.div layout className="flex flex-col gap-3">
              <AnimatePresence>
                {mockTable.map((row, i) => {
                  const isEvaluating = step === 1;
                  const isFilteredOut = step >= 2 && !row.match;
                  const isKept = step >= 2 && row.match;

                  if (isFilteredOut && step >= 3) return null; // Fully remove from DOM on step 3

                  return (
                    <motion.div 
                      layout
                      key={row.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ 
                        opacity: step === 0 ? 0.3 : (isFilteredOut ? 0.1 : 1),
                        x: (isKept && step === 3) ? 10 : 0,
                        scale: isEvaluating ? 1.02 : (isFilteredOut ? 0.9 : 1),
                      }}
                      exit={{ opacity: 0, scale: 0.8, x: -50 }}
                      transition={{ 
                        layout: { type: "spring", bounce: 0.3, duration: 0.8 },
                        delay: isEvaluating ? i * 0.4 : 0,
                        opacity: { duration: 0.3 },
                      }}
                      className={cn(
                        "flex rounded-lg overflow-hidden text-sm font-mono border transition-colors duration-500",
                        isKept ? "border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : 
                        isFilteredOut ? "border-rose-500/20 bg-rose-500/5" : 
                        isEvaluating ? "border-amber-500/40 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]" : "border-border bg-background"
                      )}
                    >
                      <div className="p-3 w-12 text-center border-r border-border text-white/40 bg-white/5">{row.id}</div>
                      <div className="p-3 flex-1 text-slate-300">{row.name}</div>
                      <div className={cn(
                        "p-3 flex-1 border-l border-border transition-colors duration-300",
                        isEvaluating && row.match && "text-emerald-400 font-bold bg-emerald-500/10",
                        isEvaluating && !row.match && "text-rose-400 font-bold bg-rose-500/10",
                        isKept && "text-emerald-300 font-bold"
                      )}>
                        {row.dept}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      <VisualizerControls 
        step={step} 
        totalSteps={steps.length} 
        isPlaying={isPlaying} 
        onPlayPause={() => setIsPlaying(!isPlaying)} 
        onNext={() => setStep(s => Math.min(steps.length - 1, s + 1))} 
        onPrev={() => setStep(s => Math.max(0, s - 1))} 
        onReset={() => { setStep(0); setIsPlaying(false); }} 
      />
    </div>
  );
}
