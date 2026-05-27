"use client"

import { Clock, LibraryBig, ChevronLeft, ChevronRight, Lock, Sparkles } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LessonLimitModal } from "@/components/modals/lesson-limit-modal"
import { notFound, useRouter } from "next/navigation"
import { use, useMemo, useEffect, useCallback, useRef, useState } from "react"
import type { SyntheticEvent } from "react"
import {
  useQueryModules,
  useQueryModuleLessons,
  useQueryCheckEnrolled,
  useQueryCanWatch,
  fetchCanWatch,
} from "@/services/module-lesson/queries"
import { useAuthContext } from "@/context"
import { SubscriptionStatus } from "@/types/subscription"
import type { LessonsType } from "@/types/lesson"
import { Skeleton } from "@/components/skeleton"
import Footer from "@/components/footer/footer"
import { useMutateRecordLesson } from "@/services/module-lesson/mutations"

// ─── paywall inline (replaces the video player when canWatch === false) ───────

function LessonPaywall({ onSubscribe }: { onSubscribe: () => void }) {
  return (
    <div className="mx-3 mb-4 flex h-[clamp(280px,65dvh,700px)] items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-violet-950 to-slate-900 shadow-lg sm:mx-5">
      <div className="max-w-xs px-6 text-center">
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-white/10">
          <Lock size={36} className="text-white/80" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">Lesson Locked</h3>
        <p className="mb-7 text-sm leading-relaxed text-purple-200">
          You&apos;ve reached your free lesson limit. Subscribe to unlock all
          lessons and keep learning.
        </p>
        <Button
          type="button"
          onClick={onSubscribe}
          className="h-11 rounded-full bg-white px-8 font-bold text-violet-900 hover:bg-purple-50"
        >
          <Sparkles size={15} className="mr-1.5 text-violet-700" />
          Subscribe Now
        </Button>
      </div>
    </div>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────

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

  /** Progress recording — only used during playback, not for access checks */
  const { mutate: recordLessonProgress } = useMutateRecordLesson({})

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

  const isEnrolled = enrolledData?.data?.enrolled ?? false

  // ── lesson index & data ────────────────────────────────────────────────────

  const lessonIndex = useMemo(
    () => lessons.findIndex((l) => String(l.id) === lessonId),
    [lessons, lessonId]
  )
  const lesson = useMemo(
    () => lessons[lessonIndex] ?? null,
    [lessons, lessonIndex]
  )

  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null
  const nextLesson =
    lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null

  // ── can-watch gate check (current lesson) ─────────────────────────────────
  //
  // Fires automatically once lesson + enrolment data are ready.
  // Each lesson gets its own cache entry because the key is derived from
  // the queryParams (see useQueryCanWatch definition in queries.ts).
  const {
    data: canWatchData,
    isLoading: isCanWatchLoading,
    isFetched: isCanWatchFetched,
  } = useQueryCanWatch({
    queryParams: lesson
      ? { lesson_id: String(lesson.id), module_id: moduleId }
      : undefined,
    enabled: !!lesson && isEnrolled,
  })

  // Derive a stable three-state value the UI can branch on
  type AccessState = "checking" | "granted" | "denied"
  const accessState: AccessState =
    !isCanWatchFetched || isCanWatchLoading
      ? "checking"
      : canWatchData?.data?.canWatch
        ? "granted"
        : "denied"

  // ── Next-button state ──────────────────────────────────────────────────────
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [isCheckingNext, setIsCheckingNext] = useState(false)

  // ── video playback tracking ────────────────────────────────────────────────
  const videoDurationRef = useRef(0)
  const lastTrackedSecondRef = useRef(0)
  const lastRecordedRateRef = useRef(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [watchedRate, setWatchedRate] = useState(0)

  // ── guards ─────────────────────────────────────────────────────────────────

  // No subscription → /modules
  useEffect(() => {
    if (!modulesLoading && lessonModule && !isAccessible) {
      router.replace("/modules")
    }
  }, [modulesLoading, lessonModule, isAccessible, router])

  // Not enrolled → back to module page
  useEffect(() => {
    if (!enrolledLoading && !isEnrolled && isAccessible && lessonModule) {
      router.replace(`/modules/${moduleId}`)
    }
  }, [
    enrolledLoading,
    isEnrolled,
    isAccessible,
    lessonModule,
    moduleId,
    router,
  ])

  // ── reset playback tracking when lesson changes ────────────────────────────
  useEffect(() => {
    videoDurationRef.current = 0
    lastTrackedSecondRef.current = 0
    lastRecordedRateRef.current = 0
    setWatchedRate(0)
  }, [lessonId])

  // ── seed watchedRate from persisted completion_rate ────────────────────────
  useEffect(() => {
    if (!lesson) return
    const initialRate = Math.max(0, Math.min(100, lesson.completion_rate ?? 0))
    lastRecordedRateRef.current = initialRate
    setWatchedRate(initialRate)
  }, [lesson])

  // ── dispose video on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      const video = videoRef.current
      if (!video) return
      video.pause()
      video.src = ""
      video.load()
    }
  }, [])

  // ── playback handlers ──────────────────────────────────────────────────────

  const handleVideoTimeUpdate = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      if (!lesson) return

      const seconds = Math.floor(event.currentTarget.currentTime)
      if (seconds <= lastTrackedSecondRef.current) return

      lastTrackedSecondRef.current = seconds

      const duration =
        videoDurationRef.current ||
        Math.floor(event.currentTarget.duration || 0)

      if (!duration) return
      videoDurationRef.current = duration

      const completionRate = Math.min(
        100,
        Math.max(0, Math.floor((seconds / duration) * 100))
      )

      setWatchedRate((prev) => Math.max(prev, completionRate))

      if (completionRate <= lastRecordedRateRef.current) return

      const shouldSync =
        completionRate === 100 ||
        completionRate - lastRecordedRateRef.current >= 5

      if (!shouldSync) return

      recordLessonProgress({
        lesson_id: lesson.id,
        module_id: moduleId,
        completion_rate: completionRate,
      })

      lastRecordedRateRef.current = completionRate
    },
    [lesson, moduleId, recordLessonProgress]
  )

  const handleVideoLoadedMetadata = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      if (!lesson) return

      const duration = Math.floor(event.currentTarget.duration || 0)
      videoDurationRef.current = duration

      if (!duration) return

      const resumeFromCompletion = Math.floor(
        (Math.max(0, Math.min(99, lesson.completion_rate ?? 0)) / 100) *
          duration
      )

      const resumeSecond = resumeFromCompletion
      if (resumeSecond <= 0 || resumeSecond >= duration - 3) return

      event.currentTarget.currentTime = resumeSecond
      lastTrackedSecondRef.current = resumeSecond
    },
    [lesson]
  )

  const handleVideoEnded = useCallback(() => {
    setWatchedRate(100)
    if (!lesson || lastRecordedRateRef.current >= 100) return

    recordLessonProgress({
      lesson_id: lesson.id,
      module_id: moduleId,
      completion_rate: 100,
    })

    lastRecordedRateRef.current = 100
  }, [lesson, moduleId, recordLessonProgress])

  const handleGoBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }
    router.push(`/modules/${moduleId}`)
  }, [moduleId, router])

  // ── Next button handler ────────────────────────────────────────────────────
  //
  // Calls GET /user/lessons/can-watch for the NEXT lesson before navigating.
  // canWatch === true  → navigate
  // canWatch === false → show the limit modal instead

  const handleNextLesson = useCallback(async () => {
    if (!nextLesson) {
      router.push(`/modules/${moduleId}`)
      return
    }

    setIsCheckingNext(true)
    try {
      const res = await fetchCanWatch(nextLesson.id, moduleId)
      if (res.data.canWatch) {
        router.push(`/modules/${moduleId}/lessons/${nextLesson.id}`)
      } else {
        setShowLimitModal(true)
      }
    } catch {
      // On unexpected API errors, fail open so the user isn't blocked
      router.push(`/modules/${moduleId}/lessons/${nextLesson.id}`)
    } finally {
      setIsCheckingNext(false)
    }
  }, [nextLesson, moduleId, router])

  // ── subscribe redirect ─────────────────────────────────────────────────────
  const handleSubscribe = useCallback(() => {
    router.push("/subscription")
  }, [router])

  // ── not-found guard ────────────────────────────────────────────────────────
  if (!isLoading && !lesson) return notFound()

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-[#EDE6F0]">
      {/* Minimal navbar */}
      <div className="h-[68px] shrink-0" />
      <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <Image src="/images/logo.svg" alt="Safi" width={80} height={28} />
        <button
          type="button"
          onClick={handleGoBack}
          className="flex items-center gap-1 text-sm font-semibold text-gray-700 transition hover:text-primary"
        >
          <ChevronLeft size={16} />
          Back
        </button>
      </div>

      {/* Lesson header */}
      <div className="flex flex-col gap-4 px-3 py-4 sm:flex-row sm:items-start sm:px-5 sm:py-5">
        {/* Left: Lesson info */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">
            {lesson ? `${lessonIndex + 1}. ${lesson.lesson_title}` : null}
          </h1>
          {lesson ? (
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
          ) : (
            <div className="mt-2 space-y-2">
              <Skeleton className="h-5 w-60" />
              <Skeleton className="h-4 w-44" />
            </div>
          )}
        </div>

        {/* Right: About this lesson card */}
        {lesson ? (
          <div className="rounded-xl bg-white px-4 py-3.5 shadow-xs sm:w-56">
            <h2 className="mb-1.5 text-sm font-bold text-gray-800">
              About this Lesson
            </h2>
            <p className="text-xs leading-relaxed text-gray-600">
              {lesson.lesson_description}
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-white px-4 py-3.5 shadow-xs sm:w-56">
            <Skeleton className="mb-2 h-4 w-28" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-5/6" />
            <Skeleton className="mt-2 h-3 w-2/3" />
          </div>
        )}
      </div>

      {/* ── Main content area ──────────────────────────────────────────────────
           checking  → skeleton (waiting for can-watch response)
           denied    → LessonPaywall (canWatch === false)
           granted   → video player  (canWatch === true)
      ─────────────────────────────────────────────────────────────────────── */}
      {!lesson || accessState === "checking" ? (
        <div className="mx-3 mb-4 h-[clamp(220px,50dvh,560px)] rounded-2xl bg-gray-200 sm:mx-5">
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
      ) : accessState === "denied" ? (
        <LessonPaywall onSubscribe={handleSubscribe} />
      ) : (
        /* accessState === "granted" — canWatch === true */
        <div className="mx-3 mb-4 h-[clamp(280px,65dvh,700px)] overflow-hidden rounded-2xl bg-black shadow-lg sm:mx-5">
          {lesson.video_url ? (
            <video
              ref={videoRef}
              className="h-full w-full object-contain"
              controls
              controlsList="nodownload"
              autoPlay
              playsInline
              poster={lesson.cover_image_url || undefined}
              onLoadedMetadata={handleVideoLoadedMetadata}
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={handleVideoEnded}
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
      )}

      {/* Bottom navigation */}
      <div className="flex items-center justify-between px-3 py-4 sm:px-5 sm:py-5">
        {prevLesson ? (
          <Button
            variant="outline"
            href={`/modules/${moduleId}/lessons/${prevLesson.id}`}
            className="rounded-full border-gray-300 px-5 text-sm font-semibold text-gray-700"
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </Button>
        ) : (
          <div className="w-24" />
        )}

        <div className="text-xs font-semibold text-gray-500">
          {lessonIndex + 1} of {lessons.length}
        </div>

        {/* Next / Back-to-module button */}
        {nextLesson ? (
          <Button
            type="button"
            className="rounded-full px-5 text-sm font-semibold"
            disabled={watchedRate < 90 || isCheckingNext}
            loading={isCheckingNext}
            title={
              watchedRate < 90
                ? "Watch 90% of the video to unlock"
                : undefined
            }
            onClick={handleNextLesson}
          >
            {watchedRate < 90 && !isCheckingNext && (
              <Lock size={13} className="mr-1" />
            )}
            Next
            <ChevronRight size={16} className="ml-1" />
          </Button>
        ) : (
          <Button
            href={`/modules/${moduleId}`}
            className="rounded-full px-5 text-sm font-semibold"
            variant="outline"
          >
            Back to Module
            <ChevronRight size={16} className="ml-1" />
          </Button>
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Limit-exceeded modal (shown when Next pre-check returns canWatch === false) */}
      <LessonLimitModal
        open={showLimitModal}
        onOpenChange={setShowLimitModal}
        onSubscribe={() => {
          setShowLimitModal(false)
          handleSubscribe()
        }}
      />
    </div>
  )
}
