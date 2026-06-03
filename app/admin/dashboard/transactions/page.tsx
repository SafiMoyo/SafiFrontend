"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Receipt,
  ArrowUpRight,
} from "lucide-react"
import {
  useAdminTransactionOverview,
  useAdminTransactions,
  useAdminTransactionsFilter,
  type Transaction,
  type TransactionOverview,
} from "@/services/admin-auth/queries"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatNaira(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`
  return `₦${n.toLocaleString()}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
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

type StatusKey = "ACTIVE" | "PENDING" | "CANCELLED" | "INACTIVE" | "FAILED"

const STATUS_CONFIG: Record<
  StatusKey,
  { label: string; bg: string; text: string }
> = {
  ACTIVE: { label: "Paid", bg: "bg-emerald-50", text: "text-emerald-600" },
  PENDING: { label: "Pending", bg: "bg-amber-50", text: "text-amber-600" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-50", text: "text-red-500" },
  INACTIVE: { label: "Inactive", bg: "bg-gray-100", text: "text-gray-500" },
  FAILED: { label: "Failed", bg: "bg-red-50", text: "text-red-500" },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as StatusKey] ?? {
    label: status,
    bg: "bg-gray-100",
    text: "text-gray-500",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  )
}

// ── Small ring stat card ──────────────────────────────────────────────────────

function RingCard({
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
  const r = 24
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? (value / total) * 100 : 0
  const offset = circ * (1 - pct / 100)

  return (
    <div className="flex items-center gap-4 rounded-[18px] border border-gray-200 bg-white p-4 shadow-[0_8px_20px_rgba(16,24,40,0.05)] sm:p-5">
      <svg width={64} height={64} viewBox="0 0 64 64" className="shrink-0">
        <circle
          cx={32}
          cy={32}
          r={r}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={7}
        />
        <circle
          cx={32}
          cy={32}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 32 32)"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        <text
          x={32}
          y={32}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: 13, fontWeight: 900, fill: "#111827" }}
        >
          {value}
        </text>
      </svg>
      <div>
        <p className="text-xl font-black text-gray-900">{value}</p>
        <p className="text-xs font-extrabold uppercase tracking-wide text-gray-500">
          {label}
        </p>
      </div>
    </div>
  )
}

// ── Receipt panel ─────────────────────────────────────────────────────────────

function ReceiptPanel({ tx }: { tx: Transaction }) {
  const isSuccess = tx.status === "ACTIVE"
  const isPending = tx.status === "PENDING"

  const icon = isSuccess ? (
    <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={1.5} />
  ) : isPending ? (
    <Clock size={40} className="text-amber-500" strokeWidth={1.5} />
  ) : (
    <XCircle size={40} className="text-red-500" strokeWidth={1.5} />
  )

  const headline = isSuccess
    ? "Payment Successful!"
    : isPending
      ? "Payment Pending"
      : "Payment Failed"

  const headlineColor = isSuccess
    ? "text-emerald-600"
    : isPending
      ? "text-amber-600"
      : "text-red-500"

  return (
    <div className="flex flex-col">
      {/* Top: icon + headline + amount */}
      <div className="flex flex-col items-center gap-3 px-6 py-6 text-center">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full ${
            isSuccess
              ? "bg-emerald-50"
              : isPending
                ? "bg-amber-50"
                : "bg-red-50"
          }`}
        >
          {icon}
        </div>
        <p className={`text-base font-extrabold ${headlineColor}`}>
          {headline}
        </p>
        <p className="text-3xl font-black text-gray-900">
          ₦{tx.amount.toLocaleString()}
        </p>
      </div>

      <div className="mx-5 border-t border-dashed border-gray-200" />

      {/* Payment Details */}
      <div className="px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-gray-900">
            Payment Details
          </h3>
          <ArrowUpRight size={15} className="text-gray-400" />
        </div>
        <div className="flex flex-col gap-3">
          <Row label="Ref Number" value={tx.reference} mono />
          <Row
            label="Payment Status"
            value={<StatusBadge status={tx.status} />}
          />
          <Row label="Payment Time" value={formatDateTime(tx.date)} />
          <Row label="Plan" value={tx.plan_name} />
          <Row label="Amount" value={`₦${tx.amount.toLocaleString()}`} />
          <Row label="Customer" value={tx.user_name.trim()} />
          <Row label="Email" value={tx.email} />
        </div>
      </div>

      <div className="mx-5 border-t border-dashed border-gray-200" />

      {/* Footer CTA */}
      <div className="px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-extrabold text-gray-700">
            Trouble With Your Payment?
          </p>
          <ArrowUpRight size={15} className="text-gray-400" />
        </div>
        <button className="w-full rounded-xl border border-gray-200 py-2.5 text-xs font-extrabold text-gray-700 transition hover:border-primary hover:text-primary">
          Get PDF Receipt
        </button>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-xs font-semibold text-gray-400">
        {label}
      </span>
      <span
        className={`text-right text-xs font-extrabold text-gray-900 ${mono ? "break-all font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (p: number) => void
}) {
  if (!totalPages || totalPages <= 1) return null

  const pages: (number | "…")[] = []
  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) pages.push(i)
  } else {
    const last = totalPages - 1
    const left = Math.max(1, page - 1)
    const right = Math.min(last - 1, page + 1)
    pages.push(0)
    if (left > 1) pages.push("…")
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < last - 1) pages.push("…")
    pages.push(last)
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-extrabold text-gray-500 hover:bg-gray-100 disabled:opacity-40"
      >
        <ChevronLeft size={14} /> Prev
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-xs text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold transition ${
              p === page
                ? "bg-primary text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {(p as number) + 1}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-extrabold text-gray-500 hover:bg-gray-100 disabled:opacity-40"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Paid (Active)", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Inactive", value: "INACTIVE" },
]

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState("")
  const [selected, setSelected] = useState<Transaction | null>(null)

  const isFiltered = !!statusFilter

  const { data: overviewRes, isLoading: loadingOverview } =
    useAdminTransactionOverview()
  const { data: allRes, isLoading: loadingAll } = useAdminTransactions(
    page,
    10
  )
  const { data: filteredRes, isLoading: loadingFiltered } =
    useAdminTransactionsFilter(statusFilter || null, null, page, 10)

  const overview: TransactionOverview | undefined = overviewRes?.data
  const txPage = isFiltered ? filteredRes?.data : allRes?.data
  const transactions = txPage?.content ?? []
  const totalPages = txPage?.total_pages ?? 1
  const totalElements = txPage?.total_elements ?? 0
  const isLoading = isFiltered ? loadingFiltered : loadingAll

  function handleStatusChange(val: string) {
    setStatusFilter(val)
    setPage(0)
    setSelected(null)
  }

  function handlePageChange(p: number) {
    setPage(p)
    setSelected(null)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Transactions
        </h1>
        <p className="mt-1 text-sm font-semibold text-gray-500">
          All payment activity across the platform
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Revenue — large highlight card */}
        <div className="col-span-2 flex items-center gap-5 rounded-[18px] border-transparent bg-gradient-to-br from-primary to-[#bb2efa] p-5 shadow-[0_12px_28px_rgba(137,0,235,0.22)] lg:col-span-1">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <Receipt size={24} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">
              {loadingOverview
                ? "—"
                : formatNaira(overview?.total_revenue ?? 0)}
            </p>
            <p className="text-xs font-extrabold uppercase tracking-wide text-white/80">
              Total Revenue
            </p>
          </div>
        </div>

        <RingCard
          label="Total Transactions"
          value={loadingOverview ? 0 : (overview?.total_transactions ?? 0)}
          total={overview?.total_transactions ?? 1}
          color="#8900eb"
        />
        <RingCard
          label="Pending"
          value={loadingOverview ? 0 : (overview?.pending_transactions ?? 0)}
          total={overview?.total_transactions ?? 1}
          color="#f59e0b"
        />
        <RingCard
          label="Failed"
          value={loadingOverview ? 0 : (overview?.failed_transactions ?? 0)}
          total={overview?.total_transactions ?? 1}
          color="#ef4444"
        />
      </div>

      {/* Table + Receipt */}
      <div className="flex min-w-0 gap-4">
        {/* Transaction table */}
        <div className="min-w-0 flex-1 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.07)]">
          {/* Table header */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Transaction Details
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-gray-500">
                {totalElements} transaction{totalElements !== 1 ? "s" : ""}
                {isFiltered ? ` · filtered by "${statusFilter}"` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-extrabold text-gray-400">
                Sort by:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-extrabold text-gray-700 outline-none focus:border-primary"
              >
                {STATUS_FILTER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  {["User Name", "Plan", "Amount", "Status", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        className="bg-gray-50 px-5 py-3 text-left text-xs font-extrabold uppercase tracking-widest text-gray-400"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center">
                      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm font-semibold text-gray-400"
                    >
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const isActive = selected?.transaction_id === tx.transaction_id
                    return (
                      <tr
                        key={tx.transaction_id}
                        onClick={() =>
                          setSelected(isActive ? null : tx)
                        }
                        className={`cursor-pointer border-t border-gray-100 transition-colors ${
                          isActive
                            ? "bg-purple-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-extrabold text-gray-900">
                            {tx.user_name.trim()}
                          </p>
                          <p className="text-xs text-gray-400">{tx.email}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-semibold text-gray-700">
                          {tx.plan_name}
                        </td>
                        <td className="px-5 py-3.5 text-sm font-extrabold text-gray-900">
                          ₦{tx.amount.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={tx.status} />
                        </td>
                        <td className="px-5 py-3.5 text-xs font-semibold text-gray-500">
                          {formatDate(tx.date)}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
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

        {/* Receipt panel */}
        <div className="w-[300px] shrink-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.07)]">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-extrabold text-gray-900">Receipt</h2>
          </div>
          {selected ? (
            <ReceiptPanel tx={selected} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Receipt size={22} className="text-gray-400" />
              </div>
              <p className="text-sm font-extrabold text-gray-500">
                Select a transaction
              </p>
              <p className="text-xs font-semibold text-gray-400">
                Click any row to see payment details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
