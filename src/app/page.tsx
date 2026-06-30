"use client";

import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MacOSEditor } from "@/components/ui/macos-editor";
import { GlassPanel } from "@/components/ui/glass-panel";
import { PipelineSimulation } from "@/components/mdx/visualizers/PipelineSimulation";
import { 
  Database, BarChart2, Code2, Trophy, Users, BookOpen,
  CheckCircle2, XCircle, ChevronDown, Terminal, SquareTerminal, Cloud, Server, Zap, Network, Archive, Activity, Box, Workflow, Repeat, Shield, Layers, ArrowRight, Play
} from "lucide-react";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { BlogCard } from "@/features/blog/components/BlogCard";
import Link from "next/link";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useRef, useState, useEffect } from "react";

// --- ANIMATION VARIANTS ---
const fadeUp = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.7 } }
};

const staggerContainer = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const scrollReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  viewport: { once: true, margin: "-100px" }
};

// --- HELPER COMPONENT FOR STATS COUNTER ---
function AnimatedCounter({ end, suffix = "" }: { end: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const FEATURED_PROJECTS = [
  {
    slug: "netflix-etl-pipeline",
    title: "Netflix-Style Content ETL Pipeline",
    difficulty: "intermediate",
    stack: ["Python", "Pandas", "PostgreSQL", "Airflow", "Docker"],
    estimatedHours: 6,
    coverImage: "🎬",
    description: "Build an ETL pipeline that ingests raw viewing data, cleans and transforms it, and loads it into a PostgreSQL warehouse."
  },
  {
    slug: "spotify-data-pipeline",
    title: "Spotify-Style Listening Analytics Pipeline",
    difficulty: "intermediate",
    stack: ["Python", "Apache Kafka", "Spark Streaming", "MongoDB"],
    estimatedHours: 8,
    coverImage: "🎧",
    description: "Simulate a real-time listening event pipeline with Spark Structured Streaming aggregating listens per artist."
  },
  {
    slug: "sales-analytics-dashboard",
    title: "End-to-End Sales Analytics Dashboard",
    difficulty: "beginner",
    stack: ["Python", "SQL", "Pandas", "Plotly"],
    estimatedHours: 4,
    coverImage: "📊",
    description: "A beginner-friendly project — ingest sales CSV data, run SQL transformations, build a Streamlit dashboard."
  }
];

const FEATURED_BLOGS = [
  {
    slug: "why-sql-still-matters-2026",
    title: "Why SQL Is Still the #1 Skill for Data Engineers in 2026",
    excerpt: "The enduring relevance of SQL despite new tools, real job posting stats, and how SQL skills transfer.",
    category: "career",
    date: "2026-06-25",
    readingTime: "5 min read",
    coverImage: "🗄️"
  },
  {
    slug: "spark-vs-pandas",
    title: "Spark vs Pandas: When Do You Actually Need Distributed Computing?",
    excerpt: "Practical guidance on the data size threshold, common misconceptions, and the migration path.",
    category: "spark",
    date: "2026-06-20",
    readingTime: "6 min read",
    coverImage: "⚡"
  },
  {
    slug: "airflow-best-practices",
    title: "5 Airflow DAG Best Practices for Production Pipelines",
    excerpt: "Idempotency, avoiding XCom for large data, retry strategies, and sensor patterns.",
    category: "tutorials",
    date: "2026-06-15",
    readingTime: "4 min read",
    coverImage: "🛠️"
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30">
      <Navbar />

      <main className="flex-1">
        
        {/* 1. HERO SECTION */}
        <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-4 overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/15 blur-[150px] rounded-full -z-10 pointer-events-none" />
          <div className="absolute top-[200px] right-[10%] w-[300px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
          
          <div className="mx-auto max-w-[1200px] relative z-10">
            
            {/* Copy */}
            <motion.div 
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="flex flex-col items-center text-center relative z-20 mb-14"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-xl text-[13px] font-medium cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-all duration-300">
                <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(76,215,246,0.8)] animate-pulse"></span>
                <span className="text-primary/90 tracking-tight">DataEngineering.Academy v1.0 is now live</span>
                <ArrowRight className="w-3 h-3 text-primary/70 ml-1" />
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[80px] font-extrabold tracking-[-0.04em] mb-6 leading-[1.05]">
                Master Data Engineering.{" "}
                <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-400">For Free.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed font-light">
                The most comprehensive open-source curriculum for modern data stack mastery. From ingestion to insights, taught with industry-grade tools.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/sign-up" className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-full blur-md opacity-40 group-hover:opacity-80 transition duration-500"></div>
                  <Button size="lg" className="relative text-[15px] font-bold h-12 px-8 rounded-full bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(76,215,246,0.3)] transition-all">
                    Start Learning Free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link href="/playground/sql">
                  <Button size="lg" variant="outline" className="text-[15px] font-medium h-12 px-8 rounded-full border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 backdrop-blur-md transition-all">
                    Explore Playground
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Simulation + Editor */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden md:flex items-start justify-center gap-6 w-full mb-16"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary/8 blur-[100px] rounded-full -z-10" />
              
              <div className="w-[280px] shrink-0 transition-transform duration-500 hover:scale-[1.02]">
                <PipelineSimulation />
              </div>

              <div className="flex-1 max-w-[640px] transition-transform duration-500 hover:scale-[1.02] shadow-[0_0_60px_rgba(76,215,246,0.08)]">
                <MacOSEditor />
              </div>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl"
            >
              {[
                { end: 15, suffix: "+", label: "Modules" },
                { end: 500, suffix: "+", label: "Practice Questions" },
                { end: 7, suffix: "", label: "Real Projects" },
                { end: 100, suffix: "%", label: "Free Forever" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center py-8 px-4 bg-white/[0.01] hover:bg-white/[0.04] transition-colors">
                  <div className="text-3xl md:text-4xl font-bold tracking-tighter mb-1 text-white">
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="text-zinc-500 font-medium tracking-widest text-[10px] uppercase">{stat.label}</div>
                </div>
              ))}
            </motion.div>

          </div>
        </section>

        {/* 2. FEATURES SECTION */}
        <section className="py-24 md:py-32 relative border-t border-white/[0.05]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] -z-20" />
          <div className="container mx-auto px-4 max-w-[1200px] text-center">
            <motion.h2 {...scrollReveal} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 pb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Everything you need to succeed.
            </motion.h2>
            <motion.p {...scrollReveal} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-20 tracking-tight font-light">
              The most comprehensive, interactive environment built specifically for data engineering.
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {[
                { icon: Database, title: "Interactive SQL Playground", desc: "Write and execute complex queries directly in your browser against isolated DB instances." },
                { icon: BarChart2, title: "Animated Visualizers", desc: "Watch how JOINs, window functions, and aggregations physically manipulate data step-by-step." },
                { icon: Code2, title: "Python Environment", desc: "Seamlessly execute Python and PySpark code in built-in, Jupyter-style notebooks." },
                { icon: Trophy, title: "XP & Achievements", desc: "Gamified learning. Earn XP, maintain streaks, and unlock achievements as you progress." },
                { icon: BookOpen, title: "15 Learning Modules", desc: "Structured curriculum taking you from zero to advanced distributed systems engineering." },
                { icon: Users, title: "Community Forum", desc: "Stuck on a problem? Discuss architectures and queries with thousands of other learners." }
              ].map((f, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  key={i} 
                  className="h-full"
                >
                  <GlassPanel interactive className="group h-full p-8 flex flex-col justify-start rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-xl hover:border-white/[0.15] hover:bg-white/[0.02] transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-105 group-hover:bg-primary/10 group-hover:border-primary/20 duration-300 shadow-lg">
                      <f.icon className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors drop-shadow-[0_0_8px_rgba(76,215,246,0.6)]" />
                    </div>
                    <h3 className="font-semibold text-xl mb-3 tracking-tight text-zinc-100 relative z-10">{f.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed tracking-wide font-light relative z-10">{f.desc}</p>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. ROADMAPS SECTION */}
        <section className="py-24 md:py-32 overflow-hidden relative border-t border-white/[0.05]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
          <div className="container mx-auto px-4 max-w-[1200px] text-center relative z-10">
            <motion.h2 {...scrollReveal} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-24 pb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Your path to becoming a Data Engineer.
            </motion.h2>
            
            <div className="relative max-w-5xl mx-auto">
              {/* Animated Dashed Line */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 hidden md:block">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="0" x2="100%" y2="0" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" className="text-white/[0.15]" />
                </svg>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 relative z-10">
                {["SQL", "Python", "Linux", "Spark", "Kafka", "Airflow"].map((tech, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                    key={i} 
                    className="bg-black/60 border border-white/[0.1] text-zinc-300 font-semibold px-8 py-3 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl relative group cursor-default hover:border-primary/40 hover:text-white transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <span className="relative tracking-tight">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. MODULES SECTION */}
        <section className="py-24 md:py-32 border-t border-white/[0.05] relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] -z-20" />
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="text-center mb-20 relative z-10">
              <motion.h2 {...scrollReveal} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 pb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                Complete Curriculum.
              </motion.h2>
              <motion.p {...scrollReveal} className="text-lg md:text-xl text-zinc-400 font-light tracking-tight max-w-2xl mx-auto">
                15 structured modules covering every aspect of modern data engineering.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {Array.from({ length: 15 }).map((_, i) => {
                const moduleTitles = ["SQL Fundamentals", "Python Basics", "Linux & Bash", "Cloud Storage (S3)", "PostgreSQL Deep Dive", "Apache Spark", "Data Modeling", "Data Warehousing", "Kafka Streaming", "Docker for DE", "Airflow Orchestration", "dbt Transformations", "Security & Governance", "Advanced Architecture", "Capstone Project"];
                const moduleIcons = [
                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg',
                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachespark/apachespark-original.svg',
                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg',
                  'https://upload.wikimedia.org/wikipedia/commons/f/ff/Snowflake_Logo.svg',
                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg',
                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apacheairflow/apacheairflow-original.svg',
                  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/d3js/d3js-original.svg',
                  null, // Security
                  null, // Architecture
                  null  // Capstone
                ];
                const FallbackIcons = [Database, Terminal, SquareTerminal, Cloud, Server, Zap, Network, Archive, Activity, Box, Workflow, Repeat, Shield, Layers, Trophy];
                const FallbackIcon = FallbackIcons[i];
                const svgIcon = moduleIcons[i];
                
                return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 5) * 0.1 }}
                  key={i} 
                  className="h-full"
                >
                  <GlassPanel interactive className="h-full p-6 flex flex-col cursor-pointer group border border-white/[0.08] bg-black/40 backdrop-blur-xl hover:border-white/[0.15] hover:bg-white/[0.02] transition-all duration-300 rounded-2xl">
                    <div className="mb-5 w-10 h-10 flex items-center justify-center text-primary/80 group-hover:text-primary group-hover:scale-110 transition-transform duration-500">
                      {svgIcon ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={svgIcon} alt={moduleTitles[i]} className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(76,215,246,0.3)]" />
                      ) : (
                        <FallbackIcon className="w-8 h-8" />
                      )}
                    </div>
                    <h3 className="font-semibold text-base mb-2 leading-tight tracking-tight flex-1 text-zinc-100 group-hover:text-primary transition-colors">
                      {moduleTitles[i]}
                    </h3>
                    <div className="flex items-center justify-between mt-4 text-xs font-medium tracking-wide border-t border-white/[0.05] pt-4">
                      <span className="text-zinc-500 font-mono bg-white/[0.03] px-2 py-0.5 rounded-sm">{10 + (i % 5)*2} Lessons</span>
                      <span className="text-primary/70 group-hover:text-primary transition-colors font-mono">Start &rarr;</span>
                    </div>
                  </GlassPanel>
                </motion.div>
              )})}
            </div>
          </div>
        </section>

        {/* 4.5 PROJECTS TEASER SECTION */}
        <section className="py-24 md:py-32 border-t border-white/[0.05] relative">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 relative z-10">
              <div>
                <motion.h2 {...scrollReveal} className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 pb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                  Build Real Projects.
                </motion.h2>
                <motion.p {...scrollReveal} className="text-lg text-zinc-400 font-light tracking-tight max-w-xl">
                  Apply what you've learned to real-world data engineering scenarios.
                </motion.p>
              </div>
              <motion.div {...scrollReveal} className="mt-6 md:mt-0">
                <Link href="/projects">
                  <Button variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary">
                    View All Projects <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_PROJECTS.map((project, i) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4.6 BLOG TEASER SECTION */}
        <section className="py-24 md:py-32 border-t border-white/[0.05] relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,215,246,0.03),transparent_70%)] -z-10 pointer-events-none" />
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 relative z-10">
              <div>
                <motion.h2 {...scrollReveal} className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 pb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                  Latest from the Blog.
                </motion.h2>
                <motion.p {...scrollReveal} className="text-lg text-zinc-400 font-light tracking-tight max-w-xl">
                  Insights on data engineering, career advice, and tutorials.
                </motion.p>
              </div>
              <motion.div {...scrollReveal} className="mt-6 md:mt-0">
                <Link href="/blog">
                  <Button variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary">
                    Read More <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_BLOGS.map((blog, i) => (
                <motion.div
                  key={blog.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="h-full"
                >
                  <BlogCard post={blog as any} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. WHY SECTION */}
        <section className="py-24 md:py-32 border-t border-white/[0.05]">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <motion.h2 {...scrollReveal} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-20 pb-2 text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              A Better Way to Learn.
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <motion.div 
                {...scrollReveal}
                className="border border-white/[0.05] rounded-3xl p-10 bg-white/[0.01] text-zinc-400 relative overflow-hidden flex flex-col justify-center"
              >
                <div className="absolute top-0 right-0 bg-white/[0.05] text-zinc-500 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">Legacy Platforms</div>
                <h3 className="text-2xl font-semibold mb-8 text-zinc-500 tracking-tight">The Old Way</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 text-lg font-light tracking-tight opacity-50"><XCircle className="w-6 h-6 shrink-0 mt-0.5" /> Passive video lectures that don&apos;t test your knowledge.</li>
                  <li className="flex items-start gap-4 text-lg font-light tracking-tight opacity-50"><XCircle className="w-6 h-6 shrink-0 mt-0.5" /> Expensive recurring monthly subscriptions.</li>
                  <li className="flex items-start gap-4 text-lg font-light tracking-tight opacity-50"><XCircle className="w-6 h-6 shrink-0 mt-0.5" /> Requires local setup of complex databases and tools.</li>
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="h-full"
              >
                <GlassPanel className="p-10 shadow-[0_0_80px_rgba(76,215,246,0.1)] ring-1 ring-white/[0.08] rounded-3xl bg-black/40 backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none rounded-3xl" />
                  <div className="absolute top-0 right-0 bg-primary/10 border-b border-l border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl backdrop-blur-md">DE.Academy</div>
                  <h3 className="text-2xl font-bold mb-8 tracking-tight text-white relative z-10">The New Standard</h3>
                  <ul className="space-y-6 relative z-10">
                    <li className="flex items-start gap-4 text-lg font-light tracking-tight text-zinc-300"><CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-primary drop-shadow-[0_0_8px_rgba(76,215,246,0.8)]" /> Hands-on, interactive coding environments.</li>
                    <li className="flex items-start gap-4 text-lg font-light tracking-tight text-zinc-300"><CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-primary drop-shadow-[0_0_8px_rgba(76,215,246,0.8)]" /> 100% free access to all core curriculum materials.</li>
                    <li className="flex items-start gap-4 text-lg font-light tracking-tight text-zinc-300"><CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-primary drop-shadow-[0_0_8px_rgba(76,215,246,0.8)]" /> Zero setup. Code runs securely in your browser.</li>
                  </ul>
                </GlassPanel>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 6. TESTIMONIALS SECTION */}
        <section className="py-24 md:py-32 border-t border-white/[0.05] relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,215,246,0.05),transparent_70%)] -z-10 pointer-events-none" />
          <div className="container mx-auto px-4 max-w-[1200px] relative z-10">
            <motion.h2 {...scrollReveal} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-20 pb-2 text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Trusted by professionals.
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Rahul S.", role: "Data Engineer at Infosys", text: "The SQL visualizers finally made complex JOINs click for me. Incredible platform." },
                { name: "Sarah M.", role: "Data Analyst", text: "I went from Excel to writing PySpark pipelines in just 3 months using this curriculum." },
                { name: "David K.", role: "Backend Developer", text: "The architectural breakdowns in the advanced modules are absolute gold for interviews." },
                { name: "Priya T.", role: "Student", text: "I can't believe this is free. The interactive Python environments are so much better than video lectures." }
              ].map((test, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  key={i} 
                  className="h-full"
                >
                  <GlassPanel interactive className="p-8 flex flex-col h-full rounded-2xl border border-white/[0.05] bg-black/40 backdrop-blur-xl">
                    <div className="text-zinc-400 font-light tracking-tight leading-relaxed mb-8 flex-1">&quot;{test.text}&quot;</div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20 text-sm">
                        {test.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm tracking-tight text-zinc-200">{test.name}</div>
                        <div className="text-xs text-zinc-500 font-medium">{test.role}</div>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. FAQ SECTION */}
        <section className="py-24 md:py-32 border-t border-white/[0.05]">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.h2 {...scrollReveal} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-16 pb-2 text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Frequently Asked Questions.
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border-t border-white/[0.05]"
            >
              {[
                { q: "Is this really free?", a: "Yes, forever. All core curriculum, interactive playgrounds, and progress tracking are 100% free." },
                { q: "Do I need prior experience?", a: "No. Our curriculum starts from absolute scratch (basic SELECT statements) and scales up to advanced distributed systems." },
                { q: "What is the SQL Playground?", a: "It's an in-browser, WASM-powered PostgreSQL database. You can write real SQL, create tables, and manipulate data without installing anything on your computer." },
                { q: "How does XP work?", a: "We gamified the learning process. You earn XP for completing lessons, passing quizzes, and maintaining daily streaks." },
                { q: "Can I use this for interview prep?", a: "Absolutely. We have a dedicated section for data engineering interview questions covering SQL, Python, and System Design." },
                { q: "How is this different from other platforms?", a: "We focus heavily on 'learning by doing'. Instead of passive video lectures, you learn through interactive visualizers and immediate coding feedback." }
              ].map((faq, i) => (
                <Collapsible.Root key={i} className="border-b border-white/[0.05] group">
                  <Collapsible.Trigger className="flex justify-between items-center w-full py-8 font-medium text-left hover:text-white transition-colors text-lg tracking-tight text-zinc-300">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-zinc-600 group-hover:text-primary group-data-[state=open]:rotate-180 transition-all duration-300" />
                  </Collapsible.Trigger>
                  <Collapsible.Content className="pb-8 text-zinc-400 text-base font-light tracking-tight leading-relaxed overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.a}
                    </motion.div>
                  </Collapsible.Content>
                </Collapsible.Root>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
