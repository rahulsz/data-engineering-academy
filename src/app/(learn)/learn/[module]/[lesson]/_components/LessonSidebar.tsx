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
    <div className="w-full lg:w-80 shrink-0 border-l border-surface-deep/50 bg-black/20 p-6 order-1 lg:order-2 sticky top-0 h-auto lg:h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex items-center gap-2 text-white font-bold mb-6 font-display border-b border-surface-deep/50 pb-4">
        <List className="w-5 h-5 text-indigo-400" />
        {moduleTitle}
      </div>
      
      <div className="space-y-1">
        {lessons.map((l: any, i: number) => {
          const isActive = l._id === activeLessonId;
          const isDone = !loading && progress.some((p: any) => p.lessonId === l._id && p.status === "completed");
          
          return (
            <Link key={l._id} href={`/learn/${moduleSlug}/${l.slug}`}>
              <div className={cn(
                "px-3 py-2.5 rounded-lg text-sm flex gap-3 transition-colors",
                isActive ? "bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/20" : 
                isDone ? "text-slate-400 hover:bg-surface-deep/30" : 
                "text-slate-500 hover:text-slate-300 hover:bg-surface-deep/30"
              )}>
                <span className="font-mono text-xs opacity-50 mt-0.5 w-4">{i + 1}.</span>
                <span className="line-clamp-2 leading-snug">{l.title}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
