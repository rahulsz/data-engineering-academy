import Link from "next/link";
import { Clock, ArrowRight, BookMarked, Film, Headphones, Car, BarChart, Landmark, TrendingUp, Search, Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const emojiToIcon: Record<string, React.ReactNode> = {
  "🎬": <Film className="w-7 h-7 text-rose-400" />,
  "🎧": <Headphones className="w-7 h-7 text-emerald-400" />,
  "🚗": <Car className="w-7 h-7 text-amber-400" />,
  "📊": <BarChart className="w-7 h-7 text-cyan-400" />,
  "🏛️": <Landmark className="w-7 h-7 text-indigo-400" />,
  "📈": <TrendingUp className="w-7 h-7 text-blue-400" />,
  "🔍": <Search className="w-7 h-7 text-purple-400" />
};

export function ProjectCard({ project }: { project: any }) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "beginner": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "intermediate": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "advanced": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="group relative flex flex-col justify-between bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 overflow-hidden hover:bg-white/5 hover:border-cyan-500/50 transition-all duration-300">
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-border flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:border-cyan-500/30 transition-transform duration-300">
            {emojiToIcon[project.coverImage || ""] || <Folder className="w-7 h-7 text-slate-400" />}
          </div>
          <Badge variant="outline" className={`capitalize font-mono text-[10px] tracking-wider px-2 py-0.5 ${getDifficultyColor(project.difficulty)}`}>
            {project.difficulty}
          </Badge>
        </div>

        <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors relative z-10">
          {project.title}
        </h3>
        
        <p className="text-sm text-slate-400 line-clamp-2 mb-6 relative z-10">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {project.stack?.slice(0, 4).map((tech: string) => (
            <span key={tech} className="text-xs font-mono px-2 py-1 bg-white/5 rounded border border-border/50 text-slate-300">
              {tech}
            </span>
          ))}
          {project.stack?.length > 4 && (
            <span className="text-xs font-mono px-2 py-1 bg-white/5 rounded border border-border/50 text-slate-500">
              +{project.stack.length - 4}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto relative z-10">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-mono">
          <Clock className="w-4 h-4 text-cyan-500" />
          <span>{project.estimatedHours}h</span>
        </div>
        
        <Link href={`/projects/${project.slug}`}>
          <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 group/btn">
            View Project
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
