"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import Footer from "@/components/footer/footer"
import { useAuthContext } from "@/context"
import { useQueryDashboardStatistics } from "@/services/module-lesson/queries"
import { ROUTE_KEYS } from "@/lib/constants"
import { ProfileHero } from "./_components/profile-hero"
import { BadgeGrid } from "./_components/badge-grid"

export default function ProfilePage() {
  const { activeUser } = useAuthContext()
  const router = useRouter()

  const { data: statsData, isLoading: isLoadingStats } =
    useQueryDashboardStatistics({
      queryParams: {
        user_id: activeUser?.id?.toString() ?? "",
      },
    })

  const stats = statsData?.data

  const displayName =
    [activeUser?.first_name, activeUser?.last_name].filter(Boolean).join(" ") ||
    "User"

  const memberSince = activeUser?.date_created
    ? new Date(activeUser.date_created).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "N/A"

  return (
    <div className="min-h-screen bg-purple-100/40">
      {/* Minimal navbar */}
      <div className="h-[68px] shrink-0" />
      <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-white px-6 py-4">
        <Image src="/images/logo.svg" alt="Safi" width={80} height={28} />
        <button
          type="button"
          onClick={() => router.push(ROUTE_KEYS.SETTINGS)}
          className="flex items-center gap-1 text-sm font-semibold text-gray-700 transition hover:text-primary"
        >
          <ChevronLeft size={16} />
          Back
        </button>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-8">
        {/* Profile hero card */}
        <ProfileHero
          displayName={displayName}
          memberSince={memberSince}
          profilePicture={activeUser?.profile_picture ?? null}
          dayStreak={stats?.day_streak ?? 0}
          modulesCompleted={stats?.modules_completed ?? 0}
          isLoading={isLoadingStats}
        />

        {/* Badges section */}
        <div className="mt-8">
          <h2 className="mb-5 text-2xl font-extrabold text-gray-900">Badges</h2>

          <BadgeGrid
            badges={stats?.badges ?? []}
            isLoading={isLoadingStats}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}
