import { getStaticModules, getModuleContent } from "@/features/learn/actions";
import { notFound } from "next/navigation";
import { BookOpen, Clock, Code2, Database, Layout, Layers, Box, Terminal } from "lucide-react";
import { ModuleSyllabus } from "../_components/ModuleSyllabus";

export async function generateStaticParams() {
  const modules = await getStaticModules();
  return modules.map((m: any) => ({
    module: m.slug,
  }));
}

// Map slugs to devicon paths
const getModuleIconUrl = (slug: string) => {
  const icons: Record<string, string> = {
    python: "python/python-original.svg",
    linux: "linux/linux-original.svg",
    git: "git/git-original.svg",
    "db-fundamentals": "postgresql/postgresql-original.svg",
    "data-warehousing": "amazonwebservices/amazonwebservices-original-wordmark.svg",
    etl: "apachekafka/apachekafka-original.svg",
    elt: "googlecloud/googlecloud-original.svg",
    spark: "apachespark/apachespark-original.svg",
    kafka: "apachekafka/apachekafka-original.svg",
    airflow: "python/python-original.svg",
    snowflake: "mysql/mysql-original.svg",
    "aws-de": "amazonwebservices/amazonwebservices-original-wordmark.svg",
    "azure-de": "azure/azure-original.svg",
    "gcp-de": "googlecloud/googlecloud-original.svg",
  };
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${icons[slug] || "python/python-original.svg"}`;
};

// Generate fake sections if they don't exist
const generateSections = (lessons: any[]) => {
  if (lessons.length === 0) return [];
  
  const sectionIcons = [
    <Box key="1" className="w-5 h-5 text-cyan-400" />, 
    <Layers key="2" className="w-5 h-5 text-indigo-400" />, 
    <Layout key="3" className="w-5 h-5 text-fuchsia-400" />, 
    <Database key="4" className="w-5 h-5 text-emerald-400" />,
    <Terminal key="5" className="w-5 h-5 text-amber-400" />
  ];

  const sections = [];
  const chunkSize = Math.ceil(lessons.length / Math.min(5, Math.max(1, Math.ceil(lessons.length / 4))));
  
  for (let i = 0; i < lessons.length; i += chunkSize) {
    const chunk = lessons.slice(i, i + chunkSize);
    const sectionIndex = Math.floor(i / chunkSize);
    
    sections.push({
      id: `section-${sectionIndex + 1}`,
      title: `Part ${sectionIndex + 1}: Core Concepts`,
      description: "Master the foundational skills for this module.",
      icon: sectionIcons[sectionIndex % sectionIcons.length],
      lessonSlugs: chunk.map(l => l.slug)
    });
  }
  
  return sections;
};

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleSlug } = await params;
  const data = await getModuleContent(moduleSlug);
  
  if (!data || !data.module) {
    notFound();
  }

  const { module, lessons } = data;
  const sections = generateSections(lessons);
  const iconUrl = getModuleIconUrl(moduleSlug);
  const totalXp = lessons.reduce((acc: number, lesson: any) => acc + (lesson.xpReward || 0), 0);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="mb-12 relative overflow-hidden rounded-3xl border border-border bg-black/40 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-24 h-24 shrink-0 bg-white/5 border border-border rounded-2xl flex items-center justify-center p-4 shadow-inner relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={iconUrl}
              alt={module.title} 
              className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider uppercase mb-4">
              {module.level || "Masterclass"}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
              {module.title}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
              {module.description}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-8 text-sm font-medium text-slate-300">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-border">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                {lessons.length} Lessons
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-border">
                <Clock className="w-4 h-4 text-indigo-400" />
                {module.estimatedHours || Math.ceil(module.estimatedMinutes / 60)} Hours
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-border">
                <Code2 className="w-4 h-4 text-amber-400" />
                {totalXp.toLocaleString()} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus Grid */}
      <ModuleSyllabus moduleSlug={moduleSlug} lessons={lessons} sections={sections} />
    </div>
  );
}
