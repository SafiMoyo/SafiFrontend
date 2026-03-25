"use client"

import { Lock, Video, ChevronLeft } from "lucide-react"
import Image from "next/image"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useQueryModules } from "@/services/module-lesson/queries"
import { SubscriptionStatus } from "@/types/subscription"
import { useAuthContext } from "@/context"
import { getImageUrl } from "@/lib/image-fallback"
import Footer from "@/components/footer/footer"
import Navbar from "@/components/navbar/navbar"
import { ModuleListSkeleton } from "@/components/skeleton"

export default function ModulesPage() {
  const { activeUser } = useAuthContext()
  const { data, isLoading } = useQueryModules({})
  const modulesData = useMemo(() => data?.data ?? [], [data?.data])

  const hasActiveSubscription =
    activeUser?.subscription?.subscription_status === SubscriptionStatus.ACTIVE

  return (
    <div className="flex min-h-screen flex-col bg-purple-100/50">
      <Navbar />

      {/* Header bar */}
      <div className="bg-purple-200">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-5 py-3">
          <Button variant="ghost" href="/dashboard" className="p-1">
            <ChevronLeft size={20} />
          </Button>
          <Video size={20} className="text-primary" />
          <h1 className="text-base font-bold text-gray-800">All Modules</h1>
        </div>
      </div>

      {/* Module list */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-5">
        {isLoading ? (
          <ModuleListSkeleton />
        ) : modulesData.length === 0 ? (
          <div className="mt-12 text-center text-sm text-gray-500">
            No modules available yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {modulesData.map((module) => {
              const isFree = module.module_tier === SubscriptionStatus.FREE
              const isLocked = !isFree && !hasActiveSubscription

              return (
                <div
                  key={module.id}
                  className={`flex h-40 overflow-hidden rounded-2xl bg-white shadow-xs transition-shadow hover:shadow-md ${
                    isLocked ? "opacity-80" : ""
                  }`}
                >
                  {/* Cover image — LEFT */}
                  <div className="relative w-32 shrink-0 sm:w-40">
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
                      sizes="(max-width: 640px) 128px, 160px"
                    />
                    {/* Lock overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                        <div className="flex size-9 items-center justify-center rounded-full bg-white/20">
                          <Lock size={18} className="text-white" />
                        </div>
                      </div>
                    )}
                    {/* Sequence badge */}
                    {/* <div className="absolute top-2 left-2 flex size-6 items-center justify-center rounded-full bg-white/90 text-[10px] font-bold text-primary shadow-sm">
                      {module.sequence_num}
                    </div> */}
                  </div>

                  {/* Content — RIGHT */}
                  <div className="flex flex-1 flex-col justify-between gap-2 p-3.5 sm:p-4">
                    <div>
                      <h2
                        className={`text-sm leading-snug font-bold sm:text-base ${
                          isLocked ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {module.module_title}
                      </h2>
                      <p
                        className={`mt-1 line-clamp-2 text-xs leading-relaxed ${
                          isLocked ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {module.module_description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          isLocked ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <Video size={11} />
                        <span>{module.no_of_lessons} lessons</span>
                      </div>

                      {isLocked ? (
                        <Button
                          href="/subscription"
                          size="sm"
                          variant="outline"
                          className="h-7 border-primary/30 px-3 text-xs text-primary/70"
                        >
                          <Lock size={10} className="mr-1" />
                          Unlock
                        </Button>
                      ) : (
                        <Button
                          href={`/modules/${module.id}`}
                          size="sm"
                          className="h-7 px-3 text-xs"
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
