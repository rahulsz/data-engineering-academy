"use client";

import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Database, BarChart2, Code2, Trophy, Users, BookOpen,
  CheckCircle2, XCircle, ChevronDown, Terminal, SquareTerminal, Cloud, Server, Zap, Network, Archive, Activity, Box, Workflow, Repeat, Shield, Layers, ArrowRight, Play
} from "lucide-react";
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30">
      <Navbar />

      <main className="flex-1">
        
        {/* 1. HERO SECTION (Vercel / Linear Tier) */}
        <section className="relative pt-40 pb-32 md:pt-60 md:pb-48 px-4 overflow-hidden border-b border-border/20">
          {/* Glowing Dotted Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
          
          <div className="container mx-auto max-w-7xl relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
            
            {/* Left: Copy */}
            <motion.div 
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="flex flex-col items-start text-left relative z-20"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-[13px] font-medium shadow-sm cursor-pointer hover:bg-white/[0.05] transition-colors">
                <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                <span className="text-muted-foreground tracking-tight">DataEngineering.Academy v1.0 is now live</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground ml-1" />
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-5xl md:text-[80px] font-bold tracking-tighter mb-8 leading-[1.05]">
                Master Data <br /> Engineering. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">For Free.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground/80 mb-10 max-w-lg leading-relaxed font-light tracking-tight">
                Interactive SQL playgrounds, animated visualizers, real-world projects, and gamified learning — everything you need to become a data engineer.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                {/* Shimmer Button */}
                <Link href="/sign-up" className="w-full sm:w-auto group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-400 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                  <Button size="lg" className="relative w-full sm:w-auto text-[15px] font-medium h-12 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 overflow-hidden">
                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                      <div className="relative h-full w-8 bg-white/20" />
                    </div>
                    Start Learning Free
                  </Button>
                </Link>
                
                <Link href="/playground/sql" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-[15px] font-medium h-12 px-8 rounded-full border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all">
                    Explore Playground
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: MacOS Editor Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block w-full"
            >
              <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl overflow-hidden ring-1 ring-white/5">
                
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                  </div>
                  <div className="text-[12px] font-medium text-muted-foreground/60 flex items-center gap-2">
                    <Database className="w-3 h-3" />
                    src/queries/revenue.sql
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm">Running</div>
                  </div>
                </div>

                {/* Editor Body */}
                <div className="flex text-[13px] font-mono leading-[1.7]">
                  {/* Line Numbers */}
                  <div className="px-4 py-5 text-right text-muted-foreground/30 select-none border-r border-white/5 bg-white/[0.01]">
                    1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7
                  </div>
                  
                  {/* Code Content */}
                  <div className="px-5 py-5 text-zinc-300 w-full overflow-x-auto">
                    <div>
                      <span className="text-[#c678dd]">WITH</span> monthly_revenue <span className="text-[#c678dd]">AS</span> (
                    </div>
                    <div className="pl-4">
                      <span className="text-[#c678dd]">SELECT</span>
                    </div>
                    <div className="pl-8">
                      <span className="text-[#56b6c2]">DATE_TRUNC</span>(<span className="text-[#98c379]">&apos;month&apos;</span>, created_at) <span className="text-[#c678dd]">AS</span> month,
                    </div>
                    <div className="pl-8">
                      <span className="text-[#56b6c2]">SUM</span>(amount) <span className="text-[#c678dd]">AS</span> total_revenue
                    </div>
                    <div className="pl-4">
                      <span className="text-[#c678dd]">FROM</span> transactions
                    </div>
                    <div className="pl-4">
                      <span className="text-[#c678dd]">GROUP BY</span> <span className="text-[#d19a66]">1</span>
                    </div>
                    <div>)</div>
                  </div>
                </div>
                
                {/* Editor Footer / Output */}
                <div className="border-t border-white/5 bg-[#0d0d0d] px-4 py-3 flex items-center justify-between">
                  <div className="text-[12px] text-muted-foreground/50 font-mono">
                    Output (3 rows) — <span className="text-green-400/80">Success in 12ms</span>
                  </div>
                  <Button size="sm" className="h-6 text-[11px] px-3 bg-primary/20 text-primary hover:bg-primary/30">
                    <Play className="w-3 h-3 mr-1" /> Execute
                  </Button>
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -z-10"
              />
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"
              />
            </motion.div>

          </div>
        </section>

        {/* 2. FEATURES SECTION */}
        <section className="py-32 relative">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <motion.h2 {...scrollReveal} className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Everything you need to succeed.
            </motion.h2>
            <motion.p {...scrollReveal} className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-20 tracking-tight font-light">
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
                  <SpotlightCard className="group h-full p-8 flex flex-col justify-start">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 relative z-10">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xl mb-3 tracking-tight relative z-10">{f.title}</h3>
                    <p className="text-muted-foreground text-base leading-relaxed tracking-tight font-light relative z-10">{f.desc}</p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. ROADMAPS SECTION */}
        <section className="py-32 overflow-hidden relative border-t border-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
            <motion.h2 {...scrollReveal} className="text-4xl md:text-6xl font-bold tracking-tighter mb-24 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Your path to becoming a Data Engineer.
            </motion.h2>
            
            <div className="relative max-w-5xl mx-auto">
              {/* Animated Dashed Line */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 hidden md:block">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="0" x2="100%" y2="0" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" className="text-white/10" />
                </svg>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                {["SQL", "Python", "Linux", "Spark", "Kafka", "Airflow"].map((tech, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                    key={i} 
                    className="bg-black/60 border border-white/10 text-zinc-300 font-semibold px-8 py-4 rounded-full shadow-2xl backdrop-blur-2xl relative group cursor-default hover:border-white/20 transition-colors"
                  >
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <span className="relative tracking-tight">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. MODULES SECTION */}
        <section className="py-32">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-20 relative z-10">
              <motion.h2 {...scrollReveal} className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                Complete Curriculum.
              </motion.h2>
              <motion.p {...scrollReveal} className="text-lg md:text-xl text-muted-foreground/80 font-light tracking-tight max-w-2xl mx-auto">
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
                  <SpotlightCard className="h-full p-6 flex flex-col cursor-pointer group">
                    <div className="mb-5 w-10 h-10 flex items-center justify-center text-primary/80 group-hover:text-primary group-hover:scale-110 transition-transform duration-500">
                      {svgIcon ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={svgIcon} alt={moduleTitles[i]} className="w-full h-full object-contain drop-shadow-md" />
                      ) : (
                        <FallbackIcon className="w-8 h-8" />
                      )}
                    </div>
                    <h3 className="font-semibold text-base mb-2 leading-tight tracking-tight flex-1 group-hover:text-primary transition-colors">
                      {moduleTitles[i]}
                    </h3>
                    <div className="flex items-center justify-between mt-4 text-xs font-medium tracking-wide">
                      <span className="text-muted-foreground/70">{10 + (i % 5)*2} Lessons</span>
                      <span className="text-primary/70 group-hover:text-primary transition-colors">Start &rarr;</span>
                    </div>
                  </SpotlightCard>
                </motion.div>
              )})}
            </div>
          </div>
        </section>

        {/* 5. STATS SECTION */}
        <section className="py-32 relative border-t border-white/5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
          
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { end: 15, suffix: "+", label: "Modules" },
                { end: 500, suffix: "+", label: "Practice Questions" },
                { end: 7, suffix: "", label: "Real Projects" },
                { end: 100, suffix: "%", label: "Free Forever" }
              ].map((stat, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  key={i}
                  className="flex flex-col items-center justify-center p-6 rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-md"
                >
                  <div className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="text-muted-foreground/80 font-medium tracking-widest text-xs uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. WHY SECTION */}
        <section className="py-32 border-t border-white/5">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.h2 {...scrollReveal} className="text-4xl md:text-6xl font-bold tracking-tighter mb-20 text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              A Better Way to Learn.
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <motion.div 
                {...scrollReveal}
                className="border border-white/5 rounded-[2rem] p-10 bg-white/[0.02] text-muted-foreground relative overflow-hidden flex flex-col justify-center"
              >
                <div className="absolute top-0 right-0 bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Legacy Platforms</div>
                <h3 className="text-2xl font-semibold mb-8 text-white/50 tracking-tight">The Old Way</h3>
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
                className="border border-primary/30 rounded-[2rem] p-10 bg-black/40 backdrop-blur-2xl shadow-[0_0_80px_rgba(59,130,246,0.15)] relative overflow-hidden ring-1 ring-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 bg-primary/20 border-b border-l border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl backdrop-blur-md">DE.Academy</div>
                <h3 className="text-2xl font-bold mb-8 tracking-tight text-white relative z-10">The New Standard</h3>
                <ul className="space-y-6 relative z-10">
                  <li className="flex items-start gap-4 text-lg font-light tracking-tight text-zinc-300"><CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" /> Hands-on, interactive coding environments.</li>
                  <li className="flex items-start gap-4 text-lg font-light tracking-tight text-zinc-300"><CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" /> 100% free access to all core curriculum materials.</li>
                  <li className="flex items-start gap-4 text-lg font-light tracking-tight text-zinc-300"><CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" /> Zero setup. Code runs securely in your browser.</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 7. TESTIMONIALS SECTION */}
        <section className="py-32 border-t border-white/5 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <motion.h2 {...scrollReveal} className="text-4xl md:text-6xl font-bold tracking-tighter mb-20 text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
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
                  className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md flex flex-col h-full hover:bg-white/[0.04] transition-colors"
                >
                  <div className="text-zinc-400 font-light tracking-tight leading-relaxed mb-8 flex-1">&quot;{test.text}&quot;</div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold border border-primary/30">
                      {test.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm tracking-tight text-zinc-200">{test.name}</div>
                      <div className="text-xs text-muted-foreground">{test.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FAQ SECTION */}
        <section className="py-32 border-t border-white/5">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.h2 {...scrollReveal} className="text-4xl md:text-6xl font-bold tracking-tighter mb-16 text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Frequently Asked Questions.
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border-t border-white/10"
            >
              {[
                { q: "Is this really free?", a: "Yes, forever. All core curriculum, interactive playgrounds, and progress tracking are 100% free." },
                { q: "Do I need prior experience?", a: "No. Our curriculum starts from absolute scratch (basic SELECT statements) and scales up to advanced distributed systems." },
                { q: "What is the SQL Playground?", a: "It's an in-browser, WASM-powered PostgreSQL database. You can write real SQL, create tables, and manipulate data without installing anything on your computer." },
                { q: "How does XP work?", a: "We gamified the learning process. You earn XP for completing lessons, passing quizzes, and maintaining daily streaks." },
                { q: "Can I use this for interview prep?", a: "Absolutely. We have a dedicated section for data engineering interview questions covering SQL, Python, and System Design." },
                { q: "How is this different from other platforms?", a: "We focus heavily on 'learning by doing'. Instead of passive video lectures, you learn through interactive visualizers and immediate coding feedback." }
              ].map((faq, i) => (
                <Collapsible.Root key={i} className="border-b border-white/10 group">
                  <Collapsible.Trigger className="flex justify-between items-center w-full py-8 font-medium text-left hover:text-white transition-colors text-lg tracking-tight text-zinc-300">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform duration-300" />
                  </Collapsible.Trigger>
                  <Collapsible.Content className="pb-8 text-muted-foreground text-base font-light tracking-tight leading-relaxed overflow-hidden">
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
