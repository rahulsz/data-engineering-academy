"use client";

import { motion } from "framer-motion";
import { Database, Zap, HardDrive, FileJson, Server } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const nodes = [
  { id: "postgres", label: "PostgreSQL", type: "source", icon: Database, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  { id: "kafka", label: "Kafka", type: "stream", icon: Zap, color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
  { id: "spark", label: "Spark Engine", type: "transform", icon: Server, color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" },
  { id: "s3", label: "S3 Data Lake", type: "storage", icon: FileJson, color: "text-green-400", border: "border-green-500/30", bg: "bg-green-500/10" },
  { id: "snowflake", label: "Snowflake", type: "warehouse", icon: HardDrive, color: "text-primary", border: "border-primary/30", bg: "bg-primary/10" },
];

export function PipelineSimulation({ className }: { className?: string }) {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % nodes.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("relative w-full max-w-sm p-4 bg-card/40 border border-border rounded-2xl backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]", className)}>
      <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-bl-xl rounded-tr-2xl border-b border-l border-primary/30">
        Live Simulation
      </div>

      <div className="flex flex-col gap-4 relative z-10 mt-4">
        {nodes.map((node, i) => {
          const isActive = activeNode === i;
          const isPast = activeNode > i;

          return (
            <div key={node.id} className="flex items-center gap-3 relative">
              {/* Connecting Line (Vertical) */}
              {i !== nodes.length - 1 && (
                <div className="absolute left-5 top-12 bottom-[-1rem] w-[2px] bg-border/50">
                  {/* Animated Data Packet */}
                  {(isActive || isPast) && (
                    <motion.div
                      initial={{ top: 0, opacity: 1 }}
                      animate={isActive ? { top: "100%", opacity: 0 } : { top: "100%", opacity: 0 }}
                      transition={{ duration: 1.5, ease: "linear", repeat: isActive ? Infinity : 0 }}
                      className="absolute left-1/2 -translate-x-1/2 w-[2px] h-6 bg-primary shadow-[0_0_10px_rgba(76,215,246,1)]"
                    />
                  )}
                </div>
              )}

              {/* Node Card */}
              <motion.div
                animate={{
                  scale: isActive ? 1.03 : 1,
                  boxShadow: isActive ? "0 0 20px rgba(76,215,246,0.2)" : "0 0 0px rgba(0,0,0,0)",
                }}
                className={cn(
                  "flex items-center gap-3 p-2.5 pr-4 w-full rounded-xl border bg-background/80 backdrop-blur-sm transition-all duration-300 z-10",
                  isActive ? `border-primary shadow-lg ring-1 ring-primary/50 ${node.bg}` : "border-border/50 text-muted-foreground"
                )}
              >
                <div className={cn("w-10 h-10 flex shrink-0 items-center justify-center rounded-lg border bg-background", isActive ? node.border : "border-border/50")}>
                  <node.icon className={cn("w-5 h-5", isActive ? node.color : "text-muted-foreground")} />
                </div>
                <div>
                  <div className={cn("text-xs font-bold uppercase tracking-widest", isActive ? "text-primary" : "text-muted-foreground/50")}>
                    {node.type}
                  </div>
                  <div className={cn("text-sm font-semibold", isActive ? "text-foreground" : "text-foreground/70")}>
                    {node.label}
                  </div>
                </div>
                
                {/* Active Pulse Indicator */}
                {isActive && (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 2], opacity: [1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute right-4 w-2 h-2 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
