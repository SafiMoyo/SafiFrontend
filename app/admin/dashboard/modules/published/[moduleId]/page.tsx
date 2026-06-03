"use client"

import { use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  Film,
  Lock,
  Unlock,
  Clock,
  AlertCircle,
  ListOrdered,
} from "lucide-react"
import {
  useAdminPublishedModules,
  useAdminModuleLessons,
  type AdminModule,
  type AdminLesson,
  type PublishedModulesResponse,
} from "@/services/admin-auth/queries"

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

function findModule(data: PublishedModulesResponse | undefined, moduleId: string): AdminModule | undefined {
  if (!data?.data) return undefined
  if (Array.isArray(data.data)) return (data.data as AdminModule[]).find((m) => m.id === moduleId)
  const grouped = data.data as { early?: AdminModule[]; middle?: AdminModule[]; advanced?: AdminModule[]; unassigned?: AdminModule[] }
  return [
    ...(grouped.early ?? []),
    ...(grouped.middle ?? []),
    ...(grouped.advanced ?? []),
    ...(grouped.unassigned ?? []),
  ].find((m) => m.id === moduleId)
}

function LessonCard({ lesson, index }: { lesson: AdminLesson; index: number }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      {/* Serial / index */}
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <span className="text-sm font-black text-primary">{lesson.serial_number ?? index + 1}</span>
      </div>

      {/* Cover thumbnail */}
      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-purple-400 to-pink-400">
        {lesson.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={lesson.cover_image_url} alt={lesson.lesson_title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Film size={18} className="text-white/70" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-extrabold text-gray-900">{lesson.lesson_title}</p>
        {lesson.lesson_description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{lesson.lesson_description}</p>
        )}
        <div className="mt-1.5 flex items-center gap-3">
          {lesson.lesson_duration && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              {lesson.lesson_duration}
            </span>
          )}
          {lesson.publish_status && (
            <span className={`text-xs font-semibold ${lesson.publish_status === "PUBLISHED" ? "text-green-600" : "text-amber-600"}`}>
              {lesson.publish_status === "PUBLISHED" ? "Published" : "Draft"}
            </span>
          )}
        </div>
      </div>

      {/* Video indicator */}
      {lesson.video_url && (
        <a
          href={lesson.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-50 text-primary transition-colors hover:bg-purple-100"
          title="View video"
        >
          <Film size={16} />
        </a>
      )}
    </div>
  )
}

export default function ModuleDetailPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = use(params)
  const { data: modulesData, isLoading: modulesLoading } = useAdminPublishedModules()
  const { data: lessonsData, isLoading: lessonsLoading, isError: lessonsError } = useAdminModuleLessons(moduleId)

  const mod = findModule(modulesData, moduleId)
  const lessons = lessonsData?.data ?? []
  const isLoading = modulesLoading || lessonsLoading

  const ageLabel = mod?.age_group ? AGE_GROUP_LABEL[mod.age_group] : null
  const ageColor = mod?.age_group ? AGE_GROUP_COLOR[mod.age_group] ?? "bg-gray-100 text-gray-600" : ""

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back */}
      <Link
        href="/admin/dashboard/modules/published"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Published Modules
      </Link>

      {/* Module header card */}
      {(mod || modulesLoading) && (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
          {/* Cover banner */}
          <div className="relative h-[200px] bg-gradient-to-br from-purple-500 to-pink-500">
            {mod?.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mod.cover_image_url}
                alt={mod.module_title}
                className="h-full w-full object-cover"
              />
            )}
            {modulesLoading && (
              <div className="h-full w-full animate-pulse bg-gray-200" />
            )}
          </div>

          {/* Meta */}
          <div className="p-6">
            {modulesLoading ? (
              <div className="space-y-2">
                <div className="h-6 w-1/2 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-4 w-3/4 animate-pulse rounded-lg bg-gray-100" />
              </div>
            ) : mod ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h1 className="text-xl font-black text-gray-900">{mod.module_title}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {ageLabel && (
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ageColor}`}>
                        {ageLabel}
                      </span>
                    )}
                    {mod.module_tier && (
                      <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${mod.module_tier === "FREE" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {mod.module_tier === "FREE" ? <Unlock size={11} /> : <Lock size={11} />}
                        {mod.module_tier === "FREE" ? "Free" : "Paid"}
                      </span>
                    )}
                  </div>
                </div>
                {mod.module_description && (
                  <p className="mt-2 text-sm text-gray-500">{mod.module_description}</p>
                )}
                <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <ListOrdered size={13} />
                    Sequence {mod.sequence_num}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={13} />
                    {mod.no_of_lessons} {mod.no_of_lessons === 1 ? "lesson" : "lessons"}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Module not found.</p>
            )}
          </div>
        </div>
      )}

      {/* Lessons section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-black text-gray-900">
            Lessons
            {!isLoading && (
              <span className="ml-2 text-sm font-semibold text-gray-400">({lessons.length})</span>
            )}
          </h2>
          <Link
            href="/admin/dashboard/create-course"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90"
          >
            + Add Lesson
          </Link>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[80px] animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {lessonsError && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
            <AlertCircle size={18} />
            Failed to load lessons. Please refresh.
          </div>
        )}

        {!isLoading && !lessonsError && lessons.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-purple-50">
              <Film size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">No lessons yet</p>
              <p className="mt-1 text-xs text-gray-500">Add lessons to this module from the Create Course page.</p>
            </div>
            <Link
              href="/admin/dashboard/create-course"
              className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90"
            >
              Add Lesson
            </Link>
          </div>
        )}

        {!isLoading && !lessonsError && lessons.length > 0 && (
          <div className="space-y-3">
            {lessons.map((lesson, i) => (
              <LessonCard key={lesson.id} lesson={lesson} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
