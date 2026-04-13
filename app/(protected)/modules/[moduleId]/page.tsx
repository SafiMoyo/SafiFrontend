"use client"

import { CheckCircle2, Clock, Lock, CircleDashed, ChevronLeft } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useMemo, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { use } from "react"
import Footer from "@/components/footer/footer"
import {
  useQueryModules,
  useQueryModuleLessons,
  useQueryCheckEnrolled,
} from "@/services/module-lesson/queries"
import { useMutateEnrolModule } from "@/services/module-lesson/mutations"
import { useAuthContext } from "@/context"
import { SubscriptionStatus } from "@/types/subscription"
import { LessonTimelineSkeleton } from "@/components/skeleton"
import { ENUM_LESSON_STATUS } from "@/types/lesson"

export default function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>
}) {
  const { moduleId } = use(params)
  const router = useRouter()
  const { activeUser } = useAuthContext()

  const { data: modulesData, isLoading: modulesLoading } = useQueryModules({})
  const {
    data: lessonsData,
    isLoading: lessonsLoading,
    refetch: refetchLesson,
  } = useQueryModuleLessons({
    queryParams: { module_id: moduleId },
  })

  const modules = useMemo(() => modulesData?.data ?? [], [modulesData?.data])
  const lessons = useMemo(() => lessonsData?.data ?? [], [lessonsData?.data])
  const orderedLessons = useMemo(
    () => [...lessons].sort((a, b) => a.serial_number - b.serial_number),
    [lessons]
  )

  const lessonModule = useMemo(
    () => modules.find((m) => String(m.id) === moduleId),
    [modules, moduleId]
  )

  const hasActiveSubscription =
    activeUser?.subscription?.subscription_status === SubscriptionStatus.ACTIVE

  const moduleLocks = useMemo(() => {
    const sorted = [...modules].sort((a, b) => a.sequence_num - b.sequence_num)
    const lockMap: Record<string, boolean> = {}
    const completedById: Record<string, boolean> = {}

    sorted.forEach((module) => {
      completedById[String(module.id)] = module.module_progress >= 100
    })

    sorted.forEach((module, index) => {
      const isFree = module.module_tier === SubscriptionStatus.FREE
      const subscriptionLocked = !isFree && !hasActiveSubscription
      const prev = sorted[index - 1]
      const previousCompleted = prev ? completedById[String(prev.id)] : true

      lockMap[String(module.id)] = subscriptionLocked || !previousCompleted
    })

    return lockMap
  }, [hasActiveSubscription, modules])

  const isAccessible = lessonModule
    ? !moduleLocks[String(lessonModule.id)]
    : false

  // Redirect to /modules if user doesn't have access
  useEffect(() => {
    if (!modulesLoading && lessonModule && !isAccessible) {
      router.replace("/modules")
    }
  }, [modulesLoading, lessonModule, isAccessible, router])

  const { data: enrolledData, isLoading: enrolledLoading } =
    useQueryCheckEnrolled({
      queryParams: { module_id: moduleId },
      enabled: !!lessonModule && isAccessible,
    })

  const isEnrolled = enrolledData?.data?.enrolled ?? false
  const hasResolvedEnrollment =
    !!lessonModule && isAccessible && !enrolledLoading && !!enrolledData

  const { mutate: enrolModule, isPending: enrolling } = useMutateEnrolModule({
    queryParams: { module_id: moduleId },
    onSuccess: () => {
      refetchLesson({})
    },
  })

  if (!modulesLoading && !lessonModule) return notFound()

  // Still loading or being redirected
  if (!modulesLoading && lessonModule && !isAccessible) {
    return null
  }

  const isLessonLocked = (index: number) => {
    if (index === 0) return false
    return orderedLessons[index - 1]?.status !== ENUM_LESSON_STATUS.COMPLETED
  }

  const nextLesson = orderedLessons.find(
    (lesson, index) =>
      lesson.status !== ENUM_LESSON_STATUS.COMPLETED && !isLessonLocked(index)
  )
  const completedLessonsCount = orderedLessons.filter(
    (lesson) => lesson.status === ENUM_LESSON_STATUS.COMPLETED
  ).length
  const isModuleFullyCompleted =
    orderedLessons.length > 0 && completedLessonsCount === orderedLessons.length

  return (
    <div className="flex min-h-screen flex-col bg-purple-100/50">
      {/* Minimal navbar */}
      <div className="h-[68px] shrink-0" />
      <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <Image src="/images/logo.svg" alt="Safi" width={80} height={28} />
        <button
          type="button"
          onClick={() => router.push("/modules")}
          className="flex items-center gap-1 text-sm font-semibold text-gray-700 transition hover:text-primary"
        >
          <ChevronLeft size={16} />
          Back
        </button>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-3 py-4 sm:px-5 sm:py-5">
        {/* Module header card */}
        <div className="rounded-2xl bg-white p-5 shadow-xs">
          <h1 className="text-lg font-bold text-gray-900">
            {lessonModule?.module_title ?? "Module"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {lessonModule?.module_description}
          </p>
          {isEnrolled && orderedLessons.length > 0 && (
            <p className="mt-3 text-xs font-semibold text-gray-500">
              Progress: {completedLessonsCount}/{orderedLessons.length}{" "}
              completed
            </p>
          )}

          {/* Enrollment / continue button */}
          {hasResolvedEnrollment && (
            <div className="mt-4">
              {isEnrolled ? (
                nextLesson ? (
                  <Button
                    href={`/modules/${moduleId}/lessons/${nextLesson.id}`}
                    className="px-5"
                  >
                    {nextLesson.status === ENUM_LESSON_STATUS.ONGOING
                      ? "Resume Learning"
                      : "Continue Learning"}
                  </Button>
                ) : (
                  <Button disabled className="px-5" variant="outline">
                    {isModuleFullyCompleted
                      ? "Module Completed"
                      : "No Available Lesson"}
                  </Button>
                )
              ) : (
                <Button
                  onClick={() => enrolModule({ module_id: moduleId } as never)}
                  disabled={enrolling}
                  loading={enrolling}
                  className="px-5"
                >
                  {enrolling ? "Enrolling…" : "Enroll in Module"}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Not enrolled state */}
        {hasResolvedEnrollment && !isEnrolled && (
          <div className="mt-6 rounded-2xl border border-dashed border-primary/30 bg-white/60 px-5 py-8 text-center">
            <Lock size={32} className="mx-auto mb-3 text-primary/40" />
            <p className="text-sm font-semibold text-gray-700">
              Enroll to access lessons
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Click &ldquo;Enroll in Module&rdquo; above to unlock all lessons
              in this module.
            </p>
          </div>
        )}

        {/* Lessons timeline — only shown when enrolled */}
        {isEnrolled && (
          <div className="relative mt-6 pl-8">
            {/* Vertical connector line */}
            <div className="absolute top-5 bottom-5 left-3.5 w-[0.1px] bg-gray-300" />

            {lessonsLoading ? (
              <LessonTimelineSkeleton />
            ) : orderedLessons.length === 0 ? (
              <p className="text-sm text-gray-500">No lessons available.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {orderedLessons.map((lesson, index) => {
                  const isCompleted =
                    lesson.status === ENUM_LESSON_STATUS.COMPLETED
                  const isLocked = isLessonLocked(index)
                  const isOngoing = lesson.status === ENUM_LESSON_STATUS.ONGOING
                  const buttonLabel = isCompleted
                    ? "Watch again"
                    : isOngoing
                      ? "Resume"
                      : "Start"
                  return (
                    <div
                      key={lesson.id}
                      className="relative flex items-center gap-4"
                    >
                      {/* Icon */}
                      <div className="absolute -left-8 z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-purple-100/60 backdrop-blur-sm">
                        {isCompleted && (
                          <CheckCircle2 size={26} className="text-green-500" />
                        )}
                        {!isCompleted && !isLocked && (
                          <CircleDashed size={26} className="text-gray-400" />
                        )}
                        {isLocked && (
                          <Lock size={18} className="text-gray-300" />
                        )}
                      </div>

                      {/* Lesson card */}
                      <div
                        className={`w-full rounded-xl bg-white px-4 py-3.5 shadow-xs ${
                          isLocked ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                isLocked ? "text-gray-400" : "text-gray-800"
                              }`}
                            >
                              {index + 1}. {lesson.lesson_title}
                            </p>
                            <div className="mt-1 flex items-center gap-1 text-gray-400">
                              <Clock size={12} />
                              <span className="text-xs">
                                {lesson.lesson_duration}
                              </span>
                            </div>
                          </div>

                          {!isCompleted && isOngoing && !isLocked && (
                            <span className="shrink-0 text-xs font-semibold text-primary">
                              Ongoing
                            </span>
                          )}
                          {!isLocked && (
                            <Button
                              href={`/modules/${moduleId}/lessons/${lesson.id}`}
                              variant="outline"
                              size="sm"
                              loading={isOngoing && !isCompleted}
                              className="shrink-0 border-primary/40 px-4 text-primary"
                            >
                              {buttonLabel}
                            </Button>
                          )}

                          {!isCompleted && isLocked && (
                            <span className="shrink-0 text-xs font-semibold text-gray-400">
                              Complete previous lesson first
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
