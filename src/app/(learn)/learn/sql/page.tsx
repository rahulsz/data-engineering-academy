import { getModuleContent } from "@/features/learn/actions";
import { notFound } from "next/navigation";
import { BookOpen, Clock, Database, DatabaseZap, LayoutTemplate, Layers, GitMerge, Settings } from "lucide-react";
import { ModuleSyllabus } from "../_components/ModuleSyllabus";
import Image from "next/image";

export const revalidate = 0;

export default async function SqlModulePage() {
  const data = await getModuleContent("sql");
  
  if (!data || !data.module) {
    notFound();
  }
  const { module, lessons } = data;
  
  const sections = [
    {
      id: "foundations",
      title: "SQL Foundations",
      description: "Master the absolute basics of retrieving and filtering data.",
      icon: <Database className="w-5 h-5 text-cyan-400" />,
      lessonSlugs: ["intro", "select", "where", "order-limit", "distinct", "data-types"]
    },
    {
      id: "aggregations",
      title: "Aggregations & Grouping",
      description: "Learn how to summarize and aggregate datasets.",
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      lessonSlugs: ["aggregations", "group-by", "having", "nested-agg"]
    },
    {
      id: "joins",
      title: "Advanced JOINs",
      description: "Combine data from multiple tables.",
      icon: <GitMerge className="w-5 h-5 text-fuchsia-400" />,
      lessonSlugs: ["inner-join", "outer-join", "self-cross", "multi-join"]
    },
    {
      id: "subqueries",
      title: "Subqueries & CTEs",
      description: "Write modular and readable queries.",
      icon: <LayoutTemplate className="w-5 h-5 text-emerald-400" />,
      lessonSlugs: ["subqueries", "correlated", "exists", "cte"]
    },
    {
      id: "advanced",
      title: "Advanced SQL",
      description: "Perform complex analytical tasks with window functions.",
      icon: <DatabaseZap className="w-5 h-5 text-amber-400" />,
      lessonSlugs: ["window-rank", "window-lag", "views", "indexes"]
    },
    {
      id: "data-engineering",
      title: "Data Engineering with SQL",
      description: "Design schemas and optimize database performance.",
      icon: <Settings className="w-5 h-5 text-slate-400" />,
      lessonSlugs: ["sql-etl", "interview"]
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Full Bleed Hero Header */}
      <div className="relative w-full border-b border-border bg-background/50 overflow-hidden">
        {/* Subtle gradient mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        
        {/* Grid pattern overlay (fallback if grid.svg missing) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Icon Box */}
            <div className="w-28 h-28 shrink-0 bg-background/80 border border-border rounded-3xl flex items-center justify-center p-5 shadow-2xl backdrop-blur-xl relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg" 
                alt="SQL" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(76,215,246,0.3)] relative z-10"
              />
            </div>
            
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6">
                Masterclass
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tight mb-6 leading-[1.1]">
                Mastering SQL for Data Engineering
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0 mb-8 font-light tracking-tight">
                Go from writing simple SELECT statements to designing complex data warehouse schemas, utilizing window functions, and optimizing query performance.
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-border shadow-sm text-foreground/80">
                  <BookOpen className="w-4 h-4 text-primary" />
                  24 Lessons
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-border shadow-sm text-foreground/80">
                  <Clock className="w-4 h-4 text-secondary" />
                  8 Hours
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-border shadow-sm text-foreground/80">
                  <DatabaseZap className="w-4 h-4 text-amber-400" />
                  2,400 XP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 w-full">
        <ModuleSyllabus moduleSlug="sql" lessons={lessons} sections={sections} />
      </div>
    </div>
  );
}
