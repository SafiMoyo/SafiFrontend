"use client"

import { Copy, Download } from "lucide-react"
import { toast } from "sonner"
import { useQueryPartnerDashboard } from "@/services/partner/queries"
import { ReferredCustomer } from "@/types/partner"

function formatNaira(amount: number) {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`
  return `₦${amount.toLocaleString()}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function PayoutBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  if (s === "paid")
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-600">
        Paid
      </span>
    )
  if (s === "pending")
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700">
        Pending
      </span>
    )
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-extrabold text-gray-500">
      {status}
    </span>
  )
}

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-extrabold text-primary">
      {plan.charAt(0) + plan.slice(1).toLowerCase()}
    </span>
  )
}

export default function PartnerOverviewPage() {
  const { data: res, isLoading, isFetching } = useQueryPartnerDashboard()
  const dashboard = res?.data

  function copyCode() {
    if (!dashboard) return
    navigator.clipboard.writeText(dashboard.referral_code)
    toast.success("Referral code copied!")
  }

  function copyLink() {
    navigator.clipboard.writeText("https://safimoyo.com")
    toast.success("Link copied!")
  }

  const totalPlanCount =
    (dashboard?.plan_breakdown.monthly ?? 0) +
    (dashboard?.plan_breakdown.quarterly ?? 0) +
    (dashboard?.plan_breakdown.yearly ?? 0) || 1

  // Only block on the very first load (no cached data yet)
  if (isLoading && !dashboard) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Topbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Referral Partner Dashboard
          </h1>
          <p className="mt-1.5 text-sm font-semibold text-gray-500">
            Transparent tracking for signups, paid conversions, and expected commission.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-extrabold text-gray-700 shadow-sm transition hover:border-purple-300 hover:text-primary"
          >
            <Copy size={15} />
            Copy Link
          </button>
          <button
            onClick={() => toast.info("CSV export coming soon")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(137,0,235,0.20)] transition hover:bg-purple-800"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Profile + Commission */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Profile card */}
        <div className="rounded-3xl border border-gray-200 bg-white/86 p-5 shadow-[0_18px_50px_rgba(16,24,40,0.08)]">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {dashboard ? `${dashboard.first_name} ${dashboard.last_name}` : "—"}
            </h2>
            <p className="mt-0.5 text-sm font-semibold text-gray-500">
              {dashboard?.organization_name ?? "—"} · Active referral partner
            </p>
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3 rounded-[18px] border border-dashed border-purple-300 bg-purple-50 p-4">
            <div>
              <code className="text-xl font-extrabold text-primary">
                {dashboard?.referral_code ?? "—"}
              </code>
              <small className="mt-1 block text-xs font-extrabold text-gray-500">
                Referral link: https://safimoyo.com
              </small>
            </div>
            <button
              onClick={copyCode}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-extrabold text-white shadow-[0_10px_24px_rgba(137,0,235,0.20)] transition hover:bg-purple-800"
            >
              <Copy size={13} />
              Copy Code
            </button>
          </div>
        </div>

        {/* Commission rules */}
        <div className="rounded-3xl border border-gray-200 bg-white/86 p-5 shadow-[0_18px_50px_rgba(16,24,40,0.08)]">
          <h2 className="text-xl font-extrabold text-gray-900">Commission Rules</h2>
          <p className="mt-0.5 text-sm font-semibold text-gray-500">
            Fixed payout after confirmed payment.
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            <span className="inline-flex w-fit items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-extrabold text-primary">
              Commission rate: {dashboard?.commission_rate ?? 0}%
            </span>
            <span className="inline-flex w-fit items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-extrabold text-primary">
              Monthly plan conversions
            </span>
            <span className="inline-flex w-fit items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-extrabold text-primary">
              Quarterly plan conversions
            </span>
            <span className="inline-flex w-fit items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-extrabold text-primary">
              Yearly plan conversions
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Signups"
          value={dashboard?.total_signups ?? 0}
          note="Using this code"
        />
        <StatCard
          label="Paid Customers"
          value={dashboard?.paid_customers ?? 0}
          note="Confirmed payments"
        />
        <StatCard
          label="Pending Payout"
          value={formatNaira(dashboard?.pending_payout ?? 0)}
          note="Awaiting Safi approval"
          highlight
        />
        <StatCard
          label="Paid Out"
          value={formatNaira(dashboard?.total_paid_out ?? 0)}
          note="Previous payouts"
        />
      </div>

      {/* Table + Plan breakdown */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Referred customers */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/86 shadow-[0_18px_50px_rgba(16,24,40,0.08)]">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Referred Customers</h2>
              <p className="mt-0.5 text-xs font-semibold text-gray-500">
                Privacy-safe customer view for referral partners.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-600">
              {dashboard?.paid_customers ?? 0} paid
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr>
                  {["Customer", "Plan", "Commission", "Payout", "Signed Up"].map((h) => (
                    <th
                      key={h}
                      className="bg-gray-50 px-5 py-3.5 text-left text-xs font-extrabold uppercase tracking-widest text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!dashboard?.customers_referred?.length ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm font-semibold text-gray-400">
                      No referred customers yet.
                    </td>
                  </tr>
                ) : (
                  dashboard.customers_referred.map((c: ReferredCustomer, i: number) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-5 py-4">
                        <span className="block text-sm font-extrabold text-gray-900">
                          {c.first_name} {c.last_name}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <PlanBadge plan={c.plan} />
                      </td>
                      <td className="px-5 py-4 text-sm font-extrabold text-gray-900">
                        ₦{c.commission_earned.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <PayoutBadge status={c.payout_status} />
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-500">
                        {formatDate(c.signup_date)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan breakdown */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/86 shadow-[0_18px_50px_rgba(16,24,40,0.08)]">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-extrabold text-gray-900">Plan Breakdown</h2>
            <p className="mt-0.5 text-xs font-semibold text-gray-500">
              Paid conversions by subscription plan.
            </p>
          </div>
          <div className="flex flex-col gap-5 p-5">
            {(
              [
                ["Monthly", dashboard?.plan_breakdown.monthly ?? 0],
                ["Quarterly", dashboard?.plan_breakdown.quarterly ?? 0],
                ["Yearly", dashboard?.plan_breakdown.yearly ?? 0],
              ] as [string, number][]
            ).map(([label, count]) => (
              <div key={label} className="flex flex-col gap-2">
                <div className="flex justify-between text-sm font-extrabold text-gray-800">
                  <span>{label}</span>
                  <span>{count} customer{count !== 1 ? "s" : ""}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-[#bb2efa]"
                    style={{ width: `${Math.round((count / totalPlanCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  note,
  highlight,
}: {
  label: string
  value: number | string
  note: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-[18px] border p-4 shadow-[0_12px_28px_rgba(16,24,40,0.05)] sm:p-5 ${
        highlight
          ? "border-transparent bg-gradient-to-br from-primary to-[#bb2efa] text-white"
          : "border-gray-200 bg-white"
      }`}
    >
      <p className={`text-xs font-extrabold uppercase tracking-wide ${highlight ? "text-white/80" : "text-gray-500"}`}>
        {label}
      </p>
      <p className={`mt-1.5 text-3xl font-black tracking-tight ${highlight ? "text-white" : "text-gray-900"}`}>
        {value}
      </p>
      <p className={`mt-2 text-xs font-semibold ${highlight ? "text-white/70" : "text-gray-400"}`}>
        {note}
      </p>
    </div>
  )
}
