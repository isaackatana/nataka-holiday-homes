export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card bg-sand-50 shadow-card">
      <div className="aspect-[4/3] animate-pulse bg-sand-200" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-sand-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-sand-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-sand-200" />
        <div className="mt-2 h-6 w-1/3 animate-pulse rounded bg-sand-200" />
      </div>
    </div>
  )
}
