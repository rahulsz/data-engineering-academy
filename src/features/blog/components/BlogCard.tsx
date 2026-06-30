import Link from "next/link";
import { format } from "date-fns";
import { 
  Clock, Calendar, BarChart, Mail, Rocket, Code2, 
  Zap, RefreshCw, Star, Briefcase, Wind, FileText 
} from "lucide-react";
import { BlogPostMeta } from "@/lib/blog";

const emojiToIcon: Record<string, React.ReactNode> = {
  "📊": <BarChart className="w-6 h-6 text-cyan-400" />,
  "📨": <Mail className="w-6 h-6 text-emerald-400" />,
  "🚀": <Rocket className="w-6 h-6 text-amber-400" />,
  "🕒": <Clock className="w-6 h-6 text-indigo-400" />,
  "🐍": <Code2 className="w-6 h-6 text-green-400" />,
  "⚡": <Zap className="w-6 h-6 text-yellow-400" />,
  "🔄": <RefreshCw className="w-6 h-6 text-blue-400" />,
  "⭐": <Star className="w-6 h-6 text-yellow-500" />,
  "💼": <Briefcase className="w-6 h-6 text-slate-400" />,
  "🌬️": <Wind className="w-6 h-6 text-cyan-200" />
};

export function BlogCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="h-full flex flex-col bg-black/40 backdrop-blur-md border border-border rounded-2xl p-6 overflow-hidden hover:bg-white/5 hover:border-cyan-500/50 transition-all duration-300 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-border flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:border-cyan-500/30 transition-transform duration-300">
            {emojiToIcon[post.coverImage || ""] || <FileText className="w-6 h-6 text-slate-400" />}
          </div>
          <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded">
            {post.category}
          </span>
        </div>

        <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors relative z-10 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-sm text-slate-400 line-clamp-3 mb-6 relative z-10 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50 text-xs font-mono text-slate-500 relative z-10">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(post.date), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime}
          </div>
        </div>
      </div>
    </Link>
  );
}
