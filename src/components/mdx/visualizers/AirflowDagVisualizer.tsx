'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  NodeMouseHandler
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Activity, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const CustomNode = ({ data }: { data: any }) => {
  const isSelected = data.selected
  const statusColors = {
    success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
    running: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
    pending: 'border-slate-500/50 bg-slate-500/10 text-slate-400'
  }
  const colorClass = statusColors[data.status as keyof typeof statusColors]

  return (
    <div className={cn(
      "px-4 py-3 shadow-xl rounded-xl border-2 w-48 relative transition-all cursor-pointer",
      colorClass,
      isSelected ? "ring-2 ring-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105" : "hover:scale-105 hover:border-border/500"
    )}>
      
      {data.target && <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-white/50 border-none" />}
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-1.5 rounded-md bg-black/40">
          {data.status === 'success' && <CheckCircle2 className="w-4 h-4" />}
          {data.status === 'running' && <Activity className="w-4 h-4 animate-pulse" />}
          {data.status === 'pending' && <Clock className="w-4 h-4" />}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-white">{data.label}</span>
          <span className="text-[10px] uppercase tracking-wider">{data.status}</span>
        </div>
      </div>
      
      {data.source && <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-white/50 border-none" />}
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

const initialNodes = [
  { id: 'extract', type: 'custom', position: { x: 250, y: 50 }, data: { label: 'extract_data', status: 'success', source: true, target: false } },
  { id: 'transform_users', type: 'custom', position: { x: 100, y: 180 }, data: { label: 'transform_users', status: 'success', source: true, target: true } },
  { id: 'transform_orders', type: 'custom', position: { x: 400, y: 180 }, data: { label: 'transform_orders', status: 'running', source: true, target: true } },
  { id: 'load_dw', type: 'custom', position: { x: 250, y: 310 }, data: { label: 'load_warehouse', status: 'pending', source: false, target: true } },
]

const initialEdges = [
  { id: 'e-ext-tu', source: 'extract', target: 'transform_users', style: { stroke: '#10b981', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
  { id: 'e-ext-to', source: 'extract', target: 'transform_orders', style: { stroke: '#10b981', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
  { id: 'e-tu-load', source: 'transform_users', target: 'load_dw', style: { stroke: '#10b981', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
  { id: 'e-to-load', source: 'transform_orders', target: 'load_dw', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
]

const fakeLogs: Record<string, string[]> = {
  extract: [
    "[2024-03-15 10:00:01] INFO - Starting task 'extract_data'",
    "[2024-03-15 10:00:02] INFO - Connecting to PostgreSQL source db_prod",
    "[2024-03-15 10:01:45] INFO - Extracted 1.2M rows from users table",
    "[2024-03-15 10:05:12] INFO - Extracted 4.5M rows from orders table",
    "[2024-03-15 10:05:15] INFO - Uploading raw data to S3 bucket...",
    "[2024-03-15 10:06:00] INFO - Task completed successfully."
  ],
  transform_users: [
    "[2024-03-15 10:06:05] INFO - Starting task 'transform_users'",
    "[2024-03-15 10:06:10] INFO - Downloading raw users data from S3",
    "[2024-03-15 10:06:15] INFO - Applying PII masking to email column",
    "[2024-03-15 10:06:45] INFO - Imputing missing age values",
    "[2024-03-15 10:07:00] INFO - Writing clean data to staging",
    "[2024-03-15 10:07:05] INFO - Task completed successfully."
  ],
  transform_orders: [
    "[2024-03-15 10:06:05] INFO - Starting task 'transform_orders'",
    "[2024-03-15 10:06:10] INFO - Downloading raw orders data from S3",
    "[2024-03-15 10:07:30] INFO - Joining with product catalog",
    "[2024-03-15 10:09:12] INFO - Calculating line_item totals...",
    "[2024-03-15 10:10:00] WARN - 45 orders found with null currency, defaulting to USD",
    "Loading... executing heavy join operation..."
  ],
  load_dw: [
    "Task is in 'upstream_failed' or 'pending' state.",
    "Waiting for 'transform_orders' to complete..."
  ]
}

export function AirflowDagVisualizer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNodeId(node.id)
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, selected: n.id === node.id } })))
  }, [setNodes])

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => { setIsMounted(true) }, [])
  if (!isMounted) return <div className="h-[500px] bg-black/40 rounded-xl my-6 border border-border" />

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border border-border my-6 bg-black relative flex flex-col md:flex-row">
      
      {/* Left: DAG Graph */}
      <div className="flex-1 relative border-r border-border">
        <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur border border-border p-3 rounded-lg pointer-events-none">
          <h3 className="text-white font-bold text-sm mb-1">Airflow DAG</h3>
          <p className="text-xs text-white/50 max-w-[200px]">Directed Acyclic Graph defining task dependencies. Click a node to view logs.</p>
        </div>
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="rgba(255, 255, 255, 0.05)" gap={16} size={1} />
          <Controls className="!bg-[#0d1117] !border-border !fill-white" />
        </ReactFlow>
      </div>

      {/* Right: Log Viewer */}
      <div className="w-full md:w-[350px] bg-[#0d1117] flex flex-col h-[250px] md:h-full">
        <div className="p-4 border-b border-border bg-black/20 font-bold text-sm text-white/80 flex items-center justify-between">
          <span>Task Logs</span>
          {selectedNodeId && <span className="bg-white/10 px-2 py-1 rounded text-xs font-mono">{selectedNodeId}</span>}
        </div>
        <div className="p-4 font-mono text-[10px] sm:text-xs leading-loose text-white/70 overflow-y-auto flex-1 flex flex-col gap-1">
          {!selectedNodeId ? (
            <div className="text-white/30 italic text-center mt-10">Click on a task node to view its execution logs.</div>
          ) : (
            fakeLogs[selectedNodeId]?.map((log, i) => (
              <div key={i} className={cn(
                "break-words",
                log.includes('ERROR') ? "text-red-400 font-bold" : 
                log.includes('WARN') ? "text-yellow-400" : 
                log.includes('INFO') ? "text-white/80" : "text-white/50"
              )}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
