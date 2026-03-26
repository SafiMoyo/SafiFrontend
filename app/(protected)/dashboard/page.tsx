"use client"

import { LibraryBig, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useMemo } from "react"
import { useAuthContext } from "@/context"
import Footer from "@/components/footer/footer"
import Navbar from "@/components/navbar/navbar"
import { useQueryModules } from "@/services/module-lesson/queries"
import { SubscriptionStatus } from "@/types/subscription"
import { getImageUrl } from "@/lib/image-fallback"
import type { ModuleType } from "@/types/module"

export default function DashboardPage() {
  const { activeUser } = useAuthContext()
  const { data, isLoading } = useQueryModules({})
  const modulesData = useMemo(() => data?.data ?? [], [data?.data])

  const hasActiveSubscription =
    activeUser?.subscription?.subscription_status === SubscriptionStatus.ACTIVE

  const moduleLocks = useMemo(() => {
    const sorted = [...modulesData].sort(
      (a, b) => a.sequence_num - b.sequence_num
    )
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
  }, [hasActiveSubscription, modulesData])

  const moduleHref = (module: ModuleType) => {
    const isLocked = moduleLocks[String(module.id)]
    return isLocked ? "/modules" : `/modules/${module.id}`
  }

  const freeModule = useMemo(
    () =>
      modulesData.find(
        (module) => module.module_tier === SubscriptionStatus.FREE
      ) ?? modulesData[0],
    [modulesData]
  )

  const otherModules = useMemo(
    () =>
      modulesData.filter((module) => module.id !== freeModule?.id).slice(0, 3),
    [modulesData, freeModule?.id]
  )

  return (
    <div className="flex min-h-screen flex-col bg-purple-100/40">
      <Navbar />
      {/* Greeting */}
      <div className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-primary">
          Hello, {activeUser?.first_name || "there"}!
        </h1>
        <p className="mt-0.5 text-sm text-gray-500">Ready to explore?</p>
      </div>

      {/* Module 1 card */}
      <div className="mx-5 rounded-2xl bg-white p-5 shadow-xs">
        <h2 className="text-lg font-bold text-gray-900">
          {freeModule?.module_title ?? "Free Module"}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {freeModule?.module_description ??
            "This is your first step to greatness."}
        </p>
        {/* Progress bar */}
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${freeModule?.module_progress ?? 0}%` }}
          />
        </div>
      </div>

      {/* Start learning */}
      <div className="mt-6 px-5">
        <h3 className="mb-3 font-bold text-gray-800">Start learning</h3>

        {/* Featured card */}
        <Link
          href={freeModule ? moduleHref(freeModule) : "/modules"}
          className="block overflow-hidden rounded-2xl"
        >
          <Image
            src={getImageUrl(
              freeModule?.cover_image_url,
              freeModule?.id ?? "free-module",
              800,
              320
            )}
            alt={freeModule?.module_title ?? "Module"}
            width={800}
            height={320}
            className="h-48 w-full object-cover"
            priority
          />
          {/* Card footer */}
          <div className="flex items-center justify-between bg-[#c4a0e0] px-4 py-3">
            <span className="font-semibold text-white">
              {freeModule?.module_title ?? "Start your free module"}
            </span>
            <span className="text-sm text-white/90">
              {freeModule ? `${freeModule.no_of_lessons} lessons` : "--"}
            </span>
          </div>
        </Link>

        {/* View all lessons */}
        <Link
          href={"/modules"}
          className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <LibraryBig size={18} />
          View all modules
        </Link>

        {/* 3 small lesson cards */}
        <div className="mt-3 grid grid-cols-3 gap-2 pb-24">
          {isLoading ? (
            <div className="col-span-3 rounded-xl bg-white px-3 py-4 text-center text-xs text-gray-500">
              Loading modules...
            </div>
          ) : otherModules.length > 0 ? (
            otherModules.map((module) => (
              <Link
                key={module.id}
                href={moduleHref(module)}
                className="overflow-hidden rounded-xl"
              >
                <Image
                  src={getImageUrl(module.cover_image_url, module.id, 400, 200)}
                  alt={module.module_title}
                  width={400}
                  height={200}
                  className="h-24 w-full object-cover"
                />
                {/* Footer */}
                <div className="bg-[#E4D6B3] px-2 py-2">
                  <p className="truncate text-xs font-bold text-gray-800">
                    {module.module_title}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {module.no_of_lessons} lessons
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 rounded-xl bg-white px-3 py-4 text-center text-xs text-gray-500">
              No additional modules available yet.
            </div>
          )}
        </div>
      </div>

      {/* Floating Parent Menu button */}
      <div className="fixed right-5 bottom-6">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-lg"
        >
          <Users size={18} className="text-gray-600" />
          Parent Menu
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
