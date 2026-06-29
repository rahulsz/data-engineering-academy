export function ModuleCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-border backdrop-blur-xl animate-pulse flex items-center gap-4">
      <div className="w-16 h-16 rounded-xl bg-white/10 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-5 w-3/4 bg-white/10 rounded mb-3" />
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
