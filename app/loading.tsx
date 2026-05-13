export default function Loading() {
  return (
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden w-64 border-r bg-card md:flex flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          </div>
        </div>
        <div className="flex-1 p-2 space-y-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 rounded-lg bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header skeleton */}
        <div className="flex h-14 items-center justify-between border-b px-6">
          <div className="h-9 w-64 rounded-lg bg-muted animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          </div>
        </div>

        {/* Content skeleton */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <div className="h-8 w-32 rounded-lg bg-muted animate-pulse" />
              <div className="mt-2 h-4 w-48 rounded bg-muted animate-pulse" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-muted/50 animate-pulse" />
              ))}
            </div>
            <div className="h-64 rounded-xl bg-muted/50 animate-pulse" />
          </div>
        </main>
      </div>
    </div>
  );
}
