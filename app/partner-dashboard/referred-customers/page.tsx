"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { useQueryReferredCustomers } from "@/services/partner/queries"
import { PaginatedReferredCustomer } from "@/types/partner"

const PAGE_SIZE = 10

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
  if (s === "not_earned")
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-extrabold text-gray-500">
        Not Earned
      </span>
    )
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-extrabold text-gray-500">
      {status}
    </span>
  )
}

function PlanBadge({ plan }: { plan: string }) {
  const isFree = plan.toUpperCase() === "FREE"
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold ${
        isFree ? "bg-gray-100 text-gray-500" : "bg-purple-50 text-primary"
      }`}
    >
      {plan.charAt(0) + plan.slice(1).toLowerCase()}
    </span>
  )
}

export default function ReferredCustomersPage() {
  const [page, setPage] = useState(0)
  const router = useRouter()

  const { data, isLoading, isError } = useQueryReferredCustomers({
    queryParams: { page: String(page), size: String(PAGE_SIZE) },
  })

  const paginated = data?.data
  const customers = paginated?.content ?? []
  const totalPages = paginated?.total_pages ?? 0
  const totalElements = paginated?.total_elements ?? 0

  function handleRowClick(customer: PaginatedReferredCustomer, rowIndex: number) {
    const globalIndex = page * PAGE_SIZE + rowIndex
    router.push(
      `/partner-dashboard/referred-customers/${globalIndex}?page=${page}&idx=${rowIndex}`
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Referred Customers</h1>
        <p className="mt-1 text-sm font-semibold text-gray-500">
          All customers referred through your referral link.
        </p>
      </div>

      {isLoading && (
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.08)]">
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="size-9 animate-pulse rounded-full bg-gray-100" />
                <div className="h-4 w-36 animate-pulse rounded-full bg-gray-100" />
                <div className="ml-auto h-4 w-20 animate-pulse rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          <AlertCircle size={18} />
          Failed to load referred customers. Please refresh.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/86 shadow-[0_18px_50px_rgba(16,24,40,0.08)]">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">All Customers</h2>
              <p className="mt-0.5 text-xs font-semibold text-gray-500">
                Click any row to view full details.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-extrabold text-primary">
              {totalElements} total
            </span>
          </div>

          <div className="overflow-x-auto">
            {customers.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-purple-50">
                  <Users size={28} className="text-primary" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-800">No referred customers yet</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Customers who sign up using your referral link will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <table className="w-full min-w-[600px]">
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
                  {customers.map((c, i) => (
                    <tr
                      key={c.signup_date}
                      onClick={() => handleRowClick(c, i)}
                      className="cursor-pointer border-t border-gray-100 transition-colors hover:bg-purple-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#bb2efa] text-sm font-black text-white">
                            {c.first_name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <span className="block text-sm font-extrabold text-gray-900">
                              {c.first_name} {c.last_name}
                            </span>
                            {c.email && (
                              <span className="block text-xs font-semibold text-gray-400">{c.email}</span>
                            )}
                          </div>
                        </div>
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
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
              <p className="text-xs font-semibold text-gray-500">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
