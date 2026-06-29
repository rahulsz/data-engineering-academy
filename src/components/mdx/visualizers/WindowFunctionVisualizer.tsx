'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Settings2, Database } from 'lucide-react'

const rawData = [
  { id: 1, date: '2024-01-01', region: 'North', rev: 100 },
  { id: 2, date: '2024-01-02', region: 'North', rev: 200 },
  { id: 3, date: '2024-01-03', region: 'North', rev: 200 },
  { id: 4, date: '2024-01-04', region: 'North', rev: 150 },
  { id: 5, date: '2024-01-01', region: 'South', rev: 300 },
  { id: 6, date: '2024-01-02', region: 'South', rev: 100 },
  { id: 7, date: '2024-01-03', region: 'South', rev: 400 },
  { id: 8, date: '2024-01-04', region: 'South', rev: 400 },
]

type WindowFunc = 'ROW_NUMBER()' | 'RANK()' | 'DENSE_RANK()' | 'SUM(rev)' | 'LAG(rev)'
type PartitionBy = 'None' | 'region'
type OrderBy = 'date' | 'rev'

export function WindowFunctionVisualizer() {
  const [func, setFunc] = useState<WindowFunc>('ROW_NUMBER()')
  const [partition, setPartition] = useState<PartitionBy>('None')
  const [orderBy, setOrderBy] = useState<OrderBy>('rev')
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null)

  // Compute the result set based on the selected configuration
  const processedData = useMemo(() => {
    // 1. Sort data
    const sorted = [...rawData].sort((a, b) => {
      // Primary sort by partition (if enabled)
      if (partition === 'region' && a.region !== b.region) {
        return a.region.localeCompare(b.region)
      }
      // Secondary sort by order by
      if (orderBy === 'date') return a.date.localeCompare(b.date)
      // Default to DESC for revenue to make RANK more interesting
      return b.rev - a.rev 
    })

    // 2. Compute window function
    const results = []
    let currentPartition = ''
    
    // State variables for calculations
    let rowNum = 1
    let rank = 1
    let denseRank = 1
    let runningSum = 0
    let prevVal: number | null = null
    let prevSortVal: number | string | null = null

    for (let i = 0; i < sorted.length; i++) {
      const row = sorted[i]
      const sortVal = orderBy === 'date' ? row.date : row.rev
      const isNewPartition = partition !== 'None' && row[partition] !== currentPartition

      if (isNewPartition) {
        currentPartition = row[partition as keyof typeof row] as string
        rowNum = 1
        rank = 1
        denseRank = 1
        runningSum = 0
        prevVal = null
        prevSortVal = null
      }

      runningSum += row.rev

      if (i > 0 && !isNewPartition) {
        rowNum++
        if (sortVal !== prevSortVal) {
          rank = rowNum
          denseRank++
        }
      }

      let resultVal: number | string | null = null
      if (func === 'ROW_NUMBER()') resultVal = rowNum
      else if (func === 'RANK()') resultVal = rank
      else if (func === 'DENSE_RANK()') resultVal = denseRank
      else if (func === 'SUM(rev)') resultVal = runningSum
      else if (func === 'LAG(rev)') resultVal = prevVal !== null ? prevVal : 'NULL'

      results.push({
        ...row,
        _windowResult: resultVal,
        _partition: partition === 'None' ? 'all' : currentPartition
      })

      prevVal = row.rev
      prevSortVal = sortVal
    }

    return results
  }, [func, partition, orderBy])

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
          EXECUTION: WINDOW FUNCTIONS
        </h4>
      </div>
      
      {/* Settings Bar */}
      <div className="bg-card/50 border-b border-border p-5 flex flex-wrap gap-6 items-center z-20 relative">
        <div className="flex items-center gap-2 text-sm">
          <Settings2 className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-bold uppercase tracking-wider text-xs font-mono">Engine Config</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-widest">FUNC:</span>
          <select 
            className="bg-background border border-indigo-500/30 rounded-lg px-3 py-1.5 text-sm text-indigo-300 font-bold font-mono outline-none focus:border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.1)] transition-all"
            value={func}
            onChange={e => setFunc(e.target.value as any)}
          >
            <option value="ROW_NUMBER()">ROW_NUMBER()</option>
            <option value="RANK()">RANK()</option>
            <option value="DENSE_RANK()">DENSE_RANK()</option>
            <option value="SUM(rev)">SUM(rev)</option>
            <option value="LAG(rev)">LAG(rev)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-widest">PARTITION BY:</span>
          <select 
            className="bg-background border border-emerald-500/30 rounded-lg px-3 py-1.5 text-sm text-emerald-300 font-bold font-mono outline-none focus:border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-all"
            value={partition}
            onChange={e => setPartition(e.target.value as any)}
          >
            <option value="None">None</option>
            <option value="region">region</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-widest">ORDER BY:</span>
          <select 
            className="bg-background border border-pink-500/30 rounded-lg px-3 py-1.5 text-sm text-pink-300 font-bold font-mono outline-none focus:border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.1)] transition-all"
            value={orderBy}
            onChange={e => setOrderBy(e.target.value as any)}
          >
            <option value="date">date ASC</option>
            <option value="rev">rev DESC</option>
          </select>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 bg-card relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Left: Query Preview */}
        <div className="flex flex-col gap-6 relative z-10">
          <div className="bg-background border border-border rounded-xl overflow-hidden font-mono text-sm leading-loose p-6 text-white/80 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
            <div><span className="text-cyan-400">SELECT</span></div>
            <div className="ml-4">id, date, region, rev,</div>
            <div className="ml-4 text-indigo-400 font-bold bg-indigo-950/40 px-2 py-0.5 rounded inline-block border border-indigo-500/20">{func}</div>
            <div className="ml-4"><span className="text-cyan-400 font-bold">OVER</span> (</div>
            {partition !== 'None' && (
              <div className="ml-8"><span className="text-emerald-400 font-bold">PARTITION BY</span> {partition}</div>
            )}
            <div className="ml-8"><span className="text-pink-400 font-bold">ORDER BY</span> {orderBy} {orderBy === 'rev' ? 'DESC' : 'ASC'}</div>
            <div className="ml-4">) <span className="text-cyan-400">AS</span> result</div>
            <div><span className="text-cyan-400">FROM</span> sales;</div>
          </div>

          <div className="bg-indigo-950/20 border border-indigo-500/30 p-5 rounded-xl text-indigo-200/80 text-sm leading-relaxed shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]">
            Hover over any row in the table to visualize its <strong className="text-indigo-400">Window Frame</strong>. 
            The highlighted rows are the exact dataset the window function uses to calculate the result for that specific row.
          </div>
        </div>

        {/* Right: Data Table */}
        <div className="bg-background border border-border rounded-xl p-5 overflow-y-auto max-h-[500px] relative z-10 custom-scrollbar shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
          
          <div className="grid grid-cols-5 text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-3 border-b border-border mb-3 sticky top-0 bg-background z-20 font-mono">
            <span>date</span><span>region</span><span className="text-right">rev</span><span className="col-span-2 text-right text-indigo-400">result</span>
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <AnimatePresence>
              {processedData.map((row, i) => {
                
                // Determine boundaries if partition is enabled
                let isFirstInPartition = false;
                if (partition !== 'None' && i > 0 && row._partition !== processedData[i-1]._partition) {
                  isFirstInPartition = true;
                }

                // Determine if this row is part of the "window frame" for the currently hovered row
                let isFrame = false
                const isHovered = hoveredRowId === row.id
                
                if (hoveredRowId !== null) {
                  const hoveredIdx = processedData.findIndex(r => r.id === hoveredRowId)
                  if (hoveredIdx !== -1) {
                    const hoveredRow = processedData[hoveredIdx]
                    if (row._partition === hoveredRow._partition) {
                      if (func === 'LAG(rev)') {
                        // For LAG, the frame is just the previous row
                        isFrame = i === hoveredIdx - 1
                      } else if (func === 'SUM(rev)') {
                        // For rolling sum, frame is UNBOUNDED PRECEDING AND CURRENT ROW
                        isFrame = i <= hoveredIdx
                      } else {
                        // For rank/row_number, frame is technically UNBOUNDED PRECEDING AND CURRENT ROW, but visually we can highlight all up to current
                        isFrame = i <= hoveredIdx
                      }
                    }
                  }
                }

                return (
                  <React.Fragment key={row.id}>
                    {isFirstInPartition && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="h-px bg-emerald-500/50 my-3 relative shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                      >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 rounded-full font-mono tracking-widest uppercase">
                          PARTITION BOUNDARY
                        </div>
                      </motion.div>
                    )}
                    
                    <motion.div
                      layout
                      onMouseEnter={() => setHoveredRowId(row.id)}
                      onMouseLeave={() => setHoveredRowId(null)}
                      className={cn(
                        "grid grid-cols-5 text-sm p-3.5 rounded-lg border transition-all duration-300 cursor-default",
                        isHovered 
                          ? "bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)] z-10 relative scale-[1.01]" 
                          : isFrame 
                            ? "bg-indigo-500/10 border-indigo-500/30 text-white/90" 
                            : hoveredRowId 
                              ? "bg-card border-border/50 text-slate-500 grayscale opacity-50" 
                              : "bg-card border-border/50 text-slate-300 hover:bg-white/10"
                      )}
                    >
                      <span className="font-mono text-cyan-100">{row.date}</span>
                      <span className={cn(partition === 'region' && "font-bold text-emerald-300")}>{row.region}</span>
                      <span className={cn("text-right font-mono", orderBy === 'rev' ? "font-bold text-pink-300" : "text-slate-400")}>${row.rev}</span>
                      <span className="col-span-2 text-right font-mono font-bold text-indigo-400 text-lg flex items-center justify-end gap-3">
                        {isHovered && <span className="text-[10px] text-indigo-200 uppercase tracking-widest font-sans bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded shadow-inner">current row</span>}
                        {row._windowResult}
                      </span>
                    </motion.div>
                  </React.Fragment>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
