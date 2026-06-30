import { FolderGit2 } from "lucide-react";

export default function ProjectsLoading() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <div className="relative w-full border-b border-border bg-background/50 overflow-hidden py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 animate-pulse mb-6 flex items-center justify-center">
            <FolderGit2 className="w-8 h-8 text-slate-600" />
          </div>
          <div className="h-10 w-64 bg-white/5 animate-pulse rounded-lg mb-4" />
          <div className="h-4 w-96 bg-white/5 animate-pulse rounded max-w-full" />
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-white/5 animate-pulse rounded-2xl border border-border/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
