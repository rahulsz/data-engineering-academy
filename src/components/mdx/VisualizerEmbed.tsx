import React from "react";
import { PlaySquare } from "lucide-react";

export function VisualizerEmbed({ name }: { name: string }) {
  return (
    <div className="my-8 rounded-xl border border-indigo-500/30 bg-indigo-950/10 p-8 text-center flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="p-4 bg-indigo-500/20 rounded-2xl mb-4 relative z-10">
        <PlaySquare className="w-8 h-8 text-indigo-400" />
      </div>
      <h4 className="text-lg font-display font-semibold text-white mb-2 relative z-10">
        Interactive Visualizer: {name}
      </h4>
      <p className="text-slate-400 max-w-md relative z-10">
        This interactive component will allow you to run code and visualize data pipelines in real-time. (Coming in Sprint 3)
      </p>
    </div>
  );
}
