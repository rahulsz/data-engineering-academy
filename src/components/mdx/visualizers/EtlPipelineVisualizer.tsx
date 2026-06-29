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
import { Database, Server, Cog, Snowflake } from 'lucide-react'

// Custom node component for a more premium look
const CustomNode = ({ data }: { data: any }) => {
  return (
    <div className={`px-4 py-3 shadow-xl rounded-xl border-2 bg-[#0d1117] ${data.borderColor} w-48 text-center relative overflow-hidden group`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${data.bgGradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-white/50 border-none" />
      <div className="flex flex-col items-center justify-center gap-2 relative z-10">
        <div className={`p-2 rounded-lg bg-black/40 ${data.iconColor}`}>
          {data.icon}
        </div>
        <div>
          <div className="font-bold text-sm text-white/90">{data.label}</div>
          <div className="text-[10px] text-white/50 uppercase tracking-wider">{data.sublabel}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-white/50 border-none" />
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

const initialNodes = [
  { 
    id: '1', 
    type: 'custom', 
    position: { x: 50, y: 150 }, 
    data: { 
      label: 'PostgreSQL', 
      sublabel: 'Source Database', 
      icon: <Database className="w-5 h-5" />,
      borderColor: 'border-blue-500/50',
      bgGradient: 'from-blue-500 to-cyan-500',
      iconColor: 'text-blue-400'
    } 
  },
  { 
    id: '2', 
    type: 'custom', 
    position: { x: 300, y: 50 }, 
    data: { 
      label: 'Extract', 
      sublabel: 'Airflow Worker', 
      icon: <Server className="w-5 h-5" />,
      borderColor: 'border-pink-500/50',
      bgGradient: 'from-pink-500 to-rose-500',
      iconColor: 'text-pink-400'
    } 
  },
  { 
    id: '3', 
    type: 'custom', 
    position: { x: 550, y: 150 }, 
    data: { 
      label: 'Transform', 
      sublabel: 'Apache Spark', 
      icon: <Cog className="w-5 h-5 animate-[spin_4s_linear_infinite]" />,
      borderColor: 'border-orange-500/50',
      bgGradient: 'from-orange-500 to-amber-500',
      iconColor: 'text-orange-400'
    } 
  },
  { 
    id: '4', 
    type: 'custom', 
    position: { x: 800, y: 150 }, 
    data: { 
      label: 'Snowflake', 
      sublabel: 'Data Warehouse', 
      icon: <Snowflake className="w-5 h-5" />,
      borderColor: 'border-cyan-500/50',
      bgGradient: 'from-cyan-500 to-blue-500',
      iconColor: 'text-cyan-400'
    } 
  },
]

const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: true, 
    type: 'smoothstep',
    style: { stroke: '#ec4899', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' },
    label: 'Extracts raw data',
    labelStyle: { fill: '#fff', fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: '#0d1117', stroke: '#ec4899', strokeOpacity: 0.5 },
    labelBgPadding: [4, 2] as [number, number]
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    animated: true, 
    type: 'smoothstep',
    style: { stroke: '#f97316', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
    label: 'Passes to Spark',
    labelStyle: { fill: '#fff', fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: '#0d1117', stroke: '#f97316', strokeOpacity: 0.5 },
    labelBgPadding: [4, 2] as [number, number]
  },
  { 
    id: 'e3-4', 
    source: '3', 
    target: '4', 
    animated: true, 
    type: 'smoothstep',
    style: { stroke: '#06b6d4', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' },
    label: 'Loads clean data',
    labelStyle: { fill: '#fff', fontWeight: 500, fontSize: 10 },
    labelBgStyle: { fill: '#0d1117', stroke: '#06b6d4', strokeOpacity: 0.5 },
    labelBgPadding: [4, 2] as [number, number]
  },
]

export function EtlPipelineVisualizer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Hydration fix for React Flow
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => { setIsMounted(true) }, [])
  if (!isMounted) return <div className="h-[400px] bg-black/40 rounded-xl my-6 border border-border" />

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-border my-6 bg-black relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur border border-border p-3 rounded-lg pointer-events-none">
        <h3 className="text-white font-bold text-sm mb-1">Standard ETL Pipeline</h3>
        <p className="text-xs text-white/50 max-w-xs">Extract from OLTP, transform via distributed compute, and load into a columnar Data Warehouse.</p>
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
