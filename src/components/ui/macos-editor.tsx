import React from "react";
import { cn } from "@/lib/utils";
import { Database, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MacOSEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  codeSnippet?: React.ReactNode;
  fileName?: string;
  outputRows?: number;
  executionTimeMs?: number;
}

export const MacOSEditor = React.forwardRef<HTMLDivElement, MacOSEditorProps>(
  ({ className, codeSnippet, fileName = "src/queries/revenue.sql", outputRows = 3, executionTimeMs = 12, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn("relative rounded-2xl border border-border bg-background/80 backdrop-blur-3xl shadow-2xl overflow-hidden ring-1 ring-white/5", className)}
        {...props}
      >
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-white/[0.02]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>
          <div className="text-[12px] font-mono font-medium text-muted-foreground/60 flex items-center gap-2">
            <Database className="w-3 h-3" />
            {fileName}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm">Running</div>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex text-[13px] font-mono leading-[1.7]">
          {/* Line Numbers */}
          <div className="px-4 py-5 text-right text-muted-foreground/30 select-none border-r border-border/50 bg-white/[0.01]">
            1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7
          </div>
          
          {/* Code Content */}
          <div className="px-5 py-5 text-zinc-300 w-full overflow-x-auto">
            {codeSnippet || (
              <>
                <div>
                  <span className="text-[#c678dd]">WITH</span> monthly_revenue <span className="text-[#c678dd]">AS</span> (
                </div>
                <div className="pl-4">
                  <span className="text-[#c678dd]">SELECT</span>
                </div>
                <div className="pl-8">
                  <span className="text-[#56b6c2]">DATE_TRUNC</span>(<span className="text-[#98c379]">'month'</span>, created_at) <span className="text-[#c678dd]">AS</span> month,
                </div>
                <div className="pl-8">
                  <span className="text-[#56b6c2]">SUM</span>(amount) <span className="text-[#c678dd]">AS</span> total_revenue
                </div>
                <div className="pl-4">
                  <span className="text-[#c678dd]">FROM</span> transactions
                </div>
                <div className="pl-4">
                  <span className="text-[#c678dd]">GROUP BY</span> <span className="text-[#d19a66]">1</span>
                </div>
                <div>)</div>
              </>
            )}
          </div>
        </div>
        
        {/* Editor Footer / Output */}
        <div className="border-t border-border/50 bg-[#0d0d0d] px-4 py-3 flex items-center justify-between">
          <div className="text-[12px] text-muted-foreground/50 font-mono">
            Output ({outputRows} rows) — <span className="text-green-400/80">Success in {executionTimeMs}ms</span>
          </div>
          <Button size="sm" className="h-6 text-[11px] px-3 bg-primary/20 text-primary hover:bg-primary/30">
            <Play className="w-3 h-3 mr-1" /> Execute
          </Button>
        </div>
      </div>
    );
  }
)
MacOSEditor.displayName = "MacOSEditor"
