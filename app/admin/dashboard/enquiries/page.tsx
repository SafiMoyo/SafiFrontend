"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import { useAdminEnquiries, type Enquiry } from "@/services/admin-auth/queries"

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
          <span key={`e${i}`} className="px-1 text-xs text-gray-400">…</span>
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

function EnquiryCard({ enquiry }: { enquiry: Enquiry }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = enquiry.message.length > 120

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-primary/20 hover:bg-purple-50/30 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-purple-900/10">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#bb2efa] text-sm font-black text-white">
            {enquiry.name[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-sm font-extrabold text-gray-900 dark:text-white">{enquiry.name}</p>
            <p className="text-xs font-semibold text-primary">{enquiry.email}</p>
          </div>
        </div>
        <p className="shrink-0 text-xs font-semibold text-gray-400">
          {formatDateTime(enquiry.created_at)}
        </p>
      </div>

      <div className="pl-12">
        <p className={`text-sm font-semibold leading-relaxed text-gray-700 dark:text-gray-300 ${!expanded && isLong ? "line-clamp-3" : ""}`}>
          {enquiry.message}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-1 flex items-center gap-1 text-xs font-extrabold text-primary hover:underline"
          >
            {expanded ? (
              <><ChevronUp size={12} /> Show less</>
            ) : (
              <><ChevronDown size={12} /> Read more</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default function AdminEnquiriesPage() {
  const [page, setPage] = useState(0)

  const { data: res, isLoading } = useAdminEnquiries(page, 20)

  const enquiryPage = res?.data
  const enquiries = enquiryPage?.content ?? []
  const totalPages = enquiryPage?.total_pages ?? 1
  const totalElements = enquiryPage?.total_elements ?? 0

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Enquiries
        </h1>
        <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
          Support messages from users
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(16,24,40,0.07)] dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white">All Enquiries</h2>
          <p className="mt-0.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
            {totalElements} message{totalElements !== 1 ? "s" : ""} received
          </p>
        </div>

        <div className="flex flex-col gap-3 p-5">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : enquiries.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <MessageSquare size={22} className="text-gray-400" />
              </div>
              <p className="text-sm font-extrabold text-gray-500 dark:text-gray-400">No enquiries yet</p>
              <p className="text-xs font-semibold text-gray-400">User messages will appear here</p>
            </div>
          ) : (
            enquiries.map((enquiry) => (
              <EnquiryCard key={enquiry.id} enquiry={enquiry} />
            ))
          )}
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
