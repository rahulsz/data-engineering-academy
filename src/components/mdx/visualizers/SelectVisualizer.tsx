'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from './VisualizerControls';
import { Database } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { text: "1. The query begins by looking at the target table in the database.", sql: "SELECT name, email \nFROM customers;" },
  { text: "2. It scans the entire 'customers' table into memory.", sql: "SELECT name, email \nFROM customers;" },
  { text: "3. It filters out all columns except 'name' and 'email'.", sql: "SELECT name, email \nFROM customers;" },
  { text: "4. The final result set is returned to the user.", sql: "SELECT name, email \nFROM customers;" }
];

const mockTable = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", country: "USA" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", country: "UK" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", country: "USA" },
];

export function SelectVisualizer() {
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
    }, 2500);
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
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          EXECUTION: SELECT
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
          
          <div className="flex flex-col w-full max-w-lg gap-2 relative z-10">
            <motion.div layout className="text-[10px] text-cyan-500/50 mb-2 font-bold uppercase tracking-widest font-mono flex justify-between">
              <span>customers table</span>
              {step === 2 && <motion.span initial={{opacity:0}} animate={{opacity:1}} className="text-cyan-400">Filtering Columns...</motion.span>}
            </motion.div>

            <motion.div layout className="flex flex-col gap-2">
              <AnimatePresence>
                {mockTable.map((row, i) => {
                  const isScanning = step === 1;
                  const isSelected = step >= 2;
                  
                  return (
                    <motion.div 
                      layout
                      key={row.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ 
                        opacity: step === 0 ? 0.2 : 1, 
                        scale: 1,
                        x: step === 3 ? (i % 2 === 0 ? 5 : 10) : 0 
                      }}
                      transition={{ 
                        layout: { type: "spring", bounce: 0.2, duration: 0.6 },
                        opacity: { delay: step === 0 ? 0 : i * 0.15, duration: 0.4 },
                        x: { type: "spring", bounce: 0.4 }
                      }}
                      className={cn(
                        "flex rounded-lg overflow-hidden text-sm font-mono border transition-all duration-500",
                        isScanning ? "border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]" :
                        isSelected ? "border-emerald-500/30 bg-emerald-500/5" :
                        "border-border bg-background"
                      )}
                    >
                      <motion.div layout className="p-3 w-12 text-center border-r border-border text-white/30 bg-white/5">{row.id}</motion.div>
                      
                      <motion.div layout className={cn("p-3 flex-1 transition-colors duration-500", isSelected ? 'text-emerald-300 font-medium' : 'text-slate-300')}>
                        {row.name}
                      </motion.div>
                      
                      <motion.div layout className={cn("p-3 flex-1 border-l border-border transition-colors duration-500", isSelected ? 'text-emerald-300 font-medium' : 'text-slate-300')}>
                        {row.email}
                      </motion.div>
                      
                      <AnimatePresence>
                        {!isSelected && (
                          <motion.div 
                            initial={{ width: 'auto', opacity: 1 }}
                            exit={{ width: 0, opacity: 0, padding: 0, border: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="p-3 w-24 truncate border-l border-border text-slate-500 bg-white/5 overflow-hidden"
                          >
                            {row.country}
                          </motion.div>
                        )}
                      </AnimatePresence>
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
