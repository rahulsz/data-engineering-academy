import { StatCardSkeleton } from "./StatCardSkeleton";
import { ModuleCardSkeleton } from "./ModuleCardSkeleton";

export function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-5 w-48 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* XP Progress Bar */}
      <div className="h-8 w-full rounded-full bg-white/5 animate-pulse" />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          {/* Continue Learning / Modules Grid Skeleton */}
          <div className="space-y-6">
            <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModuleCardSkeleton />
              <ModuleCardSkeleton />
              <ModuleCardSkeleton />
              <ModuleCardSkeleton />
            </div>
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="h-8 w-32 bg-white/5 rounded-lg animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-4 h-4 rounded-full bg-white/10 animate-pulse" />
                  <div className="h-4 flex-1 bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
