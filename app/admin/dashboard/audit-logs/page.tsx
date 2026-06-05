"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react"
import { useAdminAuditLogs, type AuditLogEntry } from "@/services/admin-auth/queries"

const ACTION_COLORS: Record<string, { bg: string; text: string }> = {
  DELETE_USER: { bg: "bg-red-50", text: "text-red-600" },
  DEACTIVATE_USER: { bg: "bg-orange-50", text: "text-orange-600" },
  REACTIVATE_USER: { bg: "bg-emerald-50", text: "text-emerald-600" },
  RESET_PASSWORD: { bg: "bg-blue-50", text: "text-blue-600" },
  DEFAULT: { bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-600 dark:text-gray-300" },
}

function ActionBadge({ type }: { type: string }) {
  const cfg = ACTION_COLORS[type] ?? ACTION_COLORS.DEFAULT
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold ${cfg.bg} ${cfg.text}`}
    >
      {type.replace(/_/g, " ")}
    </span>
  )
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
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

function LogRow({ log }: { log: AuditLogEntry }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <tr
      className="cursor-pointer border-t border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
      onClick={() => setExpanded((e) => !e)}
    >
      <td className="px-5 py-3.5">
        <p className="text-sm font-extrabold text-gray-900 dark:text-white">{log.admin_name}</p>
      </td>
      <td className="px-5 py-3.5">
        <ActionBadge type={log.action_type} />
      </td>
      <td className="px-5 py-3.5">
        <p className="text-sm font-extrabold text-gray-800 dark:text-gray-100">{log.title}</p>
      </td>
      <td className="max-w-xs px-5 py-3.5">
        <p
          className={`text-xs font-semibold text-gray-600 dark:text-gray-300 ${
            expanded ? "" : "line-clamp-2"
          }`}
        >
          {log.message}
        </p>
      </td>
      <td className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
        {formatDateTime(log.performed_at)}
      </td>
    </tr>
  )
}

export default function AdminAuditLogsPage() {
  const [page, setPage] = useState(0)

  const { data: res, isLoading } = useAdminAuditLogs(page, 10)

  const logPage = res?.data
  const logs = logPage?.content ?? []
  const totalPages = logPage?.total_pages ?? 1
  const totalElements = logPage?.total_elements ?? 0

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Audit Logs
        </h1>
        <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
          All admin actions, newest first
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.07)] dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
            Action History
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
            {totalElements} action{totalElements !== 1 ? "s" : ""} recorded
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr>
                {["Admin", "Action", "Title", "Message", "Date"].map((h) => (
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="mx-auto flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <ClipboardList size={22} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-extrabold text-gray-500 dark:text-gray-400">
                        No audit logs yet
                      </p>
                      <p className="text-xs font-semibold text-gray-400">
                        Admin actions will appear here
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => <LogRow key={log.id} log={log} />)
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-400">
            Page {page + 1} of {totalPages}
          </p>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
