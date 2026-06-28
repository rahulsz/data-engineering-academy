import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-deep/50", className)}
      {...props}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-xl border border-surface-deep/50 bg-black/40 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

export function ModuleCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-surface-deep/50 bg-black/40 backdrop-blur-md">
      <div className="h-32 w-full relative">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="p-5 flex-1 flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="mt-auto pt-4 flex gap-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export function LessonRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-surface-deep/30 bg-black/20">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="w-20 h-8 rounded-full shrink-0" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <LessonRowSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="p-6 rounded-xl border border-surface-deep/50 bg-black/40 backdrop-blur-md space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
