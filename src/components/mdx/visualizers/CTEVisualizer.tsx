'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Database } from 'lucide-react'

export function CTEVisualizer() {
  const [view, setView] = useState<'cte' | 'nested'>('cte')

  return (
    <div className="flex flex-col bg-background rounded-xl overflow-hidden border border-border text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] my-8 relative">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      {/* Mac Window Controls & Header */}
      <div className="h-10 border-b border-border flex items-center px-4 gap-4 bg-card relative z-20">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <h4 className="absolute left-1/2 -translate-x-1/2 font-mono text-xs font-semibold tracking-widest text-slate-400 flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          EXECUTION: CTE vs SUBQUERY
        </h4>
      </div>

      {/* Toggle Bar */}
      <div className="flex border-b border-border bg-card/50 relative z-20">
        <button 
          onClick={() => setView('cte')}
          className={cn(
            "flex-1 px-4 py-4 text-sm font-bold transition-all duration-300 tracking-wider uppercase font-mono relative overflow-hidden",
            view === 'cte' ? "text-emerald-300 bg-emerald-500/5" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
          )}
        >
          {view === 'cte' && <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />}
          CTE (Pipeline View)
        </button>
        <button 
          onClick={() => setView('nested')}
          className={cn(
            "flex-1 px-4 py-4 text-sm font-bold transition-all duration-300 tracking-wider uppercase border-l border-border font-mono relative overflow-hidden",
            view === 'nested' ? "text-red-300 bg-red-500/5" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
          )}
        >
          {view === 'nested' && <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />}
          Nested (Inception View)
        </button>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px] bg-card relative z-10">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Left: Code */}
        <div className="flex flex-col gap-4 relative z-10">
          <AnimatePresence mode="wait">
            {view === 'cte' ? (
              <motion.div 
                key="cte-code"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-background border border-emerald-500/30 rounded-xl p-6 font-mono text-sm leading-loose text-white/80 h-full shadow-[inset_0_0_20px_rgba(16,185,129,0.02)] relative overflow-hidden"
              >
                <div className="text-slate-500 mb-4">// Clean, readable, sequential</div>
                <div><span className="text-cyan-400">WITH</span> usa_customers <span className="text-cyan-400">AS</span> (</div>
                <div className="ml-4"><span className="text-cyan-400">SELECT</span> id <span className="text-cyan-400">FROM</span> customers <span className="text-cyan-400">WHERE</span> country = <span className="text-yellow-300">'USA'</span></div>
                <div>),</div>
                <br/>
                <div>large_orders <span className="text-cyan-400">AS</span> (</div>
                <div className="ml-4"><span className="text-cyan-400">SELECT</span> * <span className="text-cyan-400">FROM</span> orders</div>
                <div className="ml-4"><span className="text-cyan-400">WHERE</span> amount &gt; <span className="text-pink-400">1000</span></div>
                <div className="ml-4"><span className="text-cyan-400">AND</span> customer_id <span className="text-cyan-400">IN</span> (<span className="text-cyan-400">SELECT</span> id <span className="text-cyan-400">FROM</span> usa_customers)</div>
                <div>)</div>
                <br/>
                <div className="bg-emerald-900/20 -mx-6 px-6 py-2 border-y border-emerald-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]">
                  <div><span className="text-cyan-400">SELECT</span> department, <span className="text-emerald-400">COUNT</span>(*)</div>
                  <div><span className="text-cyan-400">FROM</span> employees e</div>
                  <div><span className="text-cyan-400">JOIN</span> large_orders lo <span className="text-cyan-400">ON</span> e.id = lo.sales_rep_id</div>
                  <div><span className="text-cyan-400">GROUP BY</span> department;</div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="nested-code"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="bg-background border border-red-500/30 rounded-xl p-6 font-mono text-sm leading-loose text-white/80 h-full shadow-[inset_0_0_20px_rgba(239,68,68,0.02)] relative overflow-hidden"
              >
                <div className="text-slate-500 mb-4">// Deeply nested, hard to read inside-out</div>
                <div className="bg-red-900/10 -mx-6 px-6 py-2 border-y border-red-500/10">
                  <div><span className="text-cyan-400">SELECT</span> department, <span className="text-emerald-400">COUNT</span>(*)</div>
                  <div><span className="text-cyan-400">FROM</span> employees e</div>
                  <div><span className="text-cyan-400">JOIN</span> (</div>
                </div>
                <div className="ml-4 bg-red-950/30 p-3 rounded-lg border border-red-500/20 my-2 shadow-inner">
                  <div><span className="text-cyan-400">SELECT</span> * <span className="text-cyan-400">FROM</span> orders</div>
                  <div><span className="text-cyan-400">WHERE</span> amount &gt; <span className="text-pink-400">1000</span></div>
                  <div><span className="text-cyan-400">AND</span> customer_id <span className="text-cyan-400">IN</span> (</div>
                  <div className="ml-4 bg-red-900/40 p-3 rounded-lg border border-red-500/30 my-2 shadow-inner">
                    <div><span className="text-cyan-400">SELECT</span> id <span className="text-cyan-400">FROM</span> customers</div>
                    <div><span className="text-cyan-400">WHERE</span> country = <span className="text-yellow-300">'USA'</span></div>
                  </div>
                  <div>)</div>
                </div>
                <div className="bg-red-900/10 -mx-6 px-6 py-2 border-y border-red-500/10">
                  <div>) lo <span className="text-cyan-400">ON</span> e.id = lo.sales_rep_id</div>
                  <div><span className="text-cyan-400">GROUP BY</span> department;</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Visual flow */}
        <div className="bg-background border border-border/50 rounded-xl p-6 flex items-center justify-center relative overflow-hidden z-10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
          
          <AnimatePresence mode="wait">
            {view === 'cte' ? (
              <motion.div 
                key="cte-visual"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-6 w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                
                {/* Node 1 */}
                <div className="bg-card border border-emerald-500/40 p-5 rounded-xl w-64 text-center shadow-[0_10px_30px_rgba(16,185,129,0.1)] relative z-10">
                  <div className="text-[10px] text-emerald-400 font-bold mb-2 tracking-widest uppercase">Step 1</div>
                  <div className="font-mono text-sm text-emerald-100 font-bold">usa_customers</div>
                </div>

                {/* Arrow */}
                <div className="h-10 w-0.5 bg-emerald-500/30 relative">
                  <motion.div 
                    animate={{ y: [0, 40] }} 
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute -left-1 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,1)]"
                  />
                </div>

                {/* Node 2 */}
                <div className="bg-card border border-emerald-500/40 p-5 rounded-xl w-64 text-center shadow-[0_10px_30px_rgba(16,185,129,0.1)] relative z-10">
                  <div className="text-[10px] text-emerald-400 font-bold mb-2 tracking-widest uppercase">Step 2</div>
                  <div className="font-mono text-sm text-emerald-100 font-bold">large_orders</div>
                  <div className="text-[10px] text-slate-500 mt-2 tracking-widest uppercase font-bold">Reads from step 1</div>
                </div>

                {/* Arrow */}
                <div className="h-10 w-0.5 bg-emerald-500/30 relative">
                  <motion.div 
                    animate={{ y: [0, 40] }} 
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.5 }}
                    className="absolute -left-1 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,1)]"
                  />
                </div>

                {/* Node 3 */}
                <div className="bg-emerald-500/10 border border-emerald-400 p-6 rounded-xl w-72 text-center shadow-[0_0_40px_rgba(16,185,129,0.2)] relative z-10 backdrop-blur-sm">
                  <div className="text-[10px] text-emerald-300 font-bold mb-2 tracking-widest uppercase">Final Output</div>
                  <div className="font-mono text-base text-white font-bold">Main SELECT Query</div>
                  <div className="text-[10px] text-slate-400 mt-2 tracking-widest uppercase font-bold">Reads from step 2</div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="nested-visual"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-center w-full h-full relative"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/10 to-transparent pointer-events-none" />

                <div className="bg-card border border-red-500/30 p-8 rounded-full aspect-square w-80 flex items-center justify-center relative shadow-[0_0_50px_rgba(239,68,68,0.15)]">
                  <div className="absolute top-6 text-[10px] text-red-300 font-bold uppercase tracking-widest bg-background border border-red-500/30 px-3 py-1 rounded-full shadow-lg">Outer Query</div>
                  
                  <div className="bg-red-950/40 border border-red-500/40 p-8 rounded-full aspect-square w-56 flex items-center justify-center relative shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <div className="absolute top-6 text-[10px] text-red-200 font-bold uppercase tracking-widest bg-background border border-red-500/40 px-3 py-1 rounded-full text-center shadow-lg">large_orders</div>
                    
                    <div className="bg-red-900/60 border border-red-400/60 p-4 rounded-full aspect-square w-28 flex items-center justify-center relative shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                      <div className="text-[10px] text-white font-bold uppercase tracking-widest text-center leading-relaxed">
                        usa<br/>customers
                      </div>
                      
                      {/* Pulse effect coming from deep inside out */}
                      <motion.div 
                        animate={{ scale: [1, 3], opacity: [0.8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full border-2 border-red-400"
                      />
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}
