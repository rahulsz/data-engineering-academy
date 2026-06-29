'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AlertCircle, Database } from 'lucide-react'

const employees = [
  { id: 1, name: "Alice", dept: "Engineering", salary: 95000 },
  { id: 2, name: "Bob", dept: "Marketing", salary: 45000 },
  { id: 3, name: "Carol", dept: "Engineering", salary: 88000 },
  { id: 4, name: "David", dept: "Sales", salary: 62000 },
  { id: 5, name: "Eve", dept: "Engineering", salary: 50000 },
  { id: 6, name: "Frank", dept: "Marketing", salary: 38000 },
  { id: 7, name: "Grace", dept: "Sales", salary: 55000 },
  { id: 8, name: "Henry", dept: "HR", salary: 65000 },
]

export function HavingVisualizer() {
  const [activeTab, setActiveTab] = useState<'comparison' | 'error'>('comparison')
  const [step, setStep] = useState(0)

  const advance = () => setStep(s => Math.min(3, s + 1))
  const reset = () => setStep(0)

  const renderComparison = () => {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between bg-card p-4 border-b border-border">
          <div className="flex gap-4">
            <button onClick={reset} className="px-4 py-2 bg-background border border-border hover:bg-white/5 rounded-lg text-sm font-medium transition-colors text-slate-300">Reset</button>
            <button onClick={advance} disabled={step === 3} className="px-4 py-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.1)]">Next Step</button>
          </div>
          <div className="text-sm text-slate-500 font-mono tracking-widest uppercase">Step {step + 1} of 4</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left: WHERE */}
          <div className="flex flex-col gap-4">
            <div className="bg-background border border-cyan-500/30 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] rounded-xl p-5 font-mono text-xs leading-loose text-cyan-300">
              <div className="text-slate-500 mb-2">// WHERE filters ROWS before grouping</div>
              <div>SELECT dept, AVG(salary)</div>
              <div>FROM employees</div>
              <div className={cn("px-1 rounded transition-colors", step >= 1 && "bg-cyan-900/40 text-cyan-100 font-bold")}>WHERE salary &gt; 60000</div>
              <div className={cn("px-1 rounded transition-colors", step >= 2 && "bg-cyan-900/40 text-cyan-100 font-bold")}>GROUP BY dept;</div>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl min-h-[400px] relative overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              <div className="relative z-10 flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                  {step === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-2">
                      {employees.map(e => (
                        <div key={e.id} className="bg-background border border-border/50 p-3 rounded-lg text-xs flex justify-between shadow-sm">
                          <span className="text-slate-300">{e.name}</span><span className="text-slate-500">{e.dept}</span><span className="font-mono text-slate-400">${e.salary}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-2">
                      {employees.map(e => {
                        const pass = e.salary > 60000
                        return (
                          <motion.div layout key={e.id} className={cn("p-3 rounded-lg text-xs flex justify-between border transition-all duration-500", pass ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.1)]" : "bg-red-950/20 border-red-500/20 text-slate-600 grayscale opacity-40")}>
                            <span>{e.name}</span><span>{e.dept}</span><span className="font-mono">${e.salary}</span>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                  {step >= 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                      {['Engineering', 'Sales', 'HR', 'Marketing'].map(dept => {
                        const filtered = employees.filter(e => e.dept === dept && e.salary > 60000)
                        if (filtered.length === 0) return null
                        const avg = Math.round(filtered.reduce((a,b)=>a+b.salary,0)/filtered.length)
                        return (
                          <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={dept} className="bg-cyan-950/20 border border-cyan-500/30 p-3 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                            <div className="text-sm font-bold mb-2 flex justify-between text-cyan-100">
                              <span className="tracking-wide">{dept}</span>
                              {step === 3 && <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="font-mono bg-background px-2 py-0.5 rounded text-cyan-300 border border-cyan-500/20">${avg} avg</motion.span>}
                            </div>
                            <div className="flex flex-col gap-2">
                              {step === 2 && filtered.map(e => (
                                <motion.div layout key={e.id} className="bg-background/80 border border-border/50 p-2 text-xs flex justify-between rounded-lg">
                                  <span className="text-cyan-200/70">{e.name}</span><span className="font-mono text-cyan-200/50">${e.salary}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: HAVING */}
          <div className="flex flex-col gap-4">
            <div className="bg-background border border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] rounded-xl p-5 font-mono text-xs leading-loose text-emerald-300">
              <div className="text-slate-500 mb-2">// HAVING filters GROUPS after aggregation</div>
              <div>SELECT dept, AVG(salary)</div>
              <div>FROM employees</div>
              <div className={cn("px-1 rounded transition-colors", step >= 1 && "bg-emerald-900/40 text-emerald-100 font-bold")}>GROUP BY dept</div>
              <div className={cn("px-1 rounded transition-colors", step >= 2 && "bg-emerald-900/40 text-emerald-100 font-bold")}>HAVING AVG(salary) &gt; 60000;</div>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl min-h-[400px] relative overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              <div className="relative z-10 flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                  {step === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-2">
                      {employees.map(e => (
                        <div key={e.id} className="bg-background border border-border/50 p-3 rounded-lg text-xs flex justify-between shadow-sm">
                          <span className="text-slate-300">{e.name}</span><span className="text-slate-500">{e.dept}</span><span className="font-mono text-slate-400">${e.salary}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {step >= 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                      {['Engineering', 'Sales', 'HR', 'Marketing'].map(dept => {
                        const allInDept = employees.filter(e => e.dept === dept)
                        const avg = Math.round(allInDept.reduce((a,b)=>a+b.salary,0)/allInDept.length)
                        const pass = avg > 60000
                        
                        if (step >= 2 && !pass) {
                          return (
                            <motion.div layout key={dept} className="bg-red-950/10 border border-red-500/20 p-3 rounded-xl opacity-40 grayscale transition-all duration-500">
                              <div className="text-sm font-bold flex justify-between text-slate-400">
                                <span className="tracking-wide">{dept}</span>
                                <span className="font-mono">${avg} avg</span>
                              </div>
                            </motion.div>
                          )
                        }

                        return (
                          <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={dept} className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                            <div className="text-sm font-bold mb-2 flex justify-between text-emerald-100">
                              <span className="tracking-wide">{dept}</span>
                              {(step >= 1) && <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="font-mono bg-background px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/20">${avg} avg</motion.span>}
                            </div>
                            <div className="flex flex-col gap-2">
                              {step === 1 && allInDept.map(e => (
                                <motion.div layout key={e.id} className="bg-background/80 border border-border/50 p-2 text-xs flex justify-between rounded-lg">
                                  <span className="text-emerald-200/70">{e.name}</span><span className="font-mono text-emerald-200/50">${e.salary}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderErrorDemo = () => {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-10 min-h-[500px] bg-card">
        <div className="bg-background border border-red-500/30 rounded-xl p-8 font-mono text-sm max-w-2xl w-full relative overflow-hidden group shadow-[0_10px_40px_rgba(239,68,68,0.15)]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-500 to-red-900" />
          <div className="text-red-400 mb-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <span className="font-semibold text-lg tracking-wide uppercase">Syntax Error</span>
          </div>
          <div className="leading-loose text-slate-300 text-base">
            <div><span className="text-red-300">SELECT</span> department, COUNT(*)</div>
            <div><span className="text-red-300">FROM</span> employees</div>
            <div className="bg-red-500/10 -mx-3 px-3 py-2 rounded-lg inline-block relative mt-1 border border-red-500/20">
              <span className="line-through text-red-300/50 mr-2"><span className="text-red-400">WHERE</span> COUNT(*) &gt; 2</span>
              <motion.span 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-10 left-0 text-red-200 text-xs font-sans whitespace-nowrap bg-red-950 px-3 py-1.5 rounded-md border border-red-500/40 shadow-lg"
              >
                ERROR: Invalid use of group function
              </motion.span>
            </div>
            <div className="mt-8"><span className="text-red-300">GROUP BY</span> department;</div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-background border border-emerald-500/30 p-8 rounded-xl max-w-2xl w-full shadow-[0_10px_40px_rgba(16,185,129,0.1)]"
        >
          <h4 className="text-emerald-400 font-semibold text-lg mb-4 flex items-center gap-3 uppercase tracking-wide">
            <span className="bg-emerald-500/10 p-1.5 rounded-md border border-emerald-500/30">✅</span> The Fix: Use HAVING
          </h4>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Aggregate functions (like COUNT, SUM, AVG) calculate values <strong className="text-emerald-300">after</strong> rows are grouped. 
            The <code className="text-emerald-200 bg-emerald-950/50 px-1.5 py-0.5 rounded">WHERE</code> clause evaluates <strong className="text-red-300">before</strong> grouping happens, so it doesn't know what <code>COUNT(*)</code> is yet! 
            <br/><br/>
            You must use <code className="text-emerald-200 bg-emerald-950/50 px-1.5 py-0.5 rounded">HAVING</code> to filter based on aggregates.
          </p>
          <div className="bg-card p-5 rounded-lg font-mono text-sm text-emerald-200/70 border border-border/50">
            <div><span className="text-emerald-400">SELECT</span> department, COUNT(*)</div>
            <div><span className="text-emerald-400">FROM</span> employees</div>
            <div><span className="text-emerald-400">GROUP BY</span> department</div>
            <div className="font-bold text-emerald-300 mt-1 bg-emerald-900/20 inline-block px-2 py-0.5 rounded border border-emerald-500/20"><span className="text-emerald-400">HAVING</span> COUNT(*) &gt; 2;</div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-background rounded-xl overflow-hidden border border-border text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] my-8">
      {/* Mac Window Controls & Header */}
      <div className="h-10 border-b border-border flex items-center px-4 gap-4 bg-card relative z-20">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <h4 className="absolute left-1/2 -translate-x-1/2 font-mono text-xs font-semibold tracking-widest text-slate-400 flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          EXECUTION: WHERE vs HAVING
        </h4>
      </div>

      <div className="flex border-b border-border bg-card">
        <button 
          onClick={() => { setActiveTab('comparison'); setStep(0); }}
          className={cn("px-8 py-4 text-sm font-medium transition-colors tracking-wide", activeTab === 'comparison' ? "bg-background text-cyan-400 border-b-2 border-cyan-400" : "text-slate-500 hover:text-slate-300 hover:bg-white/5")}
        >
          WHERE vs HAVING
        </button>
        <button 
          onClick={() => setActiveTab('error')}
          className={cn("px-8 py-4 text-sm font-medium transition-colors border-l border-border tracking-wide", activeTab === 'error' ? "bg-background text-red-400 border-b-2 border-red-400" : "text-slate-500 hover:text-slate-300 hover:bg-white/5")}
        >
          Common Error Demo
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === 'comparison' ? renderComparison() : renderErrorDemo()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

