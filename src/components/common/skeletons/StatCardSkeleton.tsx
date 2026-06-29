export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-border backdrop-blur-xl animate-pulse h-32">
      <div className="flex justify-between items-start mb-4">
        <div className="h-4 w-24 bg-white/10 rounded" />
        <div className="w-10 h-10 rounded-xl bg-white/10" />
      </div>
      <div className="h-8 w-16 bg-white/10 rounded mb-2" />
      <div className="h-3 w-32 bg-white/5 rounded" />
    </div>
  );
}
