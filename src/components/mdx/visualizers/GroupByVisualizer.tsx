'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizerControls } from './VisualizerControls'
import { cn } from '@/lib/utils'
import { Settings2, Database } from 'lucide-react'

const employees = [
  { id: 1, name: "Alice Chen", department: "Engineering", job_title: "Senior Eng", salary: 95000 },
  { id: 2, name: "Bob Smith", department: "Marketing", job_title: "Manager", salary: 45000 },
  { id: 3, name: "Carol Jones", department: "Engineering", job_title: "Eng", salary: 88000 },
  { id: 4, name: "David Lee", department: "Sales", job_title: "AE", salary: 62000 },
  { id: 5, name: "Eve Wilson", department: "Engineering", job_title: "Eng", salary: 72000 },
  { id: 6, name: "Frank Brown", department: "Marketing", job_title: "Analyst", salary: 38000 },
  { id: 7, name: "Grace Kim", department: "Sales", job_title: "AE", salary: 55000 },
  { id: 8, name: "Henry Park", department: "Engineering", job_title: "Manager", salary: 91000 },
  { id: 9, name: "Iris Taylor", department: "HR", job_title: "Manager", salary: 58000 },
  { id: 10, name: "Jack Davis", department: "Marketing", job_title: "Analyst", salary: 52000 },
  { id: 11, name: "Kate Miller", department: "HR", job_title: "Analyst", salary: 61000 },
  { id: 12, name: "Liam Garcia", department: "Sales", job_title: "Manager", salary: 48000 },
]

const groupColors = [
  "bg-indigo-500/10 border-indigo-500/30 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.1)]",
  "bg-emerald-500/10 border-emerald-500/30 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
  "bg-amber-500/10 border-amber-500/30 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
  "bg-pink-500/10 border-pink-500/30 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.1)]",
  "bg-cyan-500/10 border-cyan-500/30 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.1)]",
]

type AggFunc = 'COUNT(*)' | 'SUM(salary)' | 'AVG(salary)' | 'MIN(salary)' | 'MAX(salary)'

export function GroupByVisualizer() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [groupBy, setGroupBy] = useState<'department' | 'job_title'>('department')
  const [aggFunc, setAggFunc] = useState<AggFunc>('COUNT(*)')
  const [havingEnabled, setHavingEnabled] = useState(false)
  const [havingThreshold, setHavingThreshold] = useState(60000)

  // Reset steps when controls change
  useEffect(() => {
    setStep(0)
    setIsPlaying(false)
  }, [groupBy, aggFunc, havingEnabled, havingThreshold])

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= 4) {
          setIsPlaying(false)
          return s
        }
        return s + 1
      })
    }, 2000)
    return () => clearInterval(timer)
  }, [isPlaying])

  const calculateAgg = (emps: typeof employees) => {
    if (aggFunc === 'COUNT(*)') return emps.length
    if (aggFunc === 'SUM(salary)') return emps.reduce((a, b) => a + b.salary, 0)
    if (aggFunc === 'AVG(salary)') return Math.round(emps.reduce((a, b) => a + b.salary, 0) / emps.length)
    if (aggFunc === 'MIN(salary)') return Math.min(...emps.map(e => e.salary))
    if (aggFunc === 'MAX(salary)') return Math.max(...emps.map(e => e.salary))
    return 0
  }

  const formatAgg = (val: number) => {
    if (aggFunc === 'COUNT(*)') return val
    return `$${val.toLocaleString()}`
  }

  const renderData = () => {
    // Grouping data
    const groupedData = employees.reduce((acc, emp) => {
      const key = emp[groupBy]
      if (!acc[key]) acc[key] = []
      acc[key].push(emp)
      return acc
    }, {} as Record<string, typeof employees>)

    const groupKeys = Object.keys(groupedData)

    if (step === 0) {
      return (
        <motion.div layout className="grid grid-cols-2 gap-2 relative z-10">
          <AnimatePresence>
            {employees.map(emp => (
              <motion.div 
                key={emp.id} 
                layout 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-background border border-border p-3 rounded-lg text-xs flex justify-between shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              >
                <span className="text-slate-300 font-medium">{emp.name}</span>
                <span className="text-white/40 font-mono text-[10px] uppercase tracking-wider">{emp[groupBy]}</span>
                <span className="font-mono text-slate-400">${emp.salary.toLocaleString()}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )
    }

    if (step === 4) {
      // Summary view
      return (
        <div className="flex flex-col gap-2 relative z-10">
          <div className="grid grid-cols-2 p-2 text-xs font-semibold text-white/50 uppercase tracking-widest font-mono border-b border-border mb-2">
            <span>{groupBy}</span>
            <span className="text-right">{aggFunc}</span>
          </div>
          <AnimatePresence>
            {groupKeys.map((key, i) => {
              const val = calculateAgg(groupedData[key])
              const passHaving = !havingEnabled || val > havingThreshold
              if (!passHaving) return null
              return (
                <motion.div
                  key={key}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                  className={cn("grid grid-cols-2 p-4 rounded-xl border", groupColors[i % groupColors.length])}
                >
                  <span className="font-semibold tracking-wide">{key}</span>
                  <span className="text-right font-mono font-bold text-base">{formatAgg(val)}</span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4 relative z-10">
        <AnimatePresence>
          {groupKeys.map((key, i) => {
            const val = calculateAgg(groupedData[key])
            const passHaving = !havingEnabled || val > havingThreshold
            const isEliminated = step >= 3 && !passHaving

            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isEliminated ? 0.3 : 1, 
                  y: 0,
                  scale: isEliminated ? 0.98 : 1
                }}
                transition={{ type: "spring", bounce: 0.2 }}
                className={cn(
                  "p-4 rounded-xl border flex flex-col gap-3 transition-all duration-500",
                  groupColors[i % groupColors.length],
                  isEliminated && "grayscale border-border/50 bg-background/50 shadow-none"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold tracking-wide">{key}</span>
                  <AnimatePresence>
                    {step >= 2 && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-background border border-border px-3 py-1 rounded-lg text-sm font-mono font-bold shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                      >
                        {formatAgg(val)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <AnimatePresence>
                    {groupedData[key].map(emp => (
                      <motion.div 
                        key={emp.id} 
                        layout 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-background/60 border border-border/50 p-2.5 rounded-lg text-xs flex justify-between"
                      >
                        <span className="text-slate-300 font-medium">{emp.name}</span>
                        <span className="font-mono text-slate-400">${emp.salary.toLocaleString()}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    )
  }

  const explanations = [
    "Step 1: Flat list of rows from the table.",
    "Step 2: Rows physically group into buckets based on the GROUP BY column.",
    "Step 3: Aggregate computation executes within each individual bucket.",
    havingEnabled 
      ? `Step 4: HAVING clause filters out groups where ${aggFunc} <= ${havingThreshold}.`
      : "Step 4: (HAVING clause is disabled).",
    "Step 5: Groups collapse into a single summary row each for the final result."
  ]

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
          EXECUTION: GROUP BY
        </h4>
      </div>
      
      {/* Settings Bar */}
      <div className="bg-card/50 border-b border-border p-4 flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-2 text-sm">
          <Settings2 className="w-4 h-4 text-cyan-500" />
          <span className="text-slate-300 font-medium tracking-wide">Controls</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono uppercase tracking-widest">Group By:</span>
          <select 
            className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-slate-300 focus:border-cyan-500/50 focus:outline-none transition-colors"
            value={groupBy}
            onChange={e => setGroupBy(e.target.value as any)}
          >
            <option value="department">department</option>
            <option value="job_title">job_title</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono uppercase tracking-widest">Aggregate:</span>
          <select 
            className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-slate-300 focus:border-cyan-500/50 focus:outline-none transition-colors"
            value={aggFunc}
            onChange={e => setAggFunc(e.target.value as any)}
          >
            <option value="COUNT(*)">COUNT(*)</option>
            <option value="SUM(salary)">SUM(salary)</option>
            <option value="AVG(salary)">AVG(salary)</option>
            <option value="MIN(salary)">MIN(salary)</option>
            <option value="MAX(salary)">MAX(salary)</option>
          </select>
        </div>

        <div className="flex items-center gap-4 border-l border-border pl-6">
          <label className="flex items-center gap-2 text-xs text-slate-500 font-mono uppercase tracking-widest cursor-pointer group">
            <input 
              type="checkbox" 
              checked={havingEnabled}
              onChange={e => setHavingEnabled(e.target.checked)}
              className="rounded bg-background border-white/20 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer transition-colors"
            />
            <span className="group-hover:text-slate-300 transition-colors">Enable HAVING</span>
          </label>
          
          <AnimatePresence>
            {havingEnabled && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <span className="text-xs text-slate-500 font-mono">{">"}</span>
                <input 
                  type="number" 
                  value={havingThreshold}
                  onChange={e => setHavingThreshold(Number(e.target.value))}
                  className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-slate-300 w-24 focus:border-cyan-500/50 focus:outline-none transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-full md:min-h-[450px]">
        {/* Left: Query & Explanation */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border bg-card/50 p-6 flex flex-col gap-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col h-full gap-6">
            <div className="bg-background border border-border rounded-lg p-5 font-mono text-sm text-cyan-300 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] whitespace-pre-wrap leading-loose">
              <div><span className="text-cyan-500">SELECT</span> {groupBy}, {aggFunc} as result</div>
              <div><span className="text-cyan-500">FROM</span> employees</div>
              <div>
                <span className={cn("transition-colors px-1 rounded", step >= 1 && "bg-cyan-900/40 text-cyan-100 font-semibold")}>
                  <span className="text-cyan-500">GROUP BY</span> {groupBy}
                </span>
              </div>
              {havingEnabled && (
                <div>
                  <span className={cn("transition-colors px-1 rounded", step >= 3 && "bg-cyan-900/40 text-cyan-100 font-semibold")}>
                    <span className="text-cyan-500">HAVING</span> {aggFunc} &gt; {havingThreshold}
                  </span>
                </div>
              )}
            </div>
            
            <div className="bg-background border border-border/50 p-5 rounded-xl min-h-[100px] flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-slate-300 text-sm leading-relaxed"
                >
                  {explanations[step]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: Data Visualization */}
        <div className="flex-1 p-6 md:p-8 flex justify-center relative overflow-hidden bg-card">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          
          <div className="w-full max-w-2xl overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
            {renderData()}
          </div>
        </div>
      </div>
      
      <VisualizerControls 
        step={step}
        totalSteps={5}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={() => setStep(s => Math.min(4, s + 1))}
        onPrev={() => setStep(s => Math.max(0, s - 1))}
        onReset={() => { setStep(0); setIsPlaying(false); }}
      />
    </div>
  )
}

