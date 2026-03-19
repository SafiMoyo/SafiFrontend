"use client"

import { Clock, LibraryBig, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { notFound, useRouter } from "next/navigation"
import { use, useMemo, useEffect } from "react"
import Navbar from "@/components/navbar/navbar"
import {
  useQueryModules,
  useQueryModuleLessons,
  useQueryCheckEnrolled,
} from "@/services/module-lesson/queries"
import { useAuthContext } from "@/context"
import { SubscriptionStatus } from "@/types/subscription"
import type { LessonsType } from "@/types/lesson"

export default function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>
}) {
  const { moduleId, lessonId } = use(params)
  const router = useRouter()
  const { activeUser } = useAuthContext()

  const { data: modulesData, isLoading: modulesLoading } = useQueryModules({})
  const { data: lessonsData, isLoading } = useQueryModuleLessons({
    queryParams: { module_id: moduleId },
  })

  const modules = useMemo(() => modulesData?.data ?? [], [modulesData?.data])
  const lessons = useMemo<LessonsType[]>(
    () => lessonsData?.data ?? [],
    [lessonsData?.data]
  )

  const lessonModule = useMemo(
    () => modules.find((m) => String(m.id) === moduleId),
    [modules, moduleId]
  )

  const hasActiveSubscription =
    activeUser?.subscription?.subscription_status === SubscriptionStatus.ACTIVE

  const isFreeModule = lessonModule?.module_tier === SubscriptionStatus.FREE
  const isAccessible = isFreeModule || hasActiveSubscription

  const { data: enrolledData, isLoading: enrolledLoading } =
    useQueryCheckEnrolled({
      queryParams: { module_id: moduleId },
      enabled: !!lessonModule && isAccessible,
    })

  const isEnrolled = enrolledData?.data?.is_enrolled ?? false

  // Guard: no subscription → /modules
  useEffect(() => {
    if (!modulesLoading && lessonModule && !isAccessible) {
      router.replace("/modules")
    }
  }, [modulesLoading, lessonModule, isAccessible, router])

  // Guard: not enrolled → back to module page
  useEffect(() => {
    if (!enrolledLoading && !isEnrolled && isAccessible && lessonModule) {
      router.replace(`/modules/${moduleId}`)
    }
  }, [enrolledLoading, isEnrolled, isAccessible, lessonModule, moduleId, router])

  const lessonIndex = useMemo(
    () => lessons.findIndex((l) => String(l.id) === lessonId),
    [lessons, lessonId]
  )
  const lesson = useMemo(
    () => lessons[lessonIndex] ?? null,
    [lessons, lessonIndex]
  )

  if (!isLoading && !lesson) return notFound()

  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null
  const nextLesson =
    lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null

  return (
    <div className="flex min-h-screen flex-col bg-[#EDE6F0]">
      <Navbar />

      {/* Lesson header */}
      <div className="flex flex-col gap-4 px-3 py-4 sm:flex-row sm:items-start sm:px-5 sm:py-5">
        {/* Left: Lesson info */}
        <div className="flex-1">
          <p className="text-xs font-semibold text-primary">
            Module {moduleId}
          </p>
          <h1 className="mt-1 text-xl font-bold text-gray-900">
            {lesson
              ? `${lessonIndex + 1}. ${lesson.lesson_title}`
              : "Loading..."}
          </h1>
          {lesson && (
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <LibraryBig size={14} />
                Lesson {lessonIndex + 1} of {lessons.length}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {lesson.lesson_duration}
              </span>
            </div>
          )}
        </div>

        {/* Right: About this lesson card */}
        {lesson && (
          <div className="rounded-xl bg-white px-4 py-3.5 shadow-xs sm:w-56">
            <h2 className="mb-1.5 text-sm font-bold text-gray-800">
              About this Lesson
            </h2>
            <p className="text-xs leading-relaxed text-gray-600">
              {lesson.lesson_description}
            </p>
          </div>
        )}
      </div>

      {/* Main video player */}
      {lesson ? (
        <div className="mx-3 mb-4 flex-1 overflow-hidden rounded-2xl bg-black shadow-lg sm:mx-5">
          {lesson.video_url ? (
            <video
              className="h-full w-full"
              controls
              controlsList="nodownload"
              poster={lesson.cover_image_url || undefined}
            >
              <source src={lesson.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex h-96 items-center justify-center bg-linear-to-br from-gray-900 to-gray-800">
              <div className="text-center">
                <svg
                  className="mx-auto mb-3 size-16 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-400">Video not available</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mx-3 mb-4 flex-1 rounded-2xl bg-gray-200 sm:mx-5" />
      )}

      {/* Bottom navigation */}
      <div className="flex items-center justify-between px-3 py-4 sm:px-5 sm:py-5">
        <Button
          variant="outline"
          href={
            prevLesson
              ? `/modules/${moduleId}/lessons/${prevLesson.id}`
              : `/modules/${moduleId}`
          }
          className="rounded-full border-gray-300 px-5 text-sm font-semibold text-gray-700"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </Button>

        <div className="text-xs font-semibold text-gray-500">
          {lessonIndex + 1} of {lessons.length}
        </div>

        <Button
          href={
            nextLesson
              ? `/modules/${moduleId}/lessons/${nextLesson.id}`
              : `/modules/${moduleId}`
          }
          className="rounded-full px-5 text-sm font-semibold"
          variant={nextLesson ? "default" : "outline"}
        >
          {nextLesson ? "Next" : "Back to Module"}
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-[#E4D6B3] py-4 text-center">
        <p className="text-xs tracking-wider text-gray-600">
          © 2026 SAFI. ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  )
}
