"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"
import { useAuthContext } from "@/context"
import { useQueryDashboardStatistics } from "@/services/module-lesson/queries"
import { useQueryModules } from "@/services/module-lesson/queries"
import { ROUTE_KEYS } from "@/lib/constants"
import { ProfileHero } from "./_components/profile-hero"
import { BadgeGrid } from "./_components/badge-grid"

export default function ProfilePage() {
  const { activeUser } = useAuthContext()

  const { data: statsData, isLoading: isLoadingStats } =
    useQueryDashboardStatistics({
      queryParams: {
        user_id: activeUser?.id?.toString() ?? "",
      },
    })

  const { data: modulesData, isLoading: isLoadingModules } = useQueryModules({})

  const stats = statsData?.data
  const modules = useMemo(
    () =>
      [...(modulesData?.data ?? [])].sort(
        (a, b) => a.sequence_num - b.sequence_num
      ),
    [modulesData?.data]
  )

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
      <Navbar />

      <div className="mx-auto max-w-3xl px-5 py-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href={ROUTE_KEYS.SETTINGS}
            className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 transition-colors hover:text-primary"
          >
            <ChevronLeft size={16} />
            Back
          </Link>
        </div>

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
            modules={modules}
            badgesEarned={stats?.badges_earned ?? 0}
            ageGroup={activeUser?.age_group ?? "4–6"}
            isLoading={isLoadingModules || isLoadingStats}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}
