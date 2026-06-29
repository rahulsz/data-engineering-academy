"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserProgressForModule } from "@/features/learn/actions";

export function LessonSidebar({ moduleTitle, moduleSlug, lessons, activeLessonId }: { moduleTitle: string, moduleSlug: string, lessons: any[], activeLessonId: string }) {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProgressForModule(moduleSlug).then(p => {
      setProgress(p);
      setLoading(false);
    });
  }, [moduleSlug]);

  return (
    <div className="w-full lg:w-80 shrink-0 border-l border-border/50 bg-card/50 p-6 order-1 lg:order-2 sticky top-0 h-auto lg:h-[calc(100vh-4rem)] overflow-y-auto backdrop-blur-md">
      <div className="flex items-center gap-3 text-white font-bold mb-8 font-display border-b border-border/50 pb-4 text-lg tracking-tight">
        <List className="w-5 h-5 text-cyan-400" />
        {moduleTitle}
      </div>
      
      <div className="space-y-1">
        {lessons.map((l: any, i: number) => {
          const isActive = l._id === activeLessonId;
          const isDone = !loading && progress.some((p: any) => p.lessonId === l._id && p.status === "completed");
          
          return (
            <Link key={l._id} href={`/learn/${moduleSlug}/${l.slug}`}>
              <div className={cn(
                "px-3 py-2.5 rounded-lg text-sm flex gap-3 transition-colors font-sans",
                isActive ? "bg-cyan-500/10 text-cyan-300 font-medium border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.05)]" : 
                isDone ? "text-slate-400 hover:bg-white/5" : 
                "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              )}>
                {/* Neon Bullet Point instead of Number */}
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 transition-colors",
                  isActive ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" : 
                  isDone ? "bg-slate-600" : "bg-slate-700 group-hover:bg-slate-500"
                )} />
                <span className="line-clamp-2 leading-snug">{l.title}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
