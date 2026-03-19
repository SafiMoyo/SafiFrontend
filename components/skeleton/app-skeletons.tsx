import { Skeleton } from "./skeleton"

export function AppPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="border-b border-white/60 bg-white/70 px-5 py-4">
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="mx-auto w-full max-w-4xl space-y-4 px-5 py-6">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-72" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    </div>
  )
}

export function CenteredAuthSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-100/20 px-4">
      <div className="w-full max-w-sm space-y-3 rounded-2xl bg-white/80 p-5 shadow-sm">
        <Skeleton className="mx-auto h-10 w-10 rounded-full" />
        <Skeleton className="mx-auto h-4 w-1/2" />
        <Skeleton className="mx-auto h-3 w-2/3" />
      </div>
    </div>
  )
}

export function ModuleListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex overflow-hidden rounded-2xl border border-white/40 bg-white/70"
        >
          <Skeleton className="h-28 w-32 rounded-none sm:w-40" />
          <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function LessonTimelineSkeleton() {
  return (
    <div className="relative mt-6 pl-8">
      <div className="absolute top-5 bottom-5 left-3.5 w-[0.1px] bg-gray-300" />
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="relative flex items-center gap-4">
            <Skeleton className="absolute -left-8 z-10 size-7 rounded-full" />
            <div className="w-full rounded-xl bg-white px-4 py-3.5 shadow-xs">
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
