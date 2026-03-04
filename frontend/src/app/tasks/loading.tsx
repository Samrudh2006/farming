export default function TasksLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16 border-b border-white/10 bg-background/80 backdrop-blur-xl" />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        <div className="h-8 w-32 rounded-lg bg-white/5 animate-shimmer mb-2" />
        <div className="h-5 w-96 rounded-lg bg-white/5 animate-shimmer mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex justify-between">
                <div className="h-5 w-2/3 rounded bg-white/5 animate-shimmer" />
                <div className="h-5 w-14 rounded-full bg-white/5 animate-shimmer" />
              </div>
              <div className="h-4 w-full rounded bg-white/5 animate-shimmer" />
              <div className="h-4 w-4/5 rounded bg-white/5 animate-shimmer" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-white/5 animate-shimmer" />
                <div className="h-5 w-14 rounded-full bg-white/5 animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
