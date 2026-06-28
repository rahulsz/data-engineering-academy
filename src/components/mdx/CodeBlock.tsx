"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language: string;
  children: React.ReactNode;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeString = React.Children.toArray(children).join("");

  const onCopy = async () => {
    await navigator.clipboard.writeText(codeString.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 rounded-xl border border-surface-deep/50 bg-[#0d1117] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-surface-deep/30 bg-surface-deep/10">
        <span className="text-xs font-mono text-slate-400 select-none uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={onCopy}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-surface-deep/50 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-[14px] font-mono leading-relaxed text-slate-300">
        {/* We use pre here; syntax highlighting is applied via rehype plugins */}
        <pre>
          <code className={cn("language-" + language)}>{children}</code>
        </pre>
      </div>
    </div>
  );
}
