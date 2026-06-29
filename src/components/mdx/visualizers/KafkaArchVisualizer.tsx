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
import { Send, Layers, MonitorSmartphone } from 'lucide-react'

const CustomNode = ({ data }: { data: any }) => {
  return (
    <div className={`px-4 py-4 shadow-xl rounded-xl border-2 bg-[#0d1117] ${data.borderColor} w-52 text-center relative overflow-hidden group`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${data.bgGradient} opacity-10`} />
      
      {data.target && <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-white/50 border-none" />}
      
      <div className="flex flex-col items-center justify-center gap-2 relative z-10">
        <div className={`p-2 rounded-lg bg-black/40 ${data.iconColor}`}>
          {data.icon}
        </div>
        <div>
          <div className="font-bold text-sm text-white/90">{data.label}</div>
          <div className="text-[10px] text-white/50 uppercase tracking-wider">{data.sublabel}</div>
        </div>
        {data.details && (
          <div className="flex flex-col gap-1 mt-2 border-t border-border pt-2 w-full">
            {data.details.map((det: string, i: number) => (
              <div key={i} className="bg-black/50 border border-border text-white/70 text-[10px] px-2 py-1 rounded font-mono flex items-center justify-between">
                <span>{det}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {data.source && <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-white/50 border-none" />}
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

const initialNodes = [
  { 
    id: 'producer1', 
    type: 'custom', 
    position: { x: 50, y: 50 }, 
    data: { 
      label: 'Payment Service', 
      sublabel: 'Producer', 
      icon: <Send className="w-5 h-5" />,
      borderColor: 'border-pink-500/50',
      bgGradient: 'from-pink-500 to-rose-500',
      iconColor: 'text-pink-400',
      source: true,
      target: false
    } 
  },
  { 
    id: 'producer2', 
    type: 'custom', 
    position: { x: 50, y: 220 }, 
    data: { 
      label: 'Inventory Service', 
      sublabel: 'Producer', 
      icon: <Send className="w-5 h-5" />,
      borderColor: 'border-pink-500/50',
      bgGradient: 'from-pink-500 to-rose-500',
      iconColor: 'text-pink-400',
      source: true,
      target: false
    } 
  },
  { 
    id: 'topic', 
    type: 'custom', 
    position: { x: 350, y: 135 }, 
    data: { 
      label: 'transactions_topic', 
      sublabel: 'Kafka Topic', 
      icon: <Layers className="w-6 h-6" />,
      borderColor: 'border-blue-500/50',
      bgGradient: 'from-blue-500 to-cyan-500',
      iconColor: 'text-blue-400',
      details: ['Partition 0', 'Partition 1', 'Partition 2'],
      source: true,
      target: true
    } 
  },
  { 
    id: 'consumerGroup', 
    type: 'custom', 
    position: { x: 650, y: 135 }, 
    data: { 
      label: 'Fraud Detection Group', 
      sublabel: 'Consumer Group', 
      icon: <MonitorSmartphone className="w-6 h-6" />,
      borderColor: 'border-emerald-500/50',
      bgGradient: 'from-emerald-500 to-green-500',
      iconColor: 'text-emerald-400',
      details: ['Consumer A (P0, P1)', 'Consumer B (P2)'],
      source: false,
      target: true
    } 
  },
]

const initialEdges = [
  { 
    id: 'e-p1-topic', 
    source: 'producer1', 
    target: 'topic', 
    animated: true, 
    type: 'smoothstep',
    style: { stroke: '#ec4899', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' },
    label: 'Publishes',
    labelStyle: { fill: '#fff', fontSize: 10 },
    labelBgStyle: { fill: '#0d1117', stroke: '#ec4899', strokeOpacity: 0.5 },
  },
  { 
    id: 'e-p2-topic', 
    source: 'producer2', 
    target: 'topic', 
    animated: true, 
    type: 'smoothstep',
    style: { stroke: '#ec4899', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' },
    label: 'Publishes',
    labelStyle: { fill: '#fff', fontSize: 10 },
    labelBgStyle: { fill: '#0d1117', stroke: '#ec4899', strokeOpacity: 0.5 },
  },
  { 
    id: 'e-topic-cg', 
    source: 'topic', 
    target: 'consumerGroup', 
    animated: true, 
    type: 'smoothstep',
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
    label: 'Subscribes',
    labelStyle: { fill: '#fff', fontSize: 10 },
    labelBgStyle: { fill: '#0d1117', stroke: '#3b82f6', strokeOpacity: 0.5 },
  },
]

export function KafkaArchVisualizer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => { setIsMounted(true) }, [])
  if (!isMounted) return <div className="h-[400px] bg-black/40 rounded-xl my-6 border border-border" />

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-border my-6 bg-black relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur border border-border p-3 rounded-lg pointer-events-none">
        <h3 className="text-white font-bold text-sm mb-1">Kafka Pub/Sub Architecture</h3>
        <p className="text-xs text-white/50 max-w-xs">Producers append messages to Topics (sharded by Partitions). Consumer Groups read in parallel.</p>
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
