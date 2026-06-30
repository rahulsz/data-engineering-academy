"use client";

import { motion } from "framer-motion";
import { ArrowDown, Database, FileJson, Server, LayoutTemplate, Activity } from "lucide-react";

export function ProjectArchitectureDiagram({ architectureText }: { architectureText: string }) {
  // Parse the text into boxes and arrows
  const lines = architectureText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const steps = lines.filter(l => l !== '↓');
  
  // Try to match icons based on keywords in the text
  const getIconForText = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('csv') || t.includes('json') || t.includes('parquet')) return <FileJson className="w-5 h-5" />;
    if (t.includes('database') || t.includes('sql') || t.includes('snowflake') || t.includes('postgres') || t.includes('mongodb')) return <Database className="w-5 h-5" />;
    if (t.includes('spark') || t.includes('python') || t.includes('script') || t.includes('consumer') || t.includes('producer')) return <Server className="w-5 h-5" />;
    if (t.includes('dashboard') || t.includes('streamlit') || t.includes('dbt')) return <LayoutTemplate className="w-5 h-5" />;
    if (t.includes('airflow') || t.includes('orchestrate')) return <Activity className="w-5 h-5" />;
    return <Server className="w-5 h-5" />; // default
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="py-8 w-full max-w-2xl mx-auto flex flex-col items-center">
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full flex flex-col items-center"
      >
        {steps.map((step, idx) => (
          <div key={idx} className="w-full flex flex-col items-center">
            <motion.div 
              variants={item}
              className="w-full bg-black/40 backdrop-blur-md border border-border/50 rounded-xl p-5 shadow-lg flex items-center gap-4 relative overflow-hidden group hover:border-cyan-500/50 hover:bg-white/5 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-12 h-12 shrink-0 rounded-lg bg-white/5 border border-border/50 flex items-center justify-center text-cyan-400">
                {getIconForText(step)}
              </div>
              
              <div className="flex-1 font-mono text-sm text-slate-300">
                {step}
              </div>
            </motion.div>

            {/* Arrow connecting to next box */}
            {idx < steps.length - 1 && (
              <motion.div 
                variants={item}
                className="py-4 text-cyan-500/50 flex flex-col items-center"
              >
                <div className="w-px h-8 bg-gradient-to-b from-cyan-500/50 to-transparent mb-1" />
                <ArrowDown className="w-5 h-5" />
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
