"use client"

import { CheckCircle2, Clock, Lock, CircleDashed, ChevronLeft } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LessonLimitModal } from "@/components/modals/lesson-limit-modal"
import { useMemo, useEffect, useState, useCallback } from "react"
import { notFound, useRouter } from "next/navigation"
import { use } from "react"
import Footer from "@/components/footer/footer"
import {
  useQueryModules,
  useQueryModuleLessons,
  useQueryCheckEnrolled,
  fetchCanWatch,
} from "@/services/module-lesson/queries"
import { useMutateEnrolModule } from "@/services/module-lesson/mutations"
import { useAuthContext } from "@/context"
import { SubscriptionStatus } from "@/types/subscription"
import { LessonTimelineSkeleton } from "@/components/skeleton"
import { ENUM_LESSON_STATUS } from "@/types/lesson"
import { getImageUrl } from "@/lib/image-fallback"

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
    const lockMap: Record<string, boolean> = {}

    modules.forEach((module) => {
      const isFree = module.module_tier === SubscriptionStatus.FREE
      lockMap[String(module.id)] = !isFree && !hasActiveSubscription
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

  // ── can-watch gate state ───────────────────────────────────────────────────
  /** ID of the lesson currently being checked (shows spinner on that button) */
  const [checkingLessonId, setCheckingLessonId] = useState<
    string | number | null
  >(null)
  const [limitModalOpen, setLimitModalOpen] = useState(false)

  /**
   * Call GET /user/lessons/can-watch before navigating to any lesson.
   * canWatch === true  → navigate
   * canWatch === false → show the limit modal
   */
  const handleStartLesson = useCallback(
    async (lessonId: string | number) => {
      setCheckingLessonId(lessonId)
      try {
        const res = await fetchCanWatch(lessonId, moduleId)
        if (res.data.canWatch) {
          router.push(`/modules/${moduleId}/lessons/${lessonId}`)
        } else {
          setLimitModalOpen(true)
        }
      } catch {
        // Fail open — don't block the user on unexpected API errors
        router.push(`/modules/${moduleId}/lessons/${lessonId}`)
      } finally {
        setCheckingLessonId(null)
      }
    },
    [moduleId, router]
  )

  const handleSubscribe = useCallback(() => {
    router.push("/subscription")
  }, [router])

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
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1 text-sm font-semibold text-gray-700 transition hover:text-primary"
        >
          <ChevronLeft size={16} />
          Back
        </button>
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-5 sm:py-5">
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
                  /* ── "Start / Continue / Resume" CTA — gate-checked ── */
                  <Button
                    type="button"
                    className="px-5"
                    loading={checkingLessonId === nextLesson.id}
                    disabled={checkingLessonId !== null}
                    onClick={() => handleStartLesson(nextLesson.id)}
                  >
                    {nextLesson.status === ENUM_LESSON_STATUS.ONGOING
                      ? "Resume Learning"
                      : completedLessonsCount > 0
                        ? "Continue Learning"
                        : "Start Learning"}
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
                  const isThisChecking = checkingLessonId === lesson.id

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
                        className={`flex h-40 w-full overflow-hidden rounded-xl bg-white shadow-xs sm:h-44 ${
                          isLocked ? "opacity-60" : ""
                        }`}
                      >
                        {/* Cover image — LEFT */}
                        <div className="relative w-36 shrink-0 sm:w-44">
                          <Image
                            src={getImageUrl(
                              lesson.cover_image_url,
                              lesson.id,
                              320,
                              400
                            )}
                            alt={lesson.lesson_title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 144px, 176px"
                          />
                          {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                              <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
                                <Lock size={15} className="text-white" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content — RIGHT */}
                        <div className="flex flex-1 flex-col justify-between gap-2 p-3 sm:p-4">
                          <div>
                            <p
                              className={`text-sm font-semibold leading-snug sm:text-base ${
                                isLocked ? "text-gray-400" : "text-gray-800"
                              }`}
                            >
                              {index + 1}. {lesson.lesson_title}
                            </p>
                            <div className="mt-1.5 flex items-center gap-1 text-gray-400">
                              <Clock size={13} />
                              <span className="text-xs sm:text-sm">
                                {lesson.lesson_duration}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            {!isCompleted && isOngoing && !isLocked && (
                              <span className="text-xs font-semibold text-primary">
                                Ongoing
                              </span>
                            )}
                            {!isCompleted && isLocked && (
                              <span className="text-xs font-semibold text-gray-400">
                                Complete previous lesson first
                              </span>
                            )}
                            {/* ── Start / Resume / Watch-again — gate-checked ── */}
                            {!isLocked && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                loading={isThisChecking}
                                disabled={
                                  checkingLessonId !== null && !isThisChecking
                                }
                                className="ml-auto shrink-0 border-primary/40 px-4 text-xs text-primary"
                                onClick={() => handleStartLesson(lesson.id)}
                              >
                                {buttonLabel}
                              </Button>
                            )}
                          </div>
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

      {/* Limit-exceeded modal */}
      <LessonLimitModal
        open={limitModalOpen}
        onOpenChange={setLimitModalOpen}
        onSubscribe={() => {
          setLimitModalOpen(false)
          handleSubscribe()
        }}
      />
    </div>
  )
}
