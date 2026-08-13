"use client"

import { Lock, Video, ChevronLeft } from "lucide-react"
import Image from "next/image"
import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useQueryModules } from "@/services/module-lesson/queries"
import { SubscriptionStatus } from "@/types/subscription"
import { useAuthContext } from "@/context"
import { getImageUrl } from "@/lib/image-fallback"
import Footer from "@/components/footer/footer"
import { ModuleListSkeleton } from "@/components/skeleton"

export default function ModulesPage() {
  const { activeUser } = useAuthContext()
  const router = useRouter()
  const { data, isLoading } = useQueryModules({})
  const modulesData = useMemo(() => data?.data ?? [], [data?.data])

  const hasActiveSubscription =
    activeUser?.subscription?.subscription_status === SubscriptionStatus.ACTIVE

  const moduleLocks = useMemo(() => {
    const sorted = [...modulesData].sort(
      (a, b) => a.sequence_num - b.sequence_num
    )
    const lockMap: Record<
      string,
      {
        isLocked: boolean
        isSubscriptionLocked: boolean
        isSequenceLocked: boolean
      }
    > = {}
    const completedById: Record<string, boolean> = {}

    sorted.forEach((module) => {
      completedById[String(module.id)] = module.module_progress >= 100
    })

    sorted.forEach((module, index) => {
      const isFree = module.module_tier === SubscriptionStatus.FREE
      const subscriptionLocked = !isFree && !hasActiveSubscription
      const prev = sorted[index - 1]
      const previousCompleted = prev ? completedById[String(prev.id)] : true
      const isSequenceLocked = !previousCompleted

      lockMap[String(module.id)] = {
        isLocked: subscriptionLocked || isSequenceLocked,
        isSubscriptionLocked: subscriptionLocked,
        isSequenceLocked,
      }
    })

    return lockMap
  }, [hasActiveSubscription, modulesData])

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

      {/* Header bar */}
      <div style={{ backgroundColor: "#D68BF7" }}>
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-5 py-3">
          <h1 className="text-base font-bold text-gray-800">Modules</h1>
        </div>
      </div>

      {/* Module list */}
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-5">
        {isLoading ? (
          <ModuleListSkeleton />
        ) : modulesData.length === 0 ? (
          <div className="mt-12 text-center text-sm text-gray-500">
            No modules available yet.
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {modulesData.map((module) => {
              const lockState = moduleLocks[String(module.id)]
              const isLocked = lockState?.isLocked ?? false

              const href = isLocked
                  ? lockState?.isSubscriptionLocked
                    ? "/subscription"
                    : "/modules"
                  : `/modules/${module.id}`

              return (
                <div
                  key={module.id}
                  onClick={() => router.push(href)}
                  className={`flex cursor-pointer overflow-hidden rounded-2xl bg-white shadow-xs transition-shadow hover:shadow-md ${
                    isLocked ? "opacity-80" : ""
                  }`}
                >
                  {/* Cover image — LEFT */}
                  <div className="relative w-28 shrink-0 self-stretch sm:w-48">
                    <Image
                      src={getImageUrl(
                        module.cover_image_url,
                        module.id,
                        320,
                        400
                      )}
                      alt={module.module_title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 112px, 192px"
                    />
                    {/* Lock overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                        <div className="flex size-9 items-center justify-center rounded-full bg-white/20">
                          <Lock size={18} className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content — RIGHT */}
                  <div className="flex flex-1 flex-col justify-between gap-2 p-3 sm:p-4">
                    <div>
                      <h2
                        className={`text-sm leading-snug font-bold sm:text-base ${
                          isLocked ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {module.module_title}
                      </h2>
                      <p
                        className={`mt-1 line-clamp-3 text-xs leading-relaxed ${
                          isLocked ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {module.module_description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-y-2">
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          isLocked ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <Video size={11} />
                        <span>
                          {module.no_of_lessons}{" "}
                          {module.no_of_lessons === 1 ? "lesson" : "lessons"}
                        </span>
                      </div>

                      {isLocked ? (
                        <Button
                          href={
                            lockState?.isSubscriptionLocked
                              ? "/subscription"
                              : "/modules"
                          }
                          size="sm"
                          variant="outline"
                          className="h-7 border-primary/30 px-2.5 text-xs text-primary/70"
                        >
                          {lockState?.isSubscriptionLocked ? (
                            <>
                              <Lock size={10} className="mr-1" />
                              Unlock
                            </>
                          ) : (
                            "Complete Prev"
                          )}
                        </Button>
                      ) : (
                        <Button
                          href={`/modules/${module.id}`}
                          size="sm"
                          className="h-7 px-2.5 text-xs"
                        >
                          View Module
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
