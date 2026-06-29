'use client';

import React, { Suspense } from "react";
import dynamic from 'next/dynamic';
import { PlaySquare, Construction } from "lucide-react";

const visualizers: Record<string, React.ComponentType> = {
  ExecutionOrder: dynamic(() => import('./visualizers/ExecutionOrderVisualizer').then(mod => mod.ExecutionOrderVisualizer), { ssr: false }),
  SelectVisualizer: dynamic(() => import('./visualizers/SelectVisualizer').then(mod => mod.SelectVisualizer), { ssr: false }),
  WhereVisualizer: dynamic(() => import('./visualizers/WhereVisualizer').then(mod => mod.WhereVisualizer), { ssr: false }),
  GroupByVisualizer: dynamic(() => import('./visualizers/GroupByVisualizer').then(mod => mod.GroupByVisualizer), { ssr: false }),
  HavingVisualizer: dynamic(() => import('./visualizers/HavingVisualizer').then(mod => mod.HavingVisualizer), { ssr: false }),
  JoinVisualizer: dynamic(() => import('./visualizers/JoinVisualizer').then(mod => mod.JoinVisualizer), { ssr: false }),
  SubqueryVisualizer: dynamic(() => import('./visualizers/SubqueryVisualizer').then(mod => mod.SubqueryVisualizer), { ssr: false }),
  CorrelatedSubqueryVisualizer: dynamic(() => import('./visualizers/CorrelatedSubqueryVisualizer').then(mod => mod.CorrelatedSubqueryVisualizer), { ssr: false }),
  WindowFunctionVisualizer: dynamic(() => import('./visualizers/WindowFunctionVisualizer').then(mod => mod.WindowFunctionVisualizer), { ssr: false }),
  CTEVisualizer: dynamic(() => import('./visualizers/CTEVisualizer').then(mod => mod.CTEVisualizer), { ssr: false }),
  EtlPipelineVisualizer: dynamic(() => import('./visualizers/EtlPipelineVisualizer').then(mod => mod.EtlPipelineVisualizer), { ssr: false }),
  SparkArchVisualizer: dynamic(() => import('./visualizers/SparkArchVisualizer').then(mod => mod.SparkArchVisualizer), { ssr: false }),
  KafkaArchVisualizer: dynamic(() => import('./visualizers/KafkaArchVisualizer').then(mod => mod.KafkaArchVisualizer), { ssr: false }),
  AirflowDagVisualizer: dynamic(() => import('./visualizers/AirflowDagVisualizer').then(mod => mod.AirflowDagVisualizer), { ssr: false }),
};

export function VisualizerEmbed({ name }: { name: string }) {
  const VisualizerComponent = visualizers[name];

  if (VisualizerComponent) {
    return (
      <div className="my-10 rounded-2xl overflow-hidden shadow-2xl">
        <Suspense fallback={
          <div className="h-[400px] animate-pulse bg-white/5 border border-border rounded-2xl flex items-center justify-center">
            <div className="text-white/30 flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
              <span className="text-sm font-medium">Loading Visualizer...</span>
            </div>
          </div>
        }>
          <VisualizerComponent />
        </Suspense>
      </div>
    );
  }

  // Fallback for missing or pending visualizers
  return (
    <div className="my-8 rounded-xl border border-indigo-500/30 bg-indigo-950/10 p-8 text-center flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="p-4 bg-indigo-500/20 rounded-2xl mb-4 relative z-10">
        <Construction className="w-8 h-8 text-indigo-400" />
      </div>
      <h4 className="text-lg font-display font-semibold text-white mb-2 relative z-10">
        Interactive Visualizer: {name}
      </h4>
      <p className="text-slate-400 max-w-md relative z-10 text-sm">
        This visualizer is currently under construction and will be available in the upcoming release.
      </p>
    </div>
  );
}
