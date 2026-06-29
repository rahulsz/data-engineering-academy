"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, PlayCircle, BookOpen, Code2, MonitorPlay, Clock, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function ModuleSyllabus({ moduleSlug, lessons, sections }: { moduleSlug: string, lessons: any[], sections: any[] }) {
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  // Helper to find a lesson by slug in the fetched lessons array
  const getLessonInfo = (slug: string) => {
    return lessons.find((l: any) => l.slug === slug);
  };

  return (
    <>
      <div className="space-y-12">
        {sections.map((section, sIdx) => (
          <motion.section 
            key={section.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-border flex items-center justify-center shadow-inner">
                {section.icon}
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                  <span className="text-slate-500 font-mono text-lg">{String(sIdx + 1).padStart(2, '0')}</span>
                  {section.title}
                </h2>
                <p className="text-slate-400 text-sm mt-1">{section.description}</p>
              </div>
            </div>

            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-3"
            >
              {section.lessonSlugs.map((slug: string, lIdx: number) => {
                const lesson = getLessonInfo(slug);
                // If lesson isn't seeded yet, show a disabled placeholder
                if (!lesson) {
                  return (
                    <motion.div key={slug} variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-white/5 opacity-50 cursor-not-allowed">
                      <div className="flex items-center gap-4 mb-3 sm:mb-0">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <h4 className="text-slate-400 font-medium">{slug.replace(/-/g, ' ')}</h4>
                          <p className="text-xs text-slate-500">Coming soon</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Mock status for now, since we aren't passing user progress into this client component yet
                // In a real app, we'd pass a progress map or fetch it via SWR
                const status: string = "not_started"; // "completed", "in_progress", "not_started"
                
                return (
                  <motion.div 
                    key={lesson._id} 
                    variants={item}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-black/20 backdrop-blur-sm hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-inner transition-colors ${
                        status === "completed" 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : status === "in_progress"
                          ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                          : "bg-white/5 border-border text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30"
                      }`}>
                        {status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : lesson.type === "interactive" || lesson.type === "exercise" ? (
                          <Code2 className="w-5 h-5" />
                        ) : lesson.type === "video" ? (
                          <MonitorPlay className="w-5 h-5" />
                        ) : (
                          <BookOpen className="w-5 h-5" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className={`font-semibold ${status === "completed" ? "text-slate-300" : "text-white group-hover:text-cyan-300 transition-colors"}`}>
                            {lesson.title}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-500/20">
                            +{lesson.xpReward} XP
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-slate-400">
                          <span>{lesson.duration} min</span>
                          {lesson.hasVisualizer && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-600" />
                              <span className="text-indigo-400 flex items-center gap-1"><PlayCircle className="w-3 h-3" /> Visualizer</span>
                            </>
                          )}
                          {lesson.hasPlayground && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-600" />
                              <span className="text-cyan-400 flex items-center gap-1"><Code2 className="w-3 h-3" /> Playground</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLesson(lesson);
                      }}
                      className={`w-full sm:w-auto font-semibold transition-all ${
                        status === "completed" 
                          ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" 
                          : status === "in_progress"
                          ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500 hover:text-white"
                          : "border-white/20 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10"
                      }`}
                    >
                      {status === "completed" ? "Review" : status === "in_progress" ? "Resume" : "Select"}
                    </Button>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>
        ))}
      </div>

      <AnimatePresence>
        {selectedLesson && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
            onClick={() => setSelectedLesson(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Glowing accent at the top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500" />
              
              <button 
                onClick={() => setSelectedLesson(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-border text-slate-400 text-xs font-bold tracking-wider uppercase mb-6">
                  Mission Briefing
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-4">
                  {selectedLesson.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  {selectedLesson.type === 'interactive' 
                    ? "Master this concept through interactive visualizers and hands-on coding exercises."
                    : selectedLesson.type === 'exercise'
                    ? "Test your skills with a challenging scenario. No visualizers, just pure code."
                    : "Dive deep into the foundational theory required to master data engineering concepts."
                  }
                </p>

                <div className="flex items-center gap-6 mb-8 p-4 rounded-xl bg-white/5 border border-border/50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Duration</span>
                      <span className="text-sm font-semibold text-white">{selectedLesson.duration} Min</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Reward</span>
                      <span className="text-sm font-semibold text-white">{selectedLesson.xpReward} XP</span>
                    </div>
                  </div>
                </div>

                <Link href={`/learn/${moduleSlug}/${selectedLesson.slug}`} className="block">
                  <button className="w-full py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] flex items-center justify-center gap-2">
                    Start Mission
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
