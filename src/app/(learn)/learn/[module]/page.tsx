import { getStaticModules, getModuleContent } from "@/features/learn/actions";
import { notFound } from "next/navigation";
import { BookOpen, Clock } from "lucide-react";
import { ModuleTimeline } from "./_components/ModuleTimeline";

export async function generateStaticParams() {
  const modules = await getStaticModules();
  return modules.map((m: any) => ({
    module: m.slug,
  }));
}

export default async function ModulePage({ params }: { params: { module: string } }) {
  const data = await getModuleContent(params.module);
  
  if (!data || !data.module) {
    notFound();
  }

  const { module, lessons } = data;

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

      {/* Roadmap Timeline (Client Component for User Progress) */}
      <ModuleTimeline moduleSlug={params.module} lessons={lessons} />
    </div>
  );
}
