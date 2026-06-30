import { getAllProjects } from "@/features/projects/actions";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { FolderGit2 } from "lucide-react";

export const revalidate = 3600; // Cache for 1 hour, since projects rarely change

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative w-full border-b border-border bg-background/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
              <FolderGit2 className="w-8 h-8" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight mb-4 leading-[1.1]">
              Hands-On Projects
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl font-light tracking-tight mb-8">
              Apply what you've learned to real-world data engineering scenarios. Build production-grade pipelines, data warehouses, and streaming applications.
            </p>

            {/* Filter Pills Placeholder (could be a Client Component if we wanted interactive filtering) */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20 cursor-pointer">All</span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-sm font-medium border border-border cursor-pointer transition-colors">Beginner</span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-sm font-medium border border-border cursor-pointer transition-colors">Intermediate</span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-sm font-medium border border-border cursor-pointer transition-colors">Advanced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 w-full">
        {projects.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No projects available yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project: any) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
