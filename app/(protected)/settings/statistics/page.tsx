"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Award,
  BookOpen,
  Flame,
  GraduationCap,
  Timer,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"
import { useAuthContext } from "@/context"
import { useQueryDashboardStatistics } from "@/services/module-lesson/queries"
import { cn } from "@/lib/utils"
import { ROUTE_KEYS } from "@/lib/constants"
import {
  progressWidthSteps,
  WeekDayItem,
  dayLabelMap,
} from "../utils"

function getProgressWidthClass(percent: number) {
  const normalized = Math.max(0, Math.min(100, percent))
  const index = Math.round(normalized / 5)
  return progressWidthSteps[index]
}

function getBarColor(value: number): string {
  if (value === 0) return "#D1D1D1"
  if (value <= 3.5) return "#D68BF7"
  if (value <= 7.5) return "#8900EB"
  return "#4CAF50"
}

function parseProgressRatio(progress: string) {
  const ratioMatch = progress.match(/(\d+)\s*\/\s*(\d+)/)
  if (ratioMatch) {
    const done = Number(ratioMatch[1])
    const total = Number(ratioMatch[2])
    const percent =
      total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0
    return {
      done,
      total,
      percent,
      label: `${done}/${total}`,
    }
  }

  const percentMatch = progress.match(/(\d+)\s*%/)
  if (percentMatch) {
    const percent = Math.min(100, Number(percentMatch[1]))
    return {
      done: percent,
      total: 100,
      percent,
      label: `${percent}%`,
    }
  }

  return {
    done: 0,
    total: 0,
    percent: 0,
    label: "0/0",
  }
}

function formatLastActive(lastActive?: string) {
  if (!lastActive) return "No activity yet"

  const date = new Date(lastActive)
  if (Number.isNaN(date.getTime())) return "No activity yet"

  const now = new Date()
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )
  const startOfActivity = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )

  const diffMs = startOfToday.getTime() - startOfActivity.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

export default function SettingsStatisticsPage() {
  const { activeUser } = useAuthContext()
  const router = useRouter()

  const { data, isLoading } = useQueryDashboardStatistics({
    queryParams: {
      user_id: activeUser?.id?.toString() || "",
    },
  })

  const stats = data?.data

  const totalLessons = stats?.overall_progress?.total_lessons ?? 0
  const lessonsDone = stats?.lessons_done ?? 0
  const ongoingLessons = stats?.overall_progress?.ongoing_lessons ?? 0
  const progressPercent =
    totalLessons > 0 ? Math.round((lessonsDone / totalLessons) * 100) : 0

  const weeklyActivity = useMemo<WeekDayItem[]>(() => {
    const week = stats?.weekly_activity
    if (!week) {
      return Object.keys(dayLabelMap).map((day) => ({
        key: day,
        label: dayLabelMap[day],
        value: 0,
      }))
    }

    return Object.entries(week).map(([day, value]) => ({
      key: day,
      label: dayLabelMap[day] ?? day.slice(0, 3).toUpperCase(),
      value,
    }))
  }, [stats?.weekly_activity])

  const moduleBreakdown = stats?.module_breakdown ?? []

  return (
    <div className="min-h-screen bg-purple-100/20">
      <Navbar />

      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* Learning Journey Header */}
        <div className="mb-8 flex items-center justify-between rounded-lg bg-primary/5 px-5 py-3">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} className="text-gray-800" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Learning Journey
              </h1>
              <p className="text-sm text-gray-600">
                A quick view of progress, consistency, and module completion.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push(ROUTE_KEYS.SETTINGS_PROFILE)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-black transition hover:bg-primary/90"
          >
            {activeUser?.first_name || "User"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 — Day Streak */}
          <div className="flex min-h-56 flex-col items-center justify-center rounded-[16px] border border-[#FFC733] bg-[#F3E6C4] p-5 text-center shadow-sm">
            <p className="mb-3 text-2xl">🔥</p>
            <p className="text-4xl font-extrabold text-gray-900">
              {isLoading ? "--" : (stats?.day_streak ?? 0)}
            </p>
            <p className="mt-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Day Streak
            </p>
          </div>

          {/* Card 2 — Lessons Done */}
          <div className="flex min-h-56 flex-col items-center justify-center rounded-[16px] border border-[#BB2EFA] bg-[#C9A3F2] p-5 text-center shadow-sm">
            <p className="mb-3 text-2xl">📖</p>
            <p className="text-4xl font-extrabold text-gray-900">
              {isLoading ? "--" : lessonsDone}
            </p>
            <p className="mt-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Lessons Done
            </p>
          </div>

          {/* Card 3 — Modules Completed (same as card 1) */}
          <div className="flex min-h-56 flex-col items-center justify-center rounded-[16px] border border-[#FFC733] bg-[#F3E6C4] p-5 text-center shadow-sm">
            <p className="mb-3 text-2xl">🎓</p>
            <p className="text-4xl font-extrabold text-gray-900">
              {isLoading ? "--" : (stats?.modules_completed ?? 0)}
            </p>
            <p className="mt-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Modules Completed
            </p>
          </div>

          {/* Card 4 — Badges (same as card 2) */}
          <div className="flex min-h-56 flex-col items-center justify-center rounded-[16px] border border-[#BB2EFA] bg-[#C9A3F2] p-5 text-center shadow-sm">
            <p className="mb-3 text-2xl">🏅</p>
            <p className="text-4xl font-extrabold text-gray-900">
              {isLoading ? "--" : (stats?.badges_earned ?? 0)}
            </p>
            <p className="mt-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Badges
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Overall progress
              </h2>
              <p className="font-semibold text-primary">{progressPercent}%</p>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-purple-100">
              <div
                className={cn(
                  "h-full rounded-full bg-primary transition-all",
                  getProgressWidthClass(progressPercent)
                )}
              />
            </div>

            <p className="mt-3 text-sm text-gray-600">
              {lessonsDone} lesson{lessonsDone === 1 ? "" : "s"} of{" "}
              {totalLessons} completed
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {ongoingLessons} ongoing lesson{ongoingLessons === 1 ? "" : "s"}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Weekly Activities
              </h2>
              <p className="text-sm font-semibold text-gray-700">
                Avg {stats?.average_session || "0 mins/day"}
              </p>
            </div>

            <div className="flex h-44 items-end justify-between gap-2">
              {weeklyActivity.map((day) => {
                const clamped = Math.min(Math.max(day.value, 0), 10)
                const heightPct = (clamped / 10) * 100

                return (
                  <div
                    key={day.key}
                    className="flex w-full flex-col items-center gap-2"
                  >
                    <div
                      className="w-full max-w-8 transition-all"
                      style={{
                        height: `${heightPct}%`,
                        minHeight: clamped > 0 ? 4 : 8,
                        backgroundColor: getBarColor(clamped),
                        borderRadius: 4,
                      }}
                      title={`${day.key}: ${day.value}`}
                    />
                    <p className="text-[10px] font-semibold tracking-wide text-gray-500">
                      {day.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold text-gray-900">
              Module Breakdown
            </h2>

            <div className="space-y-4">
              {moduleBreakdown.length === 0 ? (
                <div className="rounded-xl bg-purple-50 p-4 text-sm text-gray-600">
                  No module activity yet. Start a module to see your progress
                  here.
                </div>
              ) : (
                moduleBreakdown.map((module) => {
                  const ratio = parseProgressRatio(module.progress)
                  const isComplete =
                    ratio.total > 0 && ratio.done >= ratio.total

                  return (
                    <div
                      key={module.module_id}
                      className="rounded-xl border border-purple-100 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="truncate font-semibold text-gray-900">
                          {module.module_title}
                        </p>
                        <p className="text-sm font-semibold text-gray-600">
                          {ratio.label}
                        </p>
                      </div>

                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-purple-100">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            getProgressWidthClass(ratio.percent),
                            isComplete ? "bg-green-500" : "bg-primary"
                          )}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold text-gray-900">Insights</h2>

            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Timer size={16} className="text-primary" />
                Last active: {formatLastActive(stats?.last_active)}
              </li>
              <li className="flex items-center gap-2">
                <Award size={16} className="text-primary" />
                {stats?.badges_earned ?? 0} badge
                {(stats?.badges_earned ?? 0) === 1 ? "" : "s"} earned
              </li>
              <li className="flex items-center gap-2">
                <Flame size={16} className="text-primary" />
                {stats?.day_streak ?? 0}-day learning streak
              </li>
              <li className="flex items-center gap-2">
                <BookOpen size={16} className="text-primary" />
                Avg. session: {stats?.average_session || "N/A"}
              </li>
              <li className="flex items-center gap-2">
                <GraduationCap size={16} className="text-primary" />
                Level: {stats?.age_group || "Not set"}
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Next goal: Complete one more module this week
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
