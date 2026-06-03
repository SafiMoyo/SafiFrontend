"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  Film,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminUnpublishedModules, type DraftModule, type DraftLesson } from "@/services/admin-auth/queries"
import { useAdminPublishModule, useAdminPublishLesson } from "@/services/admin-auth/mutations"
import { toast } from "sonner"

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

function LessonRow({ lesson, moduleId }: { lesson: DraftLesson; moduleId: string }) {
  const publishLesson = useAdminPublishLesson()
  const isDraft = lesson.publish_status === "DRAFT"

  function handlePublish() {
    publishLesson.mutate(lesson.id, {
      onSuccess: () => toast.success(`"${lesson.lesson_title}" published`),
    })
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-100">
          <Film size={14} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-800">{lesson.lesson_title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {lesson.lesson_duration && (
              <span className="text-xs text-gray-400">{lesson.lesson_duration}</span>
            )}
            <span className={`text-xs font-semibold ${isDraft ? "text-amber-600" : "text-green-600"}`}>
              {isDraft ? "Draft" : "Published"}
            </span>
          </div>
        </div>
      </div>

      {isDraft && (
        <Button
          type="button"
          size="sm"
          className="h-8 shrink-0 rounded-full px-4 text-xs font-bold"
          loading={publishLesson.isPending}
          onClick={handlePublish}
        >
          <CheckCircle2 size={13} />
          Publish
        </Button>
      )}
    </div>
  )
}

function ModuleCard({ mod }: { mod: DraftModule }) {
  const [expanded, setExpanded] = useState(false)
  const publishModule = useAdminPublishModule()

  const ageLabel = mod.age_group ? AGE_GROUP_LABEL[mod.age_group] : null
  const ageColor = mod.age_group ? AGE_GROUP_COLOR[mod.age_group] ?? "bg-gray-100 text-gray-600" : ""
  const draftLessonsCount = mod.lessons.filter((l) => l.publish_status === "DRAFT").length

  function handlePublishModule() {
    publishModule.mutate(mod.id, {
      onSuccess: () => toast.success(`"${mod.module_title}" published successfully`),
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      {/* Module header row */}
      <div className="flex items-center gap-4 p-4">
        {/* Cover thumbnail */}
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
          {mod.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mod.cover_image_url} alt={mod.module_title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen size={20} className="text-white/70" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-sm font-extrabold text-gray-900 truncate">{mod.module_title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {ageLabel && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ageColor}`}>
                {ageLabel}
              </span>
            )}
            {mod.module_tier && (
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${mod.module_tier === "FREE" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {mod.module_tier === "FREE" ? <Unlock size={10} /> : <Lock size={10} />}
                {mod.module_tier === "FREE" ? "Free" : "Paid"}
              </span>
            )}
            <span className="text-xs text-gray-400">
              {mod.lessons.length} {mod.lessons.length === 1 ? "lesson" : "lessons"}
              {draftLessonsCount > 0 && (
                <span className="ml-1 text-amber-600">· {draftLessonsCount} draft</span>
              )}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            className="h-9 rounded-full px-4 text-xs font-bold"
            loading={publishModule.isPending}
            onClick={handlePublishModule}
          >
            <CheckCircle2 size={14} />
            Publish Module
          </Button>

          {mod.lessons.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((p) => !p)}
              className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
            >
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Lessons list */}
      {expanded && mod.lessons.length > 0 && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-2">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-gray-400">Lessons</p>
          {mod.lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} moduleId={mod.id} />
          ))}
        </div>
      )}

      {expanded && mod.lessons.length === 0 && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 text-center text-xs text-gray-400">
          No lessons added yet.{" "}
          <Link href="/admin/dashboard/create-course" className="text-primary underline underline-offset-2">
            Add a lesson
          </Link>
        </div>
      )}
    </div>
  )
}

export default function UnpublishedModulesPage() {
  const { data, isLoading, isError } = useAdminUnpublishedModules()
  const modules = data?.data ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Unpublished Modules</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isLoading ? "Loading..." : `${modules.length} draft ${modules.length === 1 ? "module" : "modules"}`}
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
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[88px] animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          <AlertCircle size={18} />
          Failed to load draft modules. Please refresh the page.
        </div>
      )}

      {!isLoading && !isError && modules.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-purple-50">
            <BookOpen size={28} className="text-primary" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-800">No draft modules</p>
            <p className="mt-1 text-sm text-gray-500">Save a module as draft and it will appear here.</p>
          </div>
          <Link
            href="/admin/dashboard/create-course"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90"
          >
            Create Course
          </Link>
        </div>
      )}

      {!isLoading && !isError && modules.length > 0 && (
        <div className="space-y-3">
          {modules.map((mod) => (
            <ModuleCard key={mod.id} mod={mod} />
          ))}
        </div>
      )}
    </div>
  )
}
