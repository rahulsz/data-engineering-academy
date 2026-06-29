import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  interactive?: boolean;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, active = false, interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-background/60 backdrop-blur-md border border-border rounded-lg relative overflow-hidden",
          interactive && "transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]",
          active && "border-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]",
          className
        )}
        {...props}
      >
        {/* Subtle top highlight for glass effect */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        {children}
      </div>
    )
  }
)
GlassPanel.displayName = "GlassPanel"
