'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Database } from 'lucide-react'
import { VisualizerControls } from './VisualizerControls'

export function SubqueryVisualizer() {
  const [activeTab, setActiveTab] = useState<'scalar' | 'list' | 'table'>('scalar')
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Use useEffect to handle playing state, similar to GroupBy
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setStep((s) => {
          if (s >= 2) {
            setIsPlaying(false)
            return s
          }
          return s + 1
        })
      }, 2500) // Slightly longer to allow reading explanations
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const renderScalar = () => {
    const avg = 68500
    const employees = [
      { name: "Alice", salary: 95000 },
      { name: "Bob", salary: 45000 },
      { name: "Carol", salary: 88000 },
      { name: "David", salary: 46000 }
    ]

    return (
      <div className="flex flex-col gap-6">
        <div className="bg-background border border-border rounded-xl p-5 font-mono text-sm leading-loose text-white/80 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
          <div><span className="text-cyan-400">SELECT</span> name, salary,</div>
          <div className="relative inline-block mt-2 mb-2 ml-6">
            <span className={cn(
              "px-3 py-1.5 rounded-lg transition-all duration-500",
              step === 0 ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "text-slate-500 border border-transparent"
            )}>
              (<span className="text-cyan-400">SELECT</span> <span className="text-emerald-400">AVG</span>(salary) <span className="text-cyan-400">FROM</span> employees)
            </span>
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 0, scale: 0.8 }}
                animate={{ opacity: 1, y: -45, scale: 1 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-500 text-[#050505] font-bold px-4 py-1.5 rounded-full shadow-[0_10px_20px_rgba(245,158,11,0.3)] tracking-wide"
              >
                ${avg.toLocaleString()}
              </motion.div>
            )}
          </div>
          <div className="inline-block text-slate-400 ml-3">AS company_avg</div>
          <div><span className="text-cyan-400">FROM</span> employees;</div>
        </div>

        <div className="bg-background border border-border p-5 rounded-xl min-h-[250px] shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]">
          <div className="grid grid-cols-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-3 border-b border-border pb-3 font-mono">
            <span>name</span><span>salary</span><span className="text-right">company_avg</span>
          </div>
          {employees.map((e, i) => (
            <div key={e.name} className="grid grid-cols-3 text-sm bg-card p-3 rounded-lg mb-1.5 border border-border/50 transition-colors hover:bg-white/5">
              <span className="text-slate-300">{e.name}</span>
              <span className="font-mono text-cyan-200/70">${e.salary.toLocaleString()}</span>
              <span className="text-right font-mono text-amber-400 font-bold">
                {step >= 2 ? (
                  <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: i * 0.1 }}>
                    ${avg.toLocaleString()}
                  </motion.span>
                ) : <span className="text-slate-600 italic">NULL</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderList = () => {
    const usaIds = [1, 3, 5]
    const orders = [
      { id: 101, c_id: 1, amount: 299 },
      { id: 102, c_id: 2, amount: 145 },
      { id: 103, c_id: 3, amount: 567 },
      { id: 104, c_id: 4, amount: 89 },
      { id: 105, c_id: 5, amount: 234 }
    ]

    return (
      <div className="flex flex-col gap-6">
        <div className="bg-background border border-border rounded-xl p-5 font-mono text-sm leading-loose text-white/80 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
          <div><span className="text-cyan-400">SELECT</span> * <span className="text-cyan-400">FROM</span> orders</div>
          <div className="flex items-center gap-2 mt-2">
            <span><span className="text-cyan-400">WHERE</span> customer_id <span className="text-emerald-400 font-bold">IN</span> (</span>
            <div className="relative inline-block">
              <span className={cn(
                "px-3 py-1.5 rounded-lg transition-all duration-500",
                step === 0 ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "text-slate-500 border border-transparent"
              )}>
                <span className={cn(step === 0 ? "text-cyan-300" : "")}>SELECT</span> id <span className={cn(step === 0 ? "text-cyan-300" : "")}>FROM</span> customers <span className={cn(step === 0 ? "text-cyan-300" : "")}>WHERE</span> country = <span className="text-amber-300">'USA'</span>
              </span>
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 0, scale: 0.8 }}
                  animate={{ opacity: 1, y: -45, scale: 1 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-full shadow-[0_10px_20px_rgba(99,102,241,0.3)] flex gap-1 tracking-widest font-mono"
                >
                  [1, 3, 5]
                </motion.div>
              )}
            </div>
            <span>);</span>
          </div>
        </div>

        <div className="bg-background border border-border p-5 rounded-xl min-h-[250px] shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]">
          <div className="grid grid-cols-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-3 border-b border-border pb-3 font-mono">
            <span>order_id</span><span>customer_id</span><span>amount</span>
          </div>
          {orders.map((o) => {
            const isMatch = usaIds.includes(o.c_id)
            return (
              <motion.div 
                key={o.id} 
                layout
                className={cn(
                  "grid grid-cols-3 text-sm p-3 rounded-lg mb-1.5 border transition-all duration-500",
                  step >= 2 ? (isMatch ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.1)]" : "bg-card border-border/50 text-slate-500 grayscale opacity-50") : "bg-card border-border/50 text-slate-300 hover:bg-white/5"
                )}
              >
                <span>{o.id}</span>
                <span className={cn("font-bold font-mono", step >= 2 && isMatch && "text-indigo-400")}>{o.c_id}</span>
                <span className="font-mono text-emerald-200/70">${o.amount}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderTable = () => {
    const baseGroups = [
      { dept: "Engineering", avg: 86500 },
      { dept: "Sales", avg: 58500 },
      { dept: "HR", avg: 59500 },
      { dept: "Marketing", avg: 45000 }
    ]

    return (
      <div className="flex flex-col gap-6">
        <div className="bg-background border border-border rounded-xl p-5 font-mono text-sm leading-loose text-white/80 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
          <div><span className="text-cyan-400">SELECT</span> dept_stats.department, dept_stats.avg_salary</div>
          <div className="flex items-start gap-3 mt-2">
            <span><span className="text-cyan-400">FROM</span> (</span>
            <div className={cn(
              "px-4 py-2 rounded-xl border transition-all duration-500 relative",
              step === 0 ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]" : "bg-transparent border-border text-slate-500"
            )}>
              {step === 0 && (
                <div className="absolute -left-2 -top-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,1)]" />
              )}
              <div><span className={cn(step === 0 ? "text-cyan-300" : "")}>SELECT</span> department, <span className={cn(step === 0 ? "text-emerald-300" : "")}>AVG</span>(salary) <span className={cn(step === 0 ? "text-cyan-300" : "")}>AS</span> avg_salary</div>
              <div><span className={cn(step === 0 ? "text-cyan-300" : "")}>FROM</span> employees <span className={cn(step === 0 ? "text-cyan-300" : "")}>GROUP BY</span> department</div>
            </div>
            <span className="self-end">) <span className="text-cyan-400">AS</span> dept_stats</span>
          </div>
          <div className={cn("mt-4 px-3 py-1.5 rounded-lg w-fit transition-all duration-500", step === 1 && "bg-emerald-500/20 text-emerald-100 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]")}>
            <span className="text-cyan-400">WHERE</span> avg_salary &gt; 60000;
          </div>
        </div>

        <div className="bg-background border border-border p-6 rounded-xl min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]">
          {/* Grid background */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          
          {step === 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-slate-500 italic font-mono relative z-10 flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              Executing inner query...
            </motion.div>
          )}

          {step >= 1 && (
            <motion.div 
              layoutId="temp-table"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="bg-card border border-emerald-500/40 rounded-xl p-5 w-full max-w-md shadow-[0_15px_40px_rgba(16,185,129,0.1)] relative z-10"
            >
              <div className="absolute -top-3 -left-3 bg-emerald-500 text-[#050505] text-xs font-bold px-3 py-1 rounded-full shadow-lg tracking-wide">
                Virtual Table: "dept_stats"
              </div>
              
              <div className="grid grid-cols-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 px-3 border-b border-emerald-500/20 pb-3 font-mono">
                <span>department</span><span className="text-right">avg_salary</span>
              </div>
              
              <AnimatePresence>
                {baseGroups.map((g) => {
                  const pass = g.avg > 60000
                  if (step === 2 && !pass) return null
                  
                  return (
                    <motion.div 
                      key={g.dept}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      className={cn(
                        "grid grid-cols-2 text-sm p-3 rounded-lg mb-1.5 transition-colors border",
                        step === 1 && !pass ? "bg-red-500/10 text-red-300 border-red-500/30 grayscale opacity-50" : "bg-emerald-500/10 text-emerald-100 border-emerald-500/30"
                      )}
                    >
                      <span>{g.dept}</span>
                      <span className="text-right font-mono">${g.avg.toLocaleString()}</span>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  const explanations = {
    scalar: [
      "Step 1: The database isolates the scalar subquery (a query returning exactly one value).",
      "Step 2: It executes the subquery first, computing the company average.",
      "Step 3: It treats that single value as a literal constant and assigns it to every row in the outer query."
    ],
    list: [
      "Step 1: The inner query is executed, returning a list of customer IDs.",
      "Step 2: The list is materialized into memory (or optimized into a JOIN).",
      "Step 3: The outer query filters orders based on whether the customer_id exists in the list."
    ],
    table: [
      "Step 1: The inner query executes completely before the outer query.",
      "Step 2: A temporary, in-memory table is created and assigned the alias 'dept_stats'.",
      "Step 3: The outer query treats this temporary table like any normal table and applies its WHERE filter."
    ]
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
          EXECUTION: SUBQUERIES
        </h4>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card/50">
        {(['scalar', 'list', 'table'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); setStep(0); setIsPlaying(false); }}
            className={cn(
              "flex-1 px-4 py-4 text-xs font-bold transition-colors uppercase tracking-widest font-mono",
              activeTab === tab ? "bg-white/5 text-cyan-400 border-b-2 border-cyan-500 shadow-[inset_0_-10px_20px_rgba(6,182,212,0.1)]" : "text-slate-500 hover:text-slate-300 hover:bg-white/5 border-b-2 border-transparent"
            )}
          >
            {tab} Subquery
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8 bg-card relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {activeTab === 'scalar' && renderScalar()}
            {activeTab === 'list' && renderList()}
            {activeTab === 'table' && renderTable()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Explanation Banner */}
      <div className="bg-background border-t border-b border-border p-5">
        <div className="text-sm text-slate-300 font-mono flex flex-col md:flex-row md:items-center gap-3">
          <div className="shrink-0">
            <strong className="text-cyan-400 font-bold uppercase tracking-widest text-xs border border-cyan-500/30 bg-cyan-950/40 px-2 py-1 rounded">Execution Engine:</strong> 
          </div>
          <div className="leading-relaxed">
            {explanations[activeTab][step]}
          </div>
        </div>
      </div>

      {/* Controls */}
      <VisualizerControls 
        step={step}
        totalSteps={3}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={() => setStep(s => Math.min(2, s + 1))}
        onPrev={() => setStep(s => Math.max(0, s - 1))}
        onReset={() => { setStep(0); setIsPlaying(false); }}
      />
    </div>
  )
}
