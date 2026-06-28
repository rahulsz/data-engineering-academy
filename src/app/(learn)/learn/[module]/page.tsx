import { getModuleWithProgress } from "@/features/learn/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const revalidate = 0; // Dynamic for progress

export default async function ModulePage({ params }: { params: { module: string } }) {
  const data = await getModuleWithProgress(params.module);
  
  if (!data || !data.module) {
    notFound();
  }

  const { module, lessons, progress } = data;

  // Group lessons by some logic, or just display them linearly.
  // For the roadmap feel, let's render a timeline.
  
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12 border-b border-surface-deep/50 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-3xl">
            {module.icon}
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">
              {module.title}
            </h1>
            <p className="text-slate-400 mt-1">
              {module.description}
            </p>
          </div>
        </div>
        
        <div className="flex gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            {lessons.length} Lessons
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            {module.estimatedMinutes / 60} Hours
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-[39px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-surface-deep/50 before:to-transparent">
        {lessons.map((lesson: any, index: number) => {
          const isCompleted = progress.some((p: any) => p.lessonId === lesson._id && p.status === "completed");
          const isInProgress = progress.some((p: any) => p.lessonId === lesson._id && p.status === "in_progress");
          
          // Simple logic: if previous lesson is completed or it's the first lesson, it's unlocked.
          let isLocked = false;
          if (index > 0) {
            const prevLessonId = lessons[index - 1]._id;
            const prevCompleted = progress.some((p: any) => p.lessonId === prevLessonId && p.status === "completed");
            // Optional: enforce linear progression
            // isLocked = !prevCompleted; 
            // For now, let's keep all unlocked for easy testing, but style them differently.
            isLocked = false; 
          }

          const statusColor = isCompleted
            ? "bg-emerald-500 border-emerald-500 text-black"
            : isInProgress
            ? "bg-indigo-500 border-indigo-500 text-white"
            : "bg-surface-deep border-slate-600 text-slate-400";

          return (
            <div key={lesson._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              {/* Timeline marker */}
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#020617] absolute left-[-40px] md:left-1/2",
                statusColor
              )}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : 
                 isLocked ? <Lock className="w-3.5 h-3.5" /> : 
                 <span className="text-xs font-bold">{index + 1}</span>}
              </div>
              
              {/* Card */}
              <div className="w-full md:w-[calc(50%-2.5rem)]">
                <Link href={isLocked ? "#" : `/learn/${module.slug}/${lesson.slug}`} className={cn("block", isLocked && "cursor-not-allowed opacity-60")}>
                  <div className={cn(
                    "p-5 rounded-xl border bg-black/40 backdrop-blur-md transition-all duration-300",
                    isCompleted ? "border-emerald-500/30 hover:border-emerald-500/50" : 
                    isInProgress ? "border-indigo-500/50 hover:border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]" : 
                    "border-surface-deep/50 hover:border-slate-500/50"
                  )}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        isCompleted ? "text-emerald-400" : isInProgress ? "text-indigo-400" : "text-slate-500"
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
    </div>
  );
}
