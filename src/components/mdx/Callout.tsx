import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, Lightbulb } from "lucide-react";

interface CalloutProps {
  type?: "info" | "warning" | "success" | "tip";
  title?: string;
  children: React.ReactNode;
}

const styles = {
  info: {
    container: "bg-blue-950/30 border-blue-500/30",
    icon: <Info className="w-5 h-5 text-blue-400 mt-0.5" />,
    title: "text-blue-300",
  },
  warning: {
    container: "bg-amber-950/30 border-amber-500/30",
    icon: <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />,
    title: "text-amber-300",
  },
  success: {
    container: "bg-emerald-950/30 border-emerald-500/30",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />,
    title: "text-emerald-300",
  },
  tip: {
    container: "bg-purple-950/30 border-purple-500/30",
    icon: <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5" />,
    title: "text-purple-300",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const style = styles[type];

  return (
    <div
      className={cn(
        "my-6 flex gap-4 rounded-xl border p-5 text-slate-200",
        style.container
      )}
    >
      <div className="shrink-0">{style.icon}</div>
      <div className="flex flex-col gap-1">
        {title && (
          <h4 className={cn("m-0 font-semibold font-display", style.title)}>
            {title}
          </h4>
        )}
        <div className="text-[15px] leading-relaxed [&>p:last-child]:mb-0 [&>p:first-child]:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
