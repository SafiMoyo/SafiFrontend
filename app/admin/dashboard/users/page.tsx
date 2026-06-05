"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react"
import {
  useAdminUsersOverview,
  useAdminAllUsers,
  type AdminUser,
} from "@/services/admin-auth/queries"

function StatRingCard({
  label,
  value,
  total,
  color,
}: {
  label: string
  value: number
  total: number
  color: string
}) {
  const r = 26
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? (value / total) * 100 : 0
  const offset = circ * (1 - pct / 100)

  return (
    <div className="flex items-center gap-4 rounded-[18px] bg-gradient-to-br from-primary to-[#bb2efa] p-5 text-white shadow-[0_12px_28px_rgba(137,0,235,0.22)]">
      <svg width={68} height={68} viewBox="0 0 68 68" className="shrink-0">
        <circle
          cx={34}
          cy={34}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={7}
        />
        <circle
          cx={34}
          cy={34}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 34 34)"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        <foreignObject x={17} y={17} width={34} height={34}>
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <span style={{ fontSize: 12, fontWeight: 900, color: "white" }}>
              {value}
            </span>
          </div>
        </foreignObject>
      </svg>
      <div>
        <p className="text-2xl font-black">{value.toLocaleString()}</p>
        <p className="mt-0.5 text-xs font-extrabold uppercase tracking-wide text-white/60">
          {label}
        </p>
      </div>
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (p: number) => void
}) {
  if (totalPages <= 1) return null

  const pages: (number | "…")[] = []
  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) pages.push(i)
  } else {
    const left = Math.max(1, page - 1)
    const right = Math.min(totalPages - 2, page + 1)
    pages.push(0)
    if (left > 1) pages.push("…")
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < totalPages - 2) pages.push("…")
    pages.push(totalPages - 1)
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-extrabold text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-700"
      >
        <ChevronLeft size={14} /> Prev
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-xs text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold transition ${
              p === page
                ? "bg-primary text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {(p as number) + 1}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-extrabold text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-700"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  )
}

function UserAvatar({ user }: { user: AdminUser }) {
  const initial = user.first_name?.[0]?.toUpperCase() ?? "?"
  if (user.profile_picture) {
    return (
      <img
        src={user.profile_picture}
        alt={user.first_name}
        className="h-9 w-9 rounded-full object-cover"
      />
    )
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
      {initial}
    </div>
  )
}

function SubBadge({ status }: { status: string }) {
  const isPremium = status === "PREMIUM"
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold ${
        isPremium
          ? "bg-emerald-50 text-emerald-600"
          : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
      }`}
    >
      {status}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<"active" | "inactive" | "new" | null>(null)

  const STATUS_PARAM: Record<string, string> = {
    active: "ACTIVE",
    inactive: "INACTIVE",
    new: "NEW",
  }

  const { data: overviewRes, isLoading: loadingOverview } =
    useAdminUsersOverview()
  const { data: usersRes, isLoading: loadingUsers } = useAdminAllUsers(
    page,
    10,
    activeFilter ? STATUS_PARAM[activeFilter] : undefined
  )

  const overview = overviewRes?.data
  const userPage = usersRes?.data
  const allUsers = userPage?.content ?? []
  const totalPages = userPage?.total_pages ?? 1
  const totalElements = userPage?.total_elements ?? 0

  const filteredUsers = allUsers.filter((u) => {
    if (!search) return true
    const name = `${u.first_name} ${u.last_name}`.toLowerCase()
    return (
      name.includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
  })

  const statCards = [
    {
      label: "No. of Students",
      value: overview?.total_students ?? 0,
      total: Math.max(overview?.total_students ?? 1, 1),
      color: "#f97316",
    },
    {
      label: "No. of Inactive Students",
      value: overview?.inactive_students ?? 0,
      total: Math.max(overview?.total_students ?? 1, 1),
      color: "#ef4444",
    },
    {
      label: "No. of Active Students",
      value: overview?.active_students ?? 0,
      total: Math.max(overview?.total_students ?? 1, 1),
      color: "#22c55e",
    },
    {
      label: "No. of New Students",
      value: overview?.new_students ?? 0,
      total: Math.max(overview?.total_students ?? 1, 1),
      color: "#eab308",
    },
  ]

  function toggleFilter(key: "inactive" | "active" | "new") {
    setActiveFilter((prev) => (prev === key ? null : key))
    setPage(0)
  }

  function handlePageChange(p: number) {
    setPage(p)
    setSearch("")
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Students
        </h1>
        <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
          Manage all platform users
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search
            size={15}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm font-semibold text-gray-700 outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-extrabold text-gray-500 dark:text-gray-400">
            <SlidersHorizontal size={13} /> Filter
          </span>
          {(["active", "inactive", "new"] as const).map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-extrabold text-gray-600 dark:text-gray-300"
            >
              <input
                type="checkbox"
                checked={activeFilter === key}
                onChange={() => toggleFilter(key)}
                className="h-4 w-4 rounded accent-primary"
              />
              <span className="capitalize">{key}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatRingCard
            key={card.label}
            label={card.label}
            value={loadingOverview ? 0 : card.value}
            total={card.total}
            color={card.color}
          />
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.07)] dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
            All Students
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
            {totalElements} student{totalElements !== 1 ? "s" : ""} total
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                {[
                  "Name",
                  "Email Address",
                  "Age Group",
                  "Subscription",
                  "Registered",
                ].map((h) => (
                  <th
                    key={h}
                    className="bg-gray-50 px-5 py-3 text-left text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm font-semibold text-gray-400"
                  >
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.user_id}
                    onClick={() =>
                      router.push(`/admin/dashboard/users/${user.user_id}`)
                    }
                    className="cursor-pointer border-t border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                          {user.first_name} {user.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {user.age_group}
                    </td>
                    <td className="px-5 py-3.5">
                      <SubBadge status={user.subscription_status} />
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {formatDate(user.registered_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-400">
            Page {page + 1} of {totalPages}
          </p>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}
