"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useAdminPartners, type AdminPartner } from "@/services/admin-auth/queries"

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
        className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-extrabold text-gray-500 hover:bg-gray-100 disabled:opacity-40"
      >
        <ChevronLeft size={14} /> Prev
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-xs text-gray-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold transition ${
              p === page ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
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

function PartnerAvatar({ partner }: { partner: AdminPartner }) {
  const initial = partner.first_name?.[0]?.toUpperCase() ?? "?"
  if (partner.profile_picture) {
    return (
      <img
        src={partner.profile_picture}
        alt={partner.first_name}
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

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null
  const s = status.toUpperCase()
  const styles =
    s === "ACTIVE"
      ? "bg-emerald-50 text-emerald-600"
      : s === "RESTRICTED"
      ? "bg-amber-50 text-amber-600"
      : "bg-gray-100 text-gray-500"
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold ${styles}`}>
      {s === "ACTIVE" ? "Active" : s === "RESTRICTED" ? "Restricted" : status}
    </span>
  )
}

function formatDate(iso?: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function AdminPartnersPage() {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")

  const { data: res, isLoading } = useAdminPartners(page, 10)

  const partnerPage = res?.data
  const allPartners = partnerPage?.content ?? []
  const totalPages = partnerPage?.total_pages ?? 1
  const totalElements = partnerPage?.total_elements ?? 0

  const filtered = allPartners.filter((p) => {
    if (!search) return true
    const name = `${p.first_name} ${p.last_name}`.toLowerCase()
    const email = (p.email ?? "").toLowerCase()
    const business = (p.business_name ?? "").toLowerCase()
    const q = search.toLowerCase()
    return name.includes(q) || email.includes(q) || business.includes(q)
  })

  function handlePageChange(p: number) {
    setPage(p)
    setSearch("")
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Partners</h1>
        <p className="mt-1 text-sm font-semibold text-gray-500">Manage all platform partners</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or business"
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm font-semibold text-gray-700 outline-none focus:border-primary"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.07)]">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-extrabold text-gray-900">All Partners</h2>
          <p className="mt-0.5 text-xs font-semibold text-gray-500">
            {totalElements} partner{totalElements !== 1 ? "s" : ""} total
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                {["Name", "Email Address", "Business", "Status", "Joined"].map((h) => (
                  <th
                    key={h}
                    className="bg-gray-50 px-5 py-3 text-left text-xs font-extrabold uppercase tracking-widest text-gray-400"
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm font-semibold text-gray-400">
                    No partners found.
                  </td>
                </tr>
              ) : (
                filtered.map((partner) => (
                  <tr
                    key={partner.id}
                    onClick={() => router.push(`/admin/dashboard/partners/${partner.id}`)}
                    className="cursor-pointer border-t border-gray-100 transition-colors hover:bg-gray-50"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <PartnerAvatar partner={partner} />
                        <span className="text-sm font-extrabold text-gray-900">
                          {partner.first_name} {partner.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-600">
                      {partner.email ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-600">
                      {partner.business_name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={partner.account_status ?? partner.status} />
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-gray-500">
                      {formatDate(partner.registered_at ?? partner.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
          <p className="text-xs font-semibold text-gray-400">
            Page {page + 1} of {totalPages}
          </p>
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </div>
      </div>
    </div>
  )
}
