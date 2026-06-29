'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizerControls } from './VisualizerControls'
import { cn } from '@/lib/utils'
import { Database } from 'lucide-react'

const employees = [
  { id: 1, name: "Alice Chen", department: "Engineering", salary: 95000 },
  { id: 2, name: "Bob Smith", department: "Marketing", salary: 45000 },
  { id: 3, name: "Carol Jones", department: "Engineering", salary: 88000 },
  { id: 4, name: "David Lee", department: "Sales", salary: 62000 },
  { id: 5, name: "Eve Wilson", department: "Engineering", salary: 72000 },
  { id: 6, name: "Frank Brown", department: "Marketing", salary: 38000 },
  { id: 7, name: "Grace Kim", department: "Sales", salary: 55000 },
  { id: 8, name: "Henry Park", department: "Engineering", salary: 91000 },
  { id: 9, name: "Iris Taylor", department: "HR", salary: 58000 },
  { id: 10, name: "Jack Davis", department: "Marketing", salary: 52000 },
  { id: 11, name: "Kate Miller", department: "HR", salary: 61000 },
  { id: 12, name: "Liam Garcia", department: "Sales", salary: 48000 },
]

const steps = [
  { label: "FROM", clause: "FROM employees" },
  { label: "WHERE", clause: "WHERE salary > 50000" },
  { label: "GROUP BY", clause: "GROUP BY department" },
  { label: "HAVING", clause: "HAVING COUNT(*) >= 2" },
  { label: "SELECT", clause: "SELECT department, COUNT(*) as headcount, AVG(salary) as avg_salary" },
  { label: "ORDER BY", clause: "ORDER BY avg_salary DESC LIMIT 5" },
]

const explanations = [
  "🔍 Step 1: FROM — The database first loads all 12 rows from the employees table into memory.",
  "🔍 Step 2: WHERE — Rows not matching 'salary > 50000' are eliminated. 9 of 12 rows pass.",
  "🔍 Step 3: GROUP BY — The remaining 9 rows are grouped into buckets based on their department.",
  "🔍 Step 4: HAVING — Groups with fewer than 2 members (Marketing) are eliminated.",
  "🔍 Step 5: SELECT — The database calculates the aggregate functions (COUNT, AVG) for each group.",
  "🔍 Step 6: ORDER BY — The final groups are sorted by avg_salary in descending order."
]

const deptColors: Record<string, string> = {
  Engineering: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]",
  Sales: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
  HR: "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
  Marketing: "bg-pink-500/10 border-pink-500/30 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.1)]",
}

export function ExecutionOrderVisualizer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= steps.length - 1) {
          setIsPlaying(false)
          return s
        }
        return s + 1
      })
    }, 2500)
    return () => clearInterval(timer)
  }, [isPlaying])

  const renderData = () => {
    // Step 0: All rows
    if (step === 0) {
      return (
        <div className="grid grid-cols-2 gap-2">
          <AnimatePresence>
            {employees.map((emp, i) => (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="bg-background border border-border/50 hover:bg-white/5 hover:border-border p-2.5 rounded-lg text-xs flex justify-between transition-colors shadow-sm"
              >
                <span className="truncate w-1/3 text-slate-300">{emp.name}</span>
                <span className="truncate w-1/3 text-slate-500 font-medium">{emp.department}</span>
                <span className="w-1/4 text-right font-mono text-cyan-200/70">${emp.salary.toLocaleString()}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )
    }

    // Step 1: WHERE
    if (step === 1) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {employees.map((emp) => {
            const pass = emp.salary > 50000
            return (
              <motion.div
                key={emp.id}
                layout
                className={cn(
                  "border p-2.5 rounded-lg text-xs flex justify-between transition-all duration-500",
                  pass 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                    : "bg-red-500/5 border-red-500/20 text-slate-500 grayscale opacity-40"
                )}
              >
                <span className="truncate w-1/3 font-medium">{emp.name}</span>
                <span className={cn("truncate w-1/3", pass ? "text-emerald-300" : "text-slate-600")}>{emp.department}</span>
                <span className={cn("w-1/4 text-right font-mono", pass ? "text-emerald-400" : "text-slate-600")}>${emp.salary.toLocaleString()}</span>
              </motion.div>
            )
          })}
        </div>
      )
    }

    // Step 2 & 3: GROUP BY & HAVING
    if (step === 2 || step === 3) {
      const groups = ['Engineering', 'Sales', 'HR', 'Marketing']
      return (
        <div className="flex flex-col gap-4">
          {groups.map(dept => {
            const deptEmps = employees.filter(e => e.department === dept && e.salary > 50000)
            if (deptEmps.length === 0) return null
            
            const isEliminated = step === 3 && deptEmps.length < 2

            return (
              <motion.div
                key={dept}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: isEliminated ? 0.3 : 1, scale: 1 }}
                className={cn(
                  "p-4 rounded-xl border flex flex-col gap-3 transition-all duration-500",
                  deptColors[dept],
                  isEliminated && "grayscale border-border/50 bg-background text-slate-500 shadow-none"
                )}
              >
                <div className="font-bold text-xs tracking-widest uppercase flex items-center justify-between">
                  <span>{dept}</span>
                  <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full">{deptEmps.length} members</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {deptEmps.map(emp => (
                    <motion.div key={emp.id} layout className="bg-black/40 border border-border/50 p-2 rounded-lg text-xs flex justify-between shadow-inner">
                      <span className="font-medium text-white/90">{emp.name}</span>
                      <span className="font-mono text-white/70">${emp.salary.toLocaleString()}</span>
                    </motion.div>
                  ))}
                </div>
                {isEliminated && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg backdrop-blur-sm -rotate-12">
                      Eliminated
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )
    }

    // Step 4 & 5: SELECT & ORDER BY
    let aggregates = [
      { dept: 'Engineering', count: 4, avg: 86500 },
      { dept: 'Sales', count: 2, avg: 58500 },
      { dept: 'HR', count: 2, avg: 59500 }
    ]
    
    if (step === 5) {
      aggregates = aggregates.sort((a, b) => b.avg - a.avg)
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 p-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-border mb-3 sticky top-0 bg-card z-10 font-mono">
          <span>department</span>
          <span className="text-center">headcount</span>
          <span className="text-right">avg_salary</span>
        </div>
        <AnimatePresence>
          {aggregates.map((agg, i) => (
            <motion.div
              key={agg.dept}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: step === 4 ? i * 0.1 : 0 }}
              className={cn("grid grid-cols-3 p-4 rounded-xl border items-center", deptColors[agg.dept])}
            >
              <span className="font-bold text-sm">{agg.dept}</span>
              <span className="text-center font-mono text-base font-bold bg-black/40 py-1 rounded-lg border border-border/50 mx-4">{agg.count}</span>
              <span className="text-right font-mono text-base font-bold">${agg.avg.toLocaleString()}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

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
          EXECUTION: ORDER OF OPERATIONS
        </h4>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[450px] bg-card relative z-10">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Left: Query & Explanation */}
        <div className="flex flex-col gap-6 relative z-10">
          <h4 className="font-bold text-cyan-400 text-xs tracking-widest uppercase font-mono">SQL Query</h4>
          <div className="bg-background border border-border rounded-xl overflow-hidden font-mono text-sm leading-loose p-6 text-slate-400 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] flex flex-col gap-2">
            <div>
              <span className={cn("transition-all duration-300 px-3 py-1.5 rounded-lg inline-block", step === 4 ? "bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "border border-transparent")}>
                <span className="text-cyan-400">SELECT</span> department, <span className="text-emerald-400">COUNT</span>(*) <span className="text-cyan-400">as</span> headcount, <span className="text-emerald-400">AVG</span>(salary) <span className="text-cyan-400">as</span> avg_salary
              </span>
            </div>
            <div>
              <span className={cn("transition-all duration-300 px-3 py-1.5 rounded-lg inline-block", step === 0 ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "border border-transparent")}>
                <span className="text-cyan-400">FROM</span> employees
              </span>
            </div>
            <div>
              <span className={cn("transition-all duration-300 px-3 py-1.5 rounded-lg inline-block", step === 1 ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "border border-transparent")}>
                <span className="text-cyan-400">WHERE</span> salary &gt; <span className="text-pink-400">50000</span>
              </span>
            </div>
            <div>
              <span className={cn("transition-all duration-300 px-3 py-1.5 rounded-lg inline-block", step === 2 ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "border border-transparent")}>
                <span className="text-cyan-400">GROUP BY</span> department
              </span>
            </div>
            <div>
              <span className={cn("transition-all duration-300 px-3 py-1.5 rounded-lg inline-block", step === 3 ? "bg-pink-500/20 text-pink-300 font-bold border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.2)]" : "border border-transparent")}>
                <span className="text-cyan-400">HAVING</span> <span className="text-emerald-400">COUNT</span>(*) &gt;= <span className="text-pink-400">2</span>
              </span>
            </div>
            <div>
              <span className={cn("transition-all duration-300 px-3 py-1.5 rounded-lg inline-block", step === 5 ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "border border-transparent")}>
                <span className="text-cyan-400">ORDER BY</span> avg_salary <span className="text-cyan-400">DESC LIMIT</span> <span className="text-pink-400">5</span>;
              </span>
            </div>
          </div>
          
          <div className="bg-indigo-950/20 border border-indigo-500/30 p-5 rounded-xl shadow-[inset_0_0_20px_rgba(99,102,241,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
            <motion.p 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-indigo-200/90 text-sm leading-relaxed font-medium pl-2"
            >
              {explanations[step]}
            </motion.p>
          </div>
        </div>

        {/* Right: Data Visualization */}
        <div className="flex flex-col gap-6 relative z-10">
          <h4 className="font-bold text-indigo-400 text-xs tracking-widest uppercase font-mono text-center lg:text-left">Memory State</h4>
          <div className="bg-background border border-border/50 rounded-xl p-5 overflow-y-auto max-h-[450px] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] custom-scrollbar relative">
            {renderData()}
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
  )
}
