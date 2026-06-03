"use client"

import Link from "next/link"
import { BookOpen, Lock, Unlock, AlertCircle } from "lucide-react"
import { useAdminPublishedModules, type AdminModule, type PublishedModulesResponse } from "@/services/admin-auth/queries"

function normalizeModules(data: PublishedModulesResponse | undefined): {
  EARLY: AdminModule[]
  MIDDLE: AdminModule[]
  ADVANCED: AdminModule[]
  OTHER: AdminModule[]
} {
  const empty = { EARLY: [], MIDDLE: [], ADVANCED: [], OTHER: [] }
  if (!data?.data) return empty

  // Server returns grouped object: { early: [...], middle: [...], ... }
  if (!Array.isArray(data.data)) {
    const grouped = data.data as { early?: AdminModule[]; middle?: AdminModule[]; advanced?: AdminModule[]; unassigned?: AdminModule[] }
    return {
      EARLY: grouped.early ?? [],
      MIDDLE: grouped.middle ?? [],
      ADVANCED: grouped.advanced ?? [],
      OTHER: grouped.unassigned ?? [],
    }
  }

  // Server returns flat array
  const flat = data.data as AdminModule[]
  return {
    EARLY: flat.filter((m) => m.age_group === "EARLY"),
    MIDDLE: flat.filter((m) => m.age_group === "MIDDLE"),
    ADVANCED: flat.filter((m) => m.age_group === "ADVANCED"),
    OTHER: flat.filter((m) => !m.age_group || !["EARLY", "MIDDLE", "ADVANCED"].includes(m.age_group)),
  }
}

const AGE_GROUP_LABEL: Record<string, string> = {
  EARLY: "Early",
  MIDDLE: "Middle",
  ADVANCED: "Advanced",
}

const AGE_GROUP_COLOR: Record<string, string> = {
  EARLY: "bg-green-100 text-green-700",
  MIDDLE: "bg-blue-100 text-blue-700",
  ADVANCED: "bg-purple-100 text-purple-700",
}

const COVER_GRADIENTS = [
  "from-purple-500 to-pink-500",
  "from-indigo-500 to-purple-600",
  "from-violet-600 to-fuchsia-500",
  "from-purple-600 to-indigo-600",
  "from-fuchsia-500 to-violet-600",
  "from-pink-500 to-purple-600",
]

function ModuleCard({ mod, index }: { mod: AdminModule; index: number }) {
  const gradient = COVER_GRADIENTS[index % COVER_GRADIENTS.length]
  const tierLabel = mod.module_tier === "FREE" ? "Free" : mod.module_tier === "PAID" ? "Paid" : null
  const ageLabel = mod.age_group ? AGE_GROUP_LABEL[mod.age_group] : null
  const ageColor = mod.age_group ? AGE_GROUP_COLOR[mod.age_group] ?? "bg-gray-100 text-gray-600" : ""

  return (
    <Link
      href={`/admin/dashboard/modules/published/${mod.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md cursor-pointer">
      {/* Cover */}
      <div className={`relative h-[140px] bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        {mod.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mod.cover_image_url}
            alt={mod.module_title}
            className="h-full w-full object-cover"
          />
        ) : (
          <BookOpen size={40} className="text-white/60" />
        )}
        {tierLabel && (
          <span className={`absolute top-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${mod.module_tier === "FREE" ? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}>
            {mod.module_tier === "FREE" ? <Unlock size={11} /> : <Lock size={11} />}
            {tierLabel}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-gray-900">
          {mod.module_title}
        </h3>

        {mod.module_description && (
          <p className="line-clamp-2 text-xs text-gray-500">{mod.module_description}</p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {ageLabel && (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ageColor}`}>
                {ageLabel}
              </span>
            )}
          </div>
          {mod.no_of_lessons !== undefined && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <BookOpen size={12} />
              {mod.no_of_lessons} {mod.no_of_lessons === 1 ? "lesson" : "lessons"}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function GroupSection({ label, color, modules }: { label: string; color: string; modules: AdminModule[] }) {
  if (modules.length === 0) return null
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${color}`}>
          {label}
        </span>
        <span className="text-xs text-gray-400">{modules.length} {modules.length === 1 ? "module" : "modules"}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((mod, i) => (
          <ModuleCard key={mod.id} mod={mod} index={i} />
        ))}
      </div>
    </div>
  )
}

export default function PublishedModulesPage() {
  const { data, isLoading, isError } = useAdminPublishedModules()
  const grouped = normalizeModules(data)
  const totalCount = grouped.EARLY.length + grouped.MIDDLE.length + grouped.ADVANCED.length + grouped.OTHER.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Published Modules</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isLoading ? "Loading..." : `${totalCount} published ${totalCount === 1 ? "module" : "modules"}`}
          </p>
        </div>
        <Link
          href="/admin/dashboard/create-course"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(137,0,235,0.25)] transition hover:bg-primary/90"
        >
          + Create Course
        </Link>
      </div>

      {/* States */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[220px] animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          <AlertCircle size={18} />
          Failed to load modules. Please refresh the page.
        </div>
      )}

      {!isLoading && !isError && totalCount === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-purple-50">
            <BookOpen size={28} className="text-primary" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-800">No published modules yet</p>
            <p className="mt-1 text-sm text-gray-500">Create a course and publish it to see it here.</p>
          </div>
          <Link
            href="/admin/dashboard/create-course"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90"
          >
            Create Course
          </Link>
        </div>
      )}

      {!isLoading && !isError && totalCount > 0 && (
        <div className="space-y-10">
          <GroupSection label="Early" color="bg-green-100 text-green-700" modules={grouped.EARLY} />
          <GroupSection label="Middle" color="bg-blue-100 text-blue-700" modules={grouped.MIDDLE} />
          <GroupSection label="Advanced" color="bg-purple-100 text-purple-700" modules={grouped.ADVANCED} />
          <GroupSection label="Unassigned" color="bg-gray-100 text-gray-600" modules={grouped.OTHER} />
        </div>
      )}
    </div>
  )
}
