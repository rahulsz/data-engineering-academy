'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Database } from 'lucide-react'
import { VisualizerControls } from './VisualizerControls'

const employees = [
  { id: 1, name: "Alice", department: "Engineering", salary: 95000 },
  { id: 2, name: "Bob", department: "Marketing", salary: 45000 },
  { id: 3, name: "Carol", department: "Engineering", salary: 88000 },
  { id: 4, name: "David", department: "Sales", salary: 62000 },
  { id: 5, name: "Eve", department: "Engineering", salary: 72000 },
  { id: 6, name: "Frank", department: "Marketing", salary: 38000 }
]

const deptAvgs: Record<string, number> = {
  "Engineering": 85000,
  "Marketing": 41500,
  "Sales": 62000
}

export function CorrelatedSubqueryVisualizer() {
  const [activeRow, setActiveRow] = useState<number | null>(null)
  const [subqueryState, setSubqueryState] = useState<'idle' | 'executing' | 'evaluated'>('idle')
  const [results, setResults] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)

  // 0: idle
  // 1: highlight Alice
  // 2: compute Engineering avg
  // 3: evaluate Alice
  // 4: highlight Bob
  // ... (each row takes 3 phases)

  const [phase, setPhase] = useState(-1) // -1 is idle

  useEffect(() => {
    if (!isPlaying) return

    if (phase === -1) {
      setPhase(0)
      return
    }

    const rowIdx = Math.floor(phase / 3)
    const subPhase = phase % 3

    if (rowIdx >= employees.length) {
      setIsPlaying(false)
      setActiveRow(null)
      setSubqueryState('idle')
      return
    }

    const timer = setTimeout(() => {
      if (subPhase === 0) {
        setActiveRow(rowIdx)
        setSubqueryState('idle')
      } else if (subPhase === 1) {
        setSubqueryState('executing')
      } else if (subPhase === 2) {
        setSubqueryState('evaluated')
        const emp = employees[rowIdx]
        const avg = deptAvgs[emp.department]
        if (emp.salary > avg) {
          setResults(prev => [...prev, emp.id])
        }
      }
      setPhase(p => p + 1)
    }, 1500)

    return () => clearTimeout(timer)
  }, [isPlaying, phase])

  const reset = () => {
    setIsPlaying(false)
    setPhase(-1)
    setActiveRow(null)
    setSubqueryState('idle')
    setResults([])
  }

  const advance = () => {
    setPhase(p => {
      if (p === -1) return 0;
      if (Math.floor(p / 3) >= employees.length) return p;
      return p + 1;
    })
    setIsPlaying(false); // Pause on manual step
  }

  const currentEmp = activeRow !== null ? employees[activeRow] : null
  const currentAvg = currentEmp ? deptAvgs[currentEmp.department] : null

  // Ensure row state updates when advancing manually
  useEffect(() => {
    if (isPlaying || phase === -1) return;

    const rowIdx = Math.floor(phase / 3)
    const subPhase = phase % 3

    if (rowIdx >= employees.length) {
      setActiveRow(null)
      setSubqueryState('idle')
      return
    }

    if (subPhase === 0) {
      setActiveRow(rowIdx)
      setSubqueryState('idle')
    } else if (subPhase === 1) {
      setSubqueryState('executing')
    } else if (subPhase === 2) {
      setSubqueryState('evaluated')
      const emp = employees[rowIdx]
      const avg = deptAvgs[emp.department]
      if (emp.salary > avg && !results.includes(emp.id)) {
        setResults(prev => [...prev, emp.id])
      }
    }
  }, [phase, isPlaying])


  return (
    <div className="flex flex-col bg-background rounded-xl overflow-hidden border border-border text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] my-8 relative">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      {/* Mac Window Controls & Header */}
      <div className="h-10 border-b border-border flex items-center px-4 gap-4 bg-card relative z-20">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <h4 className="absolute left-1/2 -translate-x-1/2 font-mono text-xs font-semibold tracking-widest text-slate-400 flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          EXECUTION: CORRELATED
        </h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5 relative z-10">
        
        {/* Left Side: Outer Query */}
        <div className="bg-card p-6 md:p-8 flex flex-col gap-6 relative">
          <h4 className="font-bold text-cyan-400 text-xs tracking-widest uppercase font-mono">Outer Query</h4>
          <div className="font-mono text-xs leading-loose text-white/80 bg-background p-5 rounded-xl border border-border relative overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
            <div className="text-slate-500 mb-2">// Outer Query executes row by row</div>
            <div><span className="text-cyan-400">SELECT</span> e1.name, e1.salary, e1.department</div>
            <div><span className="text-cyan-400">FROM</span> employees e1</div>
            <div><span className="text-cyan-400">WHERE</span> salary &gt; (</div>
            <div className="ml-6 text-indigo-300 relative z-10">
              <span className="text-cyan-400">SELECT</span> <span className="text-emerald-400">AVG</span>(salary) <span className="text-cyan-400">FROM</span> employees e2<br/>
              <span className="text-cyan-400">WHERE</span> <span className={cn("px-2 py-0.5 rounded transition-all duration-500", subqueryState !== 'idle' ? "bg-indigo-500/20 border border-indigo-500/50 text-indigo-200 font-bold shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "border border-transparent")}>e1.department = e2.department</span>
            </div>
            <div>);</div>
            
            {/* Warning Overlay */}
            <div className="absolute top-4 right-4 flex flex-col items-end">
              <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.1)] backdrop-blur-sm">
                O(N²) Trap
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-3 text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 font-mono">
              <span>name</span><span>department</span><span>salary</span>
            </div>
            {employees.map((emp, i) => (
              <div 
                key={emp.id}
                className={cn(
                  "grid grid-cols-3 text-sm p-3 rounded-lg transition-all duration-500 mb-1.5 border relative overflow-hidden",
                  activeRow === i ? "bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.15)] z-10 scale-[1.02]" : "bg-background border-border/50 hover:bg-white/5",
                  phase > i * 3 + 2 && !results.includes(emp.id) && "opacity-30 grayscale"
                )}
              >
                {activeRow === i && (
                  <motion.div layoutId="active-row-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                )}
                
                <span className={cn("pl-2", activeRow === i ? "font-bold text-white" : "text-slate-300")}>{emp.name}</span>
                <span className={cn(activeRow === i ? "font-bold text-indigo-300" : "text-slate-400")}>{emp.department}</span>
                <span className={cn("font-mono", activeRow === i ? "font-bold text-emerald-300" : "text-cyan-200/70")}>${emp.salary.toLocaleString()}</span>
                
                {/* Result stamp */}
                <AnimatePresence>
                  {phase > i * 3 + 2 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {results.includes(emp.id) ? (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono shadow-[0_0_10px_rgba(16,185,129,0.1)]">KEEP</span>
                      ) : (
                        <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono shadow-[0_0_10px_rgba(239,68,68,0.1)]">DROP</span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Inner Query execution */}
        <div className="bg-background p-6 md:p-8 flex flex-col relative overflow-hidden min-h-[400px]">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          
          <h4 className="font-bold text-indigo-400 text-xs tracking-widest uppercase font-mono mb-6 relative z-10 text-center lg:text-left">Inner Subquery</h4>
          
          <div className="flex flex-col items-center justify-center flex-1 relative z-10">
            <AnimatePresence mode="wait">
              {activeRow === null ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="text-slate-500 text-sm text-center max-w-xs font-mono leading-relaxed"
                >
                  <div className="text-4xl mb-4 opacity-50">🔄</div>
                  Click Play to begin iterating. The subquery will execute once for <strong className="text-slate-300">every single row</strong>.
                </motion.div>
              ) : (
                <motion.div 
                  key={activeRow}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                  className="flex flex-col items-center gap-6 w-full max-w-md"
                >
                  {/* Status Badge */}
                  <div className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-3 shadow-[0_5px_15px_rgba(99,102,241,0.1)] tracking-wide">
                    <div className={cn("w-2 h-2 rounded-full", subqueryState === 'executing' ? "bg-indigo-400 animate-ping" : "bg-indigo-500")} />
                    Processing Row {activeRow + 1}: <span className="text-white">{currentEmp?.name}</span>
                  </div>

                  {/* Subquery Box */}
                  <div className="bg-card border border-indigo-500/30 rounded-xl p-6 w-full shadow-[0_15px_40px_rgba(99,102,241,0.1)] relative">
                    <div className="absolute -top-3 left-6 bg-indigo-500 text-[#050505] px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-mono font-bold shadow-lg">
                      Engine
                    </div>
                    
                    <div className="flex flex-col gap-5 text-sm font-mono mt-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span className="text-slate-500 uppercase tracking-wider text-xs font-bold">Context Injected:</span>
                        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg shadow-inner">
                          e1.department = <span className="text-white">'{currentEmp?.department}'</span>
                        </span>
                      </div>
                      
                      <div className="h-px bg-white/5 w-full" />
                      
                      {subqueryState === 'idle' && (
                        <div className="text-slate-500 animate-pulse text-center py-6">Waiting to execute...</div>
                      )}

                      {subqueryState === 'executing' && (
                        <div className="flex flex-col gap-4 py-2">
                          <div className="text-slate-300 text-center text-xs tracking-wider uppercase font-bold">
                            Calculating <span className="text-emerald-400">AVG(salary)</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs opacity-60">
                            {employees.filter(e => e.department === currentEmp?.department).map(e => (
                              <div key={e.id} className="bg-white/5 border border-border p-2.5 rounded-lg text-center shadow-inner font-mono text-cyan-100">
                                ${e.salary.toLocaleString()}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {subqueryState === 'evaluated' && (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} className="flex flex-col items-center gap-4 py-4 relative">
                          <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
                          <div className="text-4xl font-bold text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] relative z-10">${currentAvg?.toLocaleString()}</div>
                          <div className="text-slate-400 text-xs text-center px-4 leading-relaxed relative z-10">
                            Average salary for {currentEmp?.department} returned to outer query.
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Evaluation Logic */}
                  {subqueryState === 'evaluated' && (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      transition={{ delay: 0.2 }}
                      className="bg-card border border-border p-5 rounded-xl w-full flex flex-col items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                    >
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Final Evaluation</div>
                      <div className="font-mono text-xl flex items-center gap-4 bg-background px-6 py-3 rounded-lg border border-border/50 shadow-inner">
                        <span className="text-cyan-300">${currentEmp?.salary.toLocaleString()}</span>
                        <span className="text-slate-500 font-bold">&gt;</span>
                        <span className="text-emerald-400">${currentAvg?.toLocaleString()}</span>
                      </div>
                      <div className="mt-2 text-sm font-bold tracking-widest uppercase">
                        {(currentEmp?.salary || 0) > (currentAvg || 0) ? (
                          <span className="text-emerald-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            TRUE (Included)
                          </span>
                        ) : (
                          <span className="text-red-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                            FALSE (Dropped)
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <VisualizerControls 
        step={phase}
        totalSteps={employees.length * 3 - 1} // Number of phases
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={advance}
        onPrev={() => {
          setPhase(p => Math.max(-1, p - 1));
          setIsPlaying(false);
          // Recalculate results based on new phase if going backwards, simpler to just reset if they go backwards usually, but let's keep it simple. If we want perfect time-travel, we'd slice results.
          // For now, reset results and recalculate up to phase.
          const newPhase = Math.max(-1, phase - 1);
          const newResults: number[] = [];
          for (let p = 0; p <= newPhase; p++) {
             if (p % 3 === 2) {
                const rowIdx = Math.floor(p / 3);
                const emp = employees[rowIdx];
                if (emp && emp.salary > deptAvgs[emp.department]) {
                   newResults.push(emp.id);
                }
             }
          }
          setResults(newResults);
        }}
        onReset={reset}
      />
    </div>
  )
}
