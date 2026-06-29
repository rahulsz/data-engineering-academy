'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Database } from 'lucide-react'

const customers = [
  { id: 1, name: "Alice", country: "USA" },
  { id: 2, name: "Bob", country: "UK" },
  { id: 3, name: "Carol", country: "USA" },
  { id: 4, name: "David", country: "GER" },
  { id: 5, name: "Eve", country: "USA" },
  { id: 6, name: "Frank", country: "UK" },
  { id: 7, name: "Grace", country: "JPN" },
  { id: 8, name: "Henry", country: "CAN" }, // 4,7,8 no orders
]

const orders = [
  { id: 1, customer_id: 1, total: 299 },
  { id: 2, customer_id: 1, total: 145 },
  { id: 3, customer_id: 2, total: 567 },
  { id: 4, customer_id: 3, total: 89 },
  { id: 5, customer_id: 3, total: 234 },
  { id: 6, customer_id: 5, total: 445 },
  { id: 7, customer_id: 5, total: 78 },
  { id: 8, customer_id: 6, total: 891 },
  { id: 9, customer_id: 99, total: 123 }, // No customer
  { id: 10, customer_id: 99, total: 456 }, // No customer
]

type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS'

export function JoinVisualizer() {
  const [joinType, setJoinType] = useState<JoinType>('INNER')

  const generateResults = () => {
    const results: any[] = []
    
    if (joinType === 'CROSS') {
      return [] // We won't render all 80 rows to save DOM nodes, just show warning
    }

    // Inner join core
    const matchedCustomerIds = new Set<number>()
    const matchedOrderIds = new Set<number>()

    orders.forEach(o => {
      const c = customers.find(c => c.id === o.customer_id)
      if (c) {
        results.push({ ...c, o_id: o.id, total: o.total, match: true })
        matchedCustomerIds.add(c.id)
        matchedOrderIds.add(o.id)
      }
    })

    if (joinType === 'LEFT' || joinType === 'FULL') {
      customers.forEach(c => {
        if (!matchedCustomerIds.has(c.id)) {
          results.push({ ...c, o_id: 'NULL', total: 'NULL', match: false })
        }
      })
    }

    if (joinType === 'RIGHT' || joinType === 'FULL') {
      orders.forEach(o => {
        if (!matchedOrderIds.has(o.id)) {
          results.push({ id: 'NULL', name: 'NULL', country: 'NULL', o_id: o.id, total: o.total, match: false })
        }
      })
    }

    // Sort to keep consistent order (matches first, then left orphans, then right orphans)
    return results.sort((a, b) => {
      if (a.match && !b.match) return -1;
      if (!a.match && b.match) return 1;
      return 0;
    })
  }

  const results = generateResults()
  
  const getRowCounts = () => {
    switch (joinType) {
      case 'INNER': return 8;
      case 'LEFT': return 11;
      case 'RIGHT': return 10;
      case 'FULL': return 13;
      case 'CROSS': return 80;
    }
  }

  const renderVenn = () => {
    // Cyberpunk themed venn diagram
    const leftColor = '#06b6d4' // cyan-500
    const rightColor = '#10b981' // emerald-500
    const intersectionColor = '#6366f1' // indigo-500
    
    return (
      <svg width="120" height="80" viewBox="0 0 120 80" className="opacity-90">
        <defs>
          <filter id="glow-left" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-right" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <circle cx="45" cy="40" r="28" 
          fill={['LEFT', 'FULL'].includes(joinType) ? leftColor : 'transparent'} 
          stroke={leftColor} strokeWidth="2" 
          fillOpacity={joinType === 'INNER' || joinType === 'RIGHT' ? "0" : "0.3"} 
          filter={['LEFT', 'FULL'].includes(joinType) ? "url(#glow-left)" : "none"}
        />
        
        <circle cx="75" cy="40" r="28" 
          fill={['RIGHT', 'FULL'].includes(joinType) ? rightColor : 'transparent'} 
          stroke={rightColor} strokeWidth="2" 
          fillOpacity={joinType === 'INNER' || joinType === 'LEFT' ? "0" : "0.3"} 
          filter={['RIGHT', 'FULL'].includes(joinType) ? "url(#glow-right)" : "none"}
        />
        
        {/* Intersection */}
        <path d="M 60 16 A 28 28 0 0 0 60 64 A 28 28 0 0 0 60 16 Z" 
          fill={intersectionColor} 
          fillOpacity={joinType !== 'CROSS' ? "0.8" : "0"} 
        />
      </svg>
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
          EXECUTION: JOINS
        </h4>
      </div>
      
      {/* Settings Bar */}
      <div className="bg-card/50 border-b border-border p-4 flex flex-wrap gap-3 justify-center items-center relative z-20">
        {(['INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS'] as JoinType[]).map(type => (
          <button
            key={type}
            onClick={() => setJoinType(type)}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 tracking-wide font-mono",
              joinType === type 
                ? "bg-cyan-500 text-[#050505] shadow-[0_0_20px_rgba(6,182,212,0.4)]" 
                : "text-slate-400 hover:text-cyan-400 hover:bg-white/5 border border-transparent hover:border-cyan-500/30"
            )}
          >
            {type} JOIN
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden bg-card">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
        
        {/* Info row */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-background border border-border rounded-xl p-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] relative z-10 gap-6">
          <div className="font-mono text-sm leading-loose">
            <div><span className="text-cyan-500">SELECT</span> c.name, o.total</div>
            <div><span className="text-cyan-500">FROM</span> customers c</div>
            <div>
              <span className="text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">{joinType} JOIN</span> orders o
            </div>
            <div><span className="text-cyan-500">ON</span> c.id = o.customer_id;</div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            {renderVenn()}
            <div className="text-xs text-slate-400 font-mono tracking-widest uppercase bg-card border border-border px-4 py-2 rounded-lg shadow-inner">
              Result: <strong className="text-cyan-400">{getRowCounts()} rows</strong>
            </div>
          </div>
        </div>

        {joinType === 'CROSS' ? (
          <div className="bg-red-950/10 border border-red-500/30 p-8 rounded-xl text-center flex flex-col items-center justify-center min-h-[300px] relative z-10 shadow-[inset_0_0_40px_rgba(239,68,68,0.05)]">
            <span className="text-4xl mb-6">⚠️</span>
            <h3 className="text-xl font-bold text-red-400 mb-3 tracking-wide uppercase">CROSS JOIN Warning</h3>
            <p className="text-slate-300 max-w-lg leading-relaxed text-sm">
              A CROSS JOIN produces a Cartesian product, multiplying every row in Table A by every row in Table B.
            </p>
            <p className="text-red-200 font-mono mt-6 bg-background px-6 py-3 rounded-lg border border-red-500/30 shadow-[0_5px_20px_rgba(239,68,68,0.15)]">
              8 customers × 10 orders = 80 rows
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            
            <div className="flex flex-col gap-4">
              <h4 className="text-center font-bold text-cyan-400 text-xs tracking-widest uppercase font-mono">Customers (Left Table)</h4>
              <div className="bg-background border border-cyan-500/20 shadow-[inset_0_0_15px_rgba(6,182,212,0.05)] rounded-xl p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-3 text-xs text-cyan-500/50 mb-2 px-2 font-bold tracking-wider uppercase font-mono">
                  <span>id</span><span>name</span><span>country</span>
                </div>
                {customers.map(c => (
                  <div key={c.id} className="grid grid-cols-3 text-xs bg-card p-2.5 rounded-lg border border-border/50 mb-1.5 text-slate-300 shadow-sm transition-colors hover:bg-white/5">
                    <span className="text-slate-500">{c.id}</span><span>{c.name}</span><span className="text-slate-400">{c.country}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-center font-bold text-emerald-400 text-xs tracking-widest uppercase font-mono">Orders (Right Table)</h4>
              <div className="bg-background border border-emerald-500/20 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)] rounded-xl p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-3 text-xs text-emerald-500/50 mb-2 px-2 font-bold tracking-wider uppercase font-mono">
                  <span>id</span><span>customer_id</span><span>total</span>
                </div>
                {orders.map(o => (
                  <div key={o.id} className="grid grid-cols-3 text-xs bg-card p-2.5 rounded-lg border border-border/50 mb-1.5 text-slate-300 shadow-sm transition-colors hover:bg-white/5">
                    <span className="text-slate-500">{o.id}</span><span className="text-slate-400">{o.customer_id}</span><span className="font-mono text-emerald-300/80">${o.total}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Table - Spans full width below */}
            <div className="md:col-span-2 flex flex-col gap-4 mt-2">
              <h4 className="text-center font-bold text-indigo-400 text-xs tracking-widest uppercase font-mono">Join Result ({results.length} Rows)</h4>
              <div className="bg-background border border-indigo-500/20 shadow-[0_10px_30px_rgba(99,102,241,0.05)] rounded-xl p-5 max-h-[400px] overflow-y-auto custom-scrollbar relative">
                <div className="grid grid-cols-5 text-xs text-indigo-500/50 mb-3 px-2 font-bold text-center tracking-wider uppercase font-mono sticky top-0 bg-background pb-2 z-10 border-b border-indigo-500/10">
                  <span>c.id</span><span>c.name</span><span>o.customer_id</span><span>o.id</span><span>o.total</span>
                </div>
                <AnimatePresence mode="popLayout">
                  {results.map((r, i) => {
                    const isLeftNull = r.id === 'NULL';
                    const isRightNull = r.o_id === 'NULL';
                    
                    return (
                      <motion.div 
                        key={`${r.id}-${r.o_id}-${i}`}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.4, delay: i * 0.02, type: "spring", bounce: 0.2 }}
                        className={cn(
                          "grid grid-cols-5 text-xs p-3 rounded-lg border mb-1.5 text-center items-center shadow-sm transition-all duration-300",
                          r.match ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-100 shadow-[0_0_10px_rgba(99,102,241,0.1)]" : 
                            (isLeftNull ? "bg-emerald-500/5 border-emerald-500/20 text-slate-400 grayscale" : "bg-cyan-500/5 border-cyan-500/20 text-slate-400 grayscale")
                        )}
                      >
                        <span className={isLeftNull ? "italic text-slate-600 font-mono" : "text-cyan-200"}>{r.id}</span>
                        <span className={isLeftNull ? "italic text-slate-600 font-mono" : "text-cyan-100"}>{r.name}</span>
                        
                        <div className="flex items-center justify-center gap-2 relative">
                          {r.match ? (
                            <span className="w-16 h-px bg-indigo-500/50 block shadow-[0_0_5px_rgba(99,102,241,0.8)]" />
                          ) : (
                            <span className="w-16 h-px bg-white/10 border-dashed block" />
                          )}
                        </div>

                        <span className={isRightNull ? "italic text-slate-600 font-mono" : "text-emerald-200"}>{r.o_id}</span>
                        <span className={isRightNull ? "italic text-slate-600 font-mono" : "font-mono text-emerald-300"}>
                          {isRightNull ? 'NULL' : `$${r.total}`}
                        </span>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
