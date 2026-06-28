"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserProgressForModule } from "@/features/learn/actions";

export function ModuleTimeline({ moduleSlug, lessons }: { moduleSlug: string, lessons: any[] }) {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProgressForModule(moduleSlug).then(p => {
      setProgress(p);
      setLoading(false);
    });
  }, [moduleSlug]);

  return (
    <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-[39px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-surface-deep/50 before:to-transparent">
      {lessons.map((lesson: any, index: number) => {
        const isCompleted = progress.some((p: any) => p.lessonId === lesson._id && p.status === "completed");
        const isInProgress = progress.some((p: any) => p.lessonId === lesson._id && p.status === "in_progress");
        
        let isLocked = false;
        // In the future, enforce locking here based on previous lesson completion.
        
        const statusColor = loading ? "bg-surface-deep border-slate-700 text-slate-500" :
          isCompleted
          ? "bg-emerald-500 border-emerald-500 text-black"
          : isInProgress
          ? "bg-indigo-500 border-indigo-500 text-white"
          : "bg-surface-deep border-slate-600 text-slate-400";

        return (
          <div key={lesson._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Timeline marker */}
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#020617] absolute left-[-40px] md:left-1/2 transition-colors duration-500",
              statusColor
            )}>
              {loading ? <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" /> :
               isCompleted ? <CheckCircle2 className="w-4 h-4" /> : 
               isLocked ? <Lock className="w-3.5 h-3.5" /> : 
               <span className="text-xs font-bold">{index + 1}</span>}
            </div>
            
            {/* Card */}
            <div className="w-full md:w-[calc(50%-2.5rem)]">
              <Link href={isLocked ? "#" : `/learn/${moduleSlug}/${lesson.slug}`} className={cn("block", isLocked && "cursor-not-allowed opacity-60")}>
                <div className={cn(
                  "p-5 rounded-xl border bg-black/40 backdrop-blur-md transition-all duration-300",
                  !loading && isCompleted ? "border-emerald-500/30 hover:border-emerald-500/50" : 
                  !loading && isInProgress ? "border-indigo-500/50 hover:border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]" : 
                  "border-surface-deep/50 hover:border-slate-500/50"
                )}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-wider transition-colors duration-300",
                      !loading && isCompleted ? "text-emerald-400" : !loading && isInProgress ? "text-indigo-400" : "text-slate-500"
                    )}>
                      {lesson.type}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {lesson.duration}m
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{lesson.title}</h3>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-deep/30">
                    <div className="flex gap-2">
                      <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md">
                        +{lesson.xpReward} XP
                      </span>
                    </div>
                    
                    {!isLocked && !isCompleted && (
                      <PlayCircle className="w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
