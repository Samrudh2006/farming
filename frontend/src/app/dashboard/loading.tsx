export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16 border-b border-white/10 bg-background/80 backdrop-blur-xl" />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        <div className="h-8 w-48 rounded-lg bg-white/5 animate-shimmer mb-2" />
        <div className="h-5 w-80 rounded-lg bg-white/5 animate-shimmer mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="h-4 w-24 rounded bg-white/5 animate-shimmer" />
              <div className="h-10 w-20 rounded bg-white/5 animate-shimmer" />
              <div className="h-3 w-40 rounded bg-white/5 animate-shimmer" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
