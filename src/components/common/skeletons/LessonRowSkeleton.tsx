export function LessonRowSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-white/5 animate-pulse">
      <div className="flex items-center gap-4 mb-3 sm:mb-0">
        <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
        <div>
          <div className="h-4 w-48 bg-white/10 rounded mb-2" />
          <div className="flex gap-2">
            <div className="h-3 w-16 bg-white/5 rounded" />
            <div className="h-3 w-16 bg-white/5 rounded" />
          </div>
        </div>
      </div>
      <div className="w-full sm:w-24 h-9 rounded-md bg-white/10" />
    </div>
  );
}
