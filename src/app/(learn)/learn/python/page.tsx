import { getModuleContent } from "@/features/learn/actions";
import { notFound } from "next/navigation";
import { Terminal, FileCode2, Table2, Layers, Cpu, Code2 } from "lucide-react";
import { ModuleSyllabus } from "../_components/ModuleSyllabus";

export const revalidate = 0;

export default async function PythonModulePage() {
  const data = await getModuleContent("python");
  
  if (!data || !data.module) {
    notFound();
  }
  const { module, lessons } = data;
  
  const sections = [
    {
      id: "foundations",
      title: "Python Foundations",
      description: "Master the absolute basics of Python programming for data engineering.",
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
      lessonSlugs: ["python-intro", "variables-types", "control-flow", "functions", "data-structures"]
    },
    {
      id: "file-data",
      title: "File & Data Handling",
      description: "Learn to read, write, and process data files and APIs.",
      icon: <FileCode2 className="w-5 h-5 text-indigo-400" />,
      lessonSlugs: ["file-io", "error-handling", "working-with-apis", "regex-basics"]
    },
    {
      id: "pandas",
      title: "Pandas Fundamentals",
      description: "Introduction to DataFrames, filtering, and data cleaning.",
      icon: <Table2 className="w-5 h-5 text-fuchsia-400" />,
      lessonSlugs: ["pandas-intro", "pandas-selection", "pandas-groupby", "pandas-merge", "pandas-cleaning"]
    },
    {
      id: "patterns",
      title: "Data Processing Patterns",
      description: "Advanced concepts like generators, decorators, and context managers.",
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      lessonSlugs: ["list-comprehensions", "decorators", "context-managers"]
    },
    {
      id: "data-engineering",
      title: "Python for Data Engineering",
      description: "Building ETL scripts, parallel processing, and interview prep.",
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
      lessonSlugs: ["python-etl", "multiprocessing", "python-interview"]
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Full Bleed Hero Header */}
      <div className="relative w-full border-b border-border bg-background/50 overflow-hidden">
        {/* Subtle gradient mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-background to-background pointer-events-none" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Icon Box */}
            <div className="w-28 h-28 shrink-0 bg-background/80 border border-border rounded-3xl flex items-center justify-center p-5 shadow-2xl backdrop-blur-xl relative group">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" 
                alt="Python" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(56,189,248,0.3)] relative z-10"
              />
            </div>
            
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-6">
                Masterclass
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tight mb-6 leading-[1.1]">
                Python for Data Engineering
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0 mb-8 font-light tracking-tight">
                Master Python fundamentals, Pandas, and data processing patterns used in real data pipelines.
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-border shadow-sm text-foreground/80">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  20 Lessons
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-border shadow-sm text-foreground/80">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  ~7 Hours
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-border shadow-sm text-foreground/80">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Beginner Friendly
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 w-full">
        <ModuleSyllabus moduleSlug="python" lessons={lessons} sections={sections} />
      </div>
    </div>
  );
}
