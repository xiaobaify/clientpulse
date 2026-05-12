export default function Loading() {
  return (
    <div className="flex h-screen">
      <div className="hidden w-64 border-r bg-muted/30 md:block" />
      <div className="flex flex-1 flex-col">
        <div className="h-14 border-b" />
        <main className="flex-1 p-6">
          <div className="space-y-6 animate-pulse">
            <div>
              <div className="h-8 w-32 rounded bg-muted" />
              <div className="mt-2 h-4 w-24 rounded bg-muted" />
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-lg bg-muted" />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-72 rounded-lg bg-muted" />
              <div className="h-72 rounded-lg bg-muted" />
            </div>
            <div className="h-48 rounded-lg bg-muted" />
          </div>
        </main>
      </div>
    </div>
  );
}
