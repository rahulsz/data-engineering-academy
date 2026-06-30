import { getModuleContent } from "@/features/learn/actions";
import { notFound } from "next/navigation";
import { Zap, Server, TableProperties, Network, Rocket, Database } from "lucide-react";
import { ModuleSyllabus } from "../_components/ModuleSyllabus";

export const revalidate = 0;

export default async function SparkModulePage() {
  const data = await getModuleContent("spark");
  
  if (!data || !data.module) {
    notFound();
  }
  const { module, lessons } = data;
  
  const sections = [
    {
      id: "fundamentals",
      title: "Spark Fundamentals",
      description: "Understand the core architecture and what makes Spark so fast.",
      icon: <Server className="w-5 h-5 text-amber-400" />,
      lessonSlugs: ["spark-intro", "spark-architecture", "rdd-basics", "spark-setup"]
    },
    {
      id: "dataframes",
      title: "DataFrames & SQL",
      description: "Process structured data using Spark DataFrames and Spark SQL.",
      icon: <TableProperties className="w-5 h-5 text-blue-400" />,
      lessonSlugs: ["spark-dataframes", "dataframe-operations", "spark-sql", "spark-joins", "spark-aggregations"]
    },
    {
      id: "internals",
      title: "Spark Internals",
      description: "Dive deep into the execution model: Lazy evaluation, DAGs, and partitioning.",
      icon: <Network className="w-5 h-5 text-indigo-400" />,
      lessonSlugs: ["lazy-evaluation", "spark-dag", "partitioning", "shuffling"]
    },
    {
      id: "performance",
      title: "Performance & Optimization",
      description: "Tuning strategies, caching, and handling data skew.",
      icon: <Rocket className="w-5 h-5 text-emerald-400" />,
      lessonSlugs: ["spark-caching", "broadcast-joins", "data-skew", "spark-tuning"]
    },
    {
      id: "data-engineering",
      title: "Spark for Data Engineering",
      description: "Streaming, Airflow orchestration, and file formats.",
      icon: <Database className="w-5 h-5 text-fuchsia-400" />,
      lessonSlugs: ["spark-streaming-intro", "spark-with-airflow", "reading-writing-formats"]
    },
    {
      id: "practice",
      title: "Spark Practice",
      description: "Build an ETL project and master the interview.",
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      lessonSlugs: ["spark-etl-project", "spark-interview"]
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Full Bleed Hero Header */}
      <div className="relative w-full border-b border-border bg-background/50 overflow-hidden">
        {/* Subtle gradient mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-background to-background pointer-events-none" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Icon Box */}
            <div className="w-28 h-28 shrink-0 bg-background/80 border border-border rounded-3xl flex items-center justify-center p-5 shadow-2xl backdrop-blur-xl relative group">
              <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachespark/apachespark-original.svg" 
                alt="Apache Spark" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] relative z-10"
              />
            </div>
            
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">
                Masterclass
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tight mb-6 leading-[1.1]">
                Apache Spark
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0 mb-8 font-light tracking-tight">
                Learn distributed data processing with Apache Spark — from RDDs to production pipelines.
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-border shadow-sm text-foreground/80">
                  <TableProperties className="w-4 h-4 text-amber-400" />
                  22 Lessons
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-border shadow-sm text-foreground/80">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  ~9 Hours
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-border shadow-sm text-foreground/80">
                  <Network className="w-4 h-4 text-emerald-400" />
                  Intermediate
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12 w-full">
        <ModuleSyllabus moduleSlug="spark" lessons={lessons} sections={sections} />
      </div>
    </div>
  );
}
