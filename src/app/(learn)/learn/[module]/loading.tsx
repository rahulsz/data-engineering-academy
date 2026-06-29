import { LessonRowSkeleton } from "@/components/common/skeletons/LessonRowSkeleton";

export default function ModuleLoading() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {/* Header Skeleton */}
      <div className="mb-12 border-b border-surface-deep/50 pb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-white/5 border border-border rounded-2xl animate-pulse" />
        <div className="flex-1">
          <div className="h-10 w-64 bg-white/10 rounded mb-2 animate-pulse" />
          <div className="h-5 w-96 bg-white/5 rounded animate-pulse" />
        </div>
      </div>

      {/* Roadmap Skeleton */}
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map(i => (
          <LessonRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
