"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
} from "recharts"
import { Users, Handshake, BookOpen, CheckCircle, Layers } from "lucide-react"
import {
  useAdminDashboardOverview,
  useAdminUserActivity,
  useAdminTopLessons,
  useAdminFinancialAnalysis,
} from "@/services/admin-auth/queries"

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2]

function formatNaira(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`
  return `₦${n.toLocaleString()}`
}

// Circular donut for course completion
function DonutChart({ pct }: { pct: number }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx={70} cy={70} r={r} fill="none" stroke="#f3e8ff" strokeWidth={14} />
      <circle
        cx={70}
        cy={70}
        r={r}
        fill="none"
        stroke="url(#donutGrad)"
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <defs>
        <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8900eb" />
          <stop offset="100%" stopColor="#bb2efa" />
        </linearGradient>
      </defs>
      <text x={70} y={70} textAnchor="middle" dominantBaseline="central" className="fill-gray-900 text-[22px] font-black" style={{ fontSize: 22, fontWeight: 900, fill: "#111827" }}>
        {Math.round(pct)}%
      </text>
    </svg>
  )
}

function YearSelector({
  value,
  onChange,
}: {
  value: number
  onChange: (y: number) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-extrabold text-gray-600 outline-none focus:border-primary"
    >
      {YEAR_OPTIONS.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  )
}

export default function AdminOverviewPage() {
  const [activityYear, setActivityYear] = useState(CURRENT_YEAR)
  const [financialYear, setFinancialYear] = useState(CURRENT_YEAR)

  const { data: overviewRes, isLoading: loadingOverview } =
    useAdminDashboardOverview()
  const { data: activityRes, isLoading: loadingActivity } =
    useAdminUserActivity(activityYear)
  const { data: lessonsRes, isLoading: loadingLessons } = useAdminTopLessons()
  const { data: financialRes, isLoading: loadingFinancial } =
    useAdminFinancialAnalysis(financialYear)

  const overview = overviewRes?.data
  const activityData = activityRes?.data?.monthly_active_users ?? []
  const topLessons = lessonsRes?.data ?? []
  const financialData = financialRes?.data?.monthly_data ?? []

  const completionPct = overview
    ? overview.total_lessons > 0
      ? (overview.total_completed_lessons / overview.total_lessons) * 100
      : 0
    : 0

  const maxViews = Math.max(...topLessons.map((l) => l.view_count), 1)

  const statCards = [
    {
      label: "Total Students",
      value: overview?.total_students ?? 0,
      icon: Users,
    },
    {
      label: "Total Partners",
      value: overview?.total_partners ?? 0,
      icon: Handshake,
    },
    {
      label: "Total Lessons",
      value: overview?.total_lessons ?? 0,
      icon: BookOpen,
    },
    {
      label: "Completed Lessons",
      value: overview?.total_completed_lessons ?? 0,
      icon: CheckCircle,
      highlight: true,
    },
    {
      label: "Total Modules",
      value: overview?.total_modules ?? 0,
      icon: Layers,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Overview
        </h1>
        <p className="mt-1 text-sm font-semibold text-gray-500">
          Platform-wide snapshot
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map(({ label, value, icon: Icon, highlight }) => (
          <div
            key={label}
            className={`rounded-[18px] border p-4 shadow-[0_12px_28px_rgba(16,24,40,0.05)] sm:p-5 ${
              highlight
                ? "border-transparent bg-gradient-to-br from-primary to-[#bb2efa] text-white"
                : "border-gray-200 bg-white"
            }`}
          >
            <div
              className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
                highlight ? "bg-white/20" : "bg-purple-50"
              }`}
            >
              <Icon
                size={17}
                className={highlight ? "text-white" : "text-primary"}
              />
            </div>
            <p
              className={`text-2xl font-black tracking-tight ${
                highlight ? "text-white" : "text-gray-900"
              }`}
            >
              {loadingOverview ? "—" : value.toLocaleString()}
            </p>
            <p
              className={`mt-1 text-xs font-extrabold uppercase tracking-wide ${
                highlight ? "text-white/80" : "text-gray-500"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        {/* User Activities */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.07)]">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                User Activities
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-gray-500">
                Monthly active users
              </p>
            </div>
            <YearSelector value={activityYear} onChange={setActivityYear} />
          </div>
          <div className="p-5">
            {loadingActivity ? (
              <div className="flex h-[180px] items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart
                  data={activityData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="activityGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#8900eb"
                        stopOpacity={0.18}
                      />
                      <stop
                        offset="95%"
                        stopColor="#8900eb"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month_label"
                    tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #f3f4f6",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    formatter={(v) => [v, "Active Users"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="active_users"
                    stroke="#8900eb"
                    strokeWidth={2.5}
                    fill="url(#activityGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#8900eb" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Course Completion */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.07)]">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-extrabold text-gray-900">
              Course Completion
            </h2>
            <p className="mt-0.5 text-xs font-semibold text-gray-500">
              Lessons completed vs total
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 p-6">
            {loadingOverview ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <>
                <DonutChart pct={completionPct} />
                <div className="flex w-full flex-col gap-2 text-center">
                  <div className="flex justify-around text-xs font-extrabold text-gray-500">
                    <span>
                      <span className="block text-xl font-black text-gray-900">
                        {overview?.total_completed_lessons ?? 0}
                      </span>
                      Completed
                    </span>
                    <span>
                      <span className="block text-xl font-black text-gray-900">
                        {(overview?.total_lessons ?? 0) -
                          (overview?.total_completed_lessons ?? 0)}
                      </span>
                      Remaining
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Performing Courses */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.07)]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Top Performing Courses
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-gray-500">
                Ranked by view count
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-5">
            {loadingLessons ? (
              <div className="flex h-24 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : topLessons.length === 0 ? (
              <p className="py-8 text-center text-sm font-semibold text-gray-400">
                No data yet.
              </p>
            ) : (
              topLessons.map((lesson) => (
                <div key={lesson.lesson_id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-gray-900">
                        {lesson.lesson_title}
                      </p>
                      <p className="truncate text-xs font-semibold text-gray-400">
                        {lesson.module_title}
                      </p>
                    </div>
                    <span className="ml-3 shrink-0 text-xs font-extrabold text-gray-500">
                      {lesson.view_count} views
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-[#bb2efa] transition-all"
                      style={{
                        width: `${Math.max((lesson.view_count / maxViews) * 100, lesson.view_count > 0 ? 4 : 0)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Financial Analysis */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.07)]">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Financial Analysis
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-gray-500">
                Revenue &amp; courses sold
              </p>
            </div>
            <YearSelector value={financialYear} onChange={setFinancialYear} />
          </div>
          <div className="p-5">
            {loadingFinancial ? (
              <div className="flex h-[180px] items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={financialData}
                  margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                  barCategoryGap="30%"
                  barGap={3}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="month_label"
                    tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="revenue"
                    tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (v >= 1000 ? `₦${v / 1000}k` : `₦${v}`)}
                  />
                  <YAxis
                    yAxisId="sold"
                    orientation="right"
                    tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #f3f4f6",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    formatter={(value, name) =>
                      name === "total_revenue"
                        ? [formatNaira(Number(value)), "Total Revenue"]
                        : [value, "Courses Sold"]
                    }
                  />
                  <Legend
                    formatter={(v) =>
                      v === "total_revenue" ? "Total Revenue" : "Courses Sold"
                    }
                    wrapperStyle={{ fontSize: 11, fontWeight: 700 }}
                  />
                  <Bar
                    yAxisId="revenue"
                    dataKey="total_revenue"
                    fill="#8900eb"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="sold"
                    dataKey="courses_sold"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
