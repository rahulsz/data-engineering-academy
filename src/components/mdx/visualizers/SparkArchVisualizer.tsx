'use client'

import React, { useState, useEffect } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Cpu, MonitorDot, Share2, Layers } from 'lucide-react'

const CustomNode = ({ data }: { data: any }) => {
  return (
    <div className={`px-4 py-4 shadow-xl rounded-xl border-2 bg-[#0d1117] ${data.borderColor} w-52 text-center relative overflow-hidden group`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${data.bgGradient} opacity-10`} />
      
      {data.target && <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-white/50 border-none" />}
      
      <div className="flex flex-col items-center justify-center gap-2 relative z-10">
        <div className={`p-2 rounded-lg bg-black/40 ${data.iconColor}`}>
          {data.icon}
        </div>
        <div>
          <div className="font-bold text-sm text-white/90">{data.label}</div>
          <div className="text-[10px] text-white/50 uppercase tracking-wider">{data.sublabel}</div>
        </div>
        {data.details && (
          <div className="text-[10px] text-white/40 mt-1 font-mono border-t border-border pt-2 w-full">
            {data.details}
          </div>
        )}
      </div>
      
      {data.source && <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-white/50 border-none" />}
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

const initialNodes = [
  { 
    id: 'driver', 
    type: 'custom', 
    position: { x: 300, y: 50 }, 
    data: { 
      label: 'Spark Driver', 
      sublabel: 'Master Node', 
      icon: <MonitorDot className="w-6 h-6" />,
      borderColor: 'border-orange-500/50',
      bgGradient: 'from-orange-500 to-amber-500',
      iconColor: 'text-orange-400',
      details: 'DAG Scheduler → Task Scheduler',
      source: true,
      target: false
    } 
  },
  { 
    id: 'cluster', 
    type: 'custom', 
    position: { x: 300, y: 220 }, 
    data: { 
      label: 'Cluster Manager', 
      sublabel: 'YARN / K8s / Standalone', 
      icon: <Share2 className="w-5 h-5" />,
      borderColor: 'border-slate-500/50',
      bgGradient: 'from-slate-500 to-slate-400',
      iconColor: 'text-slate-400',
      details: 'Resource Allocation',
      source: true,
      target: true
    } 
  },
  { 
    id: 'worker1', 
    type: 'custom', 
    position: { x: 100, y: 380 }, 
    data: { 
      label: 'Worker Node 1', 
      sublabel: 'Executor (Tasks)', 
      icon: <Cpu className="w-5 h-5" />,
      borderColor: 'border-cyan-500/50',
      bgGradient: 'from-cyan-500 to-blue-500',
      iconColor: 'text-cyan-400',
      details: 'Task 1 | Task 2 | Cache',
      source: false,
      target: true
    } 
  },
  { 
    id: 'worker2', 
    type: 'custom', 
    position: { x: 500, y: 380 }, 
    data: { 
      label: 'Worker Node 2', 
      sublabel: 'Executor (Tasks)', 
      icon: <Cpu className="w-5 h-5" />,
      borderColor: 'border-cyan-500/50',
      bgGradient: 'from-cyan-500 to-blue-500',
      iconColor: 'text-cyan-400',
      details: 'Task 3 | Task 4 | Cache',
      source: false,
      target: true
    } 
  },
]

const initialEdges = [
  { 
    id: 'e-driver-cluster', 
    source: 'driver', 
    target: 'cluster', 
    animated: true, 
    style: { stroke: '#f97316', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
    label: 'Requests Resources',
    labelStyle: { fill: '#fff', fontSize: 10 },
    labelBgStyle: { fill: '#0d1117', stroke: '#f97316', strokeOpacity: 0.5 },
    labelBgPadding: [4, 2] as [number, number]
  },
  { 
    id: 'e-cluster-w1', 
    source: 'cluster', 
    target: 'worker1', 
    animated: true, 
    style: { stroke: '#06b6d4', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' },
    label: 'Assigns Tasks',
    labelStyle: { fill: '#fff', fontSize: 10 },
    labelBgStyle: { fill: '#0d1117', stroke: '#06b6d4', strokeOpacity: 0.5 },
    labelBgPadding: [4, 2] as [number, number]
  },
  { 
    id: 'e-cluster-w2', 
    source: 'cluster', 
    target: 'worker2', 
    animated: true, 
    style: { stroke: '#06b6d4', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' },
    label: 'Assigns Tasks',
    labelStyle: { fill: '#fff', fontSize: 10 },
    labelBgStyle: { fill: '#0d1117', stroke: '#06b6d4', strokeOpacity: 0.5 },
    labelBgPadding: [4, 2] as [number, number]
  },
  { 
    id: 'e-w1-driver', 
    source: 'worker1', 
    target: 'driver', 
    animated: true, 
    type: 'step',
    style: { stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '5 5' },
    label: 'Status / Results',
    labelStyle: { fill: '#22c55e', fontSize: 9 },
    labelBgStyle: { fill: '#0d1117', stroke: '#22c55e', strokeOpacity: 0.2 },
  },
  { 
    id: 'e-w2-driver', 
    source: 'worker2', 
    target: 'driver', 
    animated: true,
    type: 'step', 
    style: { stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '5 5' },
    label: 'Status / Results',
    labelStyle: { fill: '#22c55e', fontSize: 9 },
    labelBgStyle: { fill: '#0d1117', stroke: '#22c55e', strokeOpacity: 0.2 },
  },
]

export function SparkArchVisualizer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => { setIsMounted(true) }, [])
  if (!isMounted) return <div className="h-[450px] bg-black/40 rounded-xl my-6 border border-border" />

  return (
    <div className="h-[450px] w-full rounded-xl overflow-hidden border border-border my-6 bg-black relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur border border-border p-3 rounded-lg pointer-events-none">
        <h3 className="text-white font-bold text-sm mb-1">Apache Spark Architecture</h3>
        <p className="text-xs text-white/50 max-w-xs">Driver program generates DAG, Cluster Manager provisions resources, and Executors run tasks in parallel.</p>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="rgba(255, 255, 255, 0.05)" gap={16} size={1} />
        <Controls className="!bg-[#0d1117] !border-border !fill-white" />
      </ReactFlow>
    </div>
  )
}
