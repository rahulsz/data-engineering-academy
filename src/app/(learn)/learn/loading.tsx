import { ModuleCardSkeleton } from "@/components/common/skeletons/ModuleCardSkeleton";

export default function LearnLoading() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      <div className="text-center max-w-2xl mx-auto relative">
        <div className="h-16 w-3/4 bg-white/5 rounded-lg mx-auto mb-6 animate-pulse" />
        <div className="h-6 w-full bg-white/5 rounded mx-auto animate-pulse" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 border border-border p-4 rounded-2xl">
        <div className="h-10 w-full md:w-1/3 bg-white/10 rounded-xl animate-pulse" />
        <div className="h-10 w-full md:w-auto bg-white/10 rounded-xl flex-1 animate-pulse" />
        <div className="h-10 w-full md:w-40 bg-white/10 rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className={`p-5 rounded-2xl bg-white/5 border border-border animate-pulse h-72 ${i === 1 ? 'lg:col-span-2' : ''}`}>
             <div className="h-32 bg-white/5 rounded-xl mb-4" />
             <div className="h-6 w-3/4 bg-white/10 rounded mb-4" />
             <div className="h-4 w-full bg-white/5 rounded mb-2" />
             <div className="h-4 w-5/6 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
