"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, User, CreditCard, DollarSign, Calendar, TrendingUp } from "lucide-react"
import { keyReferredCustomers } from "@/services/partner/queries"
import { PaginatedReferredCustomer, PaginatedResponse } from "@/types/partner"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatMoney(val: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(val)
}

function PayoutBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  if (s === "paid")
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-extrabold text-emerald-600">
        Paid
      </span>
    )
  if (s === "pending")
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-extrabold text-amber-700">
        Pending
      </span>
    )
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm font-extrabold text-gray-500">
      {status}
    </span>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#bb2efa] shadow-[0_6px_16px_rgba(137,0,235,0.20)]">
        <Icon size={17} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
        <div className="mt-0.5 text-sm font-extrabold text-gray-900">{value}</div>
      </div>
    </div>
  )
}

export default function ReferredCustomerDetailPage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()

  const id = Number(customerId)

  // Find customer across all cached pages
  const cacheEntries = queryClient.getQueriesData<PaginatedResponse<PaginatedReferredCustomer>>({
    queryKey: keyReferredCustomers,
  })

  let customer: PaginatedReferredCustomer | undefined
  for (const [, data] of cacheEntries) {
    if (!data) continue
    const found = data.content.find((c) => c.id === id)
    if (found) { customer = found; break }
  }

  if (!customer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-purple-50">
          <User size={28} className="text-primary" />
        </div>
        <div>
          <p className="text-base font-bold text-gray-800">Customer not found</p>
          <p className="mt-1 text-sm text-gray-500">
            Navigate from the referred customers list to view details.
          </p>
        </div>
        <button
          onClick={() => router.push("/partner-dashboard/referred-customers")}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(137,0,235,0.20)] transition hover:bg-purple-800"
        >
          <ArrowLeft size={15} />
          Back to List
        </button>
      </div>
    )
  }

  const initial = customer.first_name?.[0]?.toUpperCase() ?? "?"

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <button
        onClick={() => router.push("/partner-dashboard/referred-customers")}
        className="flex items-center gap-2 text-sm font-extrabold text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Referred Customers
      </button>

      {/* Profile header */}
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-gray-200 bg-white/86 p-6 shadow-[0_18px_50px_rgba(16,24,40,0.08)] sm:flex-row sm:items-start">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#bb2efa] text-3xl font-black text-white shadow-[0_10px_28px_rgba(137,0,235,0.25)]">
          {initial}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-black text-gray-900">
            {customer.first_name} {customer.last_name}
          </h1>
          {customer.email && (
            <p className="mt-0.5 text-sm font-semibold text-gray-500">{customer.email}</p>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-extrabold text-primary">
              {customer.plan.charAt(0) + customer.plan.slice(1).toLowerCase()} Plan
            </span>
            <PayoutBadge status={customer.payout_status} />
          </div>
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        <DetailRow
          icon={CreditCard}
          label="Subscription Plan"
          value={customer.plan.charAt(0) + customer.plan.slice(1).toLowerCase()}
        />
        <DetailRow
          icon={DollarSign}
          label="Commission Earned"
          value={formatMoney(customer.commission_earned)}
        />
        <DetailRow
          icon={TrendingUp}
          label="Payout Status"
          value={<PayoutBadge status={customer.payout_status} />}
        />
        <DetailRow
          icon={Calendar}
          label="Sign-up Date"
          value={formatDate(customer.signup_date)}
        />
      </div>
    </div>
  )
}
