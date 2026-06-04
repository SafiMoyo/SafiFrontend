"use client"

import { useState } from "react"
import { Banknote, CheckCircle2, Clock, AlertCircle, Receipt, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQueryIncomingPayouts, type IncomingPayout } from "@/services/partner/queries"
import { useAcknowledgePayout } from "@/services/partner/mutations"
import { toast } from "sonner"

function formatMoney(val: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(val)
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

function ReceiptModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          <X size={16} />
        </button>
        <p className="mb-3 text-sm font-extrabold text-gray-800">Payment Receipt</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="receipt" className="w-full rounded-xl object-contain max-h-[70vh]" />
      </div>
    </div>
  )
}

function PayoutCard({ payout }: { payout: IncomingPayout }) {
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const acknowledge = useAcknowledgePayout()

  function handleAcknowledge() {
    acknowledge.mutate(payout.payout_id, {
      onSuccess: () => {
        toast.success("Payout acknowledged successfully!")
        setConfirmOpen(false)
      },
    })
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,40,0.07)] sm:flex-row sm:items-center">
        {/* Icon */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#bb2efa] shadow-[0_8px_20px_rgba(137,0,235,0.25)]">
          <Banknote size={22} className="text-white" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xl font-black text-gray-900">{formatMoney(payout.amount)}</p>
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-extrabold text-amber-600">
              <Clock size={11} /> Pending acknowledgment
            </span>
          </div>
          {payout.note && (
            <p className="mt-1 text-sm font-semibold text-gray-500">{payout.note}</p>
          )}
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
            <Clock size={11} />
            Initiated {formatDateTime(payout.initiated_at)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {payout.receipt_url && (
            <button
              type="button"
              onClick={() => setReceiptOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:border-primary hover:text-primary"
            >
              <Receipt size={13} /> View Receipt
            </button>
          )}
          <Button
            type="button"
            className="h-9 rounded-full px-4 text-xs font-bold"
            onClick={() => setConfirmOpen(true)}
          >
            <CheckCircle2 size={14} />
            Acknowledge
          </Button>
        </div>
      </div>

      {/* Receipt viewer */}
      {receiptOpen && payout.receipt_url && (
        <ReceiptModal url={payout.receipt_url} onClose={() => setReceiptOpen(false)} />
      )}

      {/* Confirm modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 size={26} className="text-emerald-600" />
              </div>
              <h3 className="text-base font-black text-gray-900">Confirm receipt?</h3>
              <p className="text-sm text-gray-500">
                You are acknowledging that you have received{" "}
                <span className="font-bold text-gray-800">{formatMoney(payout.amount)}</span>.
                This action cannot be undone.
              </p>
            </div>
            <div className="mt-5 space-y-3">
              <Button
                type="button"
                className="h-12 w-full rounded-full font-bold"
                loading={acknowledge.isPending}
                onClick={handleAcknowledge}
              >
                Yes, I've received it
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-12 w-full rounded-full font-bold text-gray-500"
                disabled={acknowledge.isPending}
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function PayoutsPage() {
  const { data, isLoading, isError } = useQueryIncomingPayouts({})
  const payouts = data?.data ?? []

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Payouts</h1>
        <p className="mt-1 text-sm font-semibold text-gray-500">
          Review and acknowledge payments initiated by Safi.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[100px] animate-pulse rounded-3xl bg-gray-100" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          <AlertCircle size={18} />
          Failed to load payouts. Please refresh.
        </div>
      )}

      {!isLoading && !isError && payouts.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-purple-50">
            <Banknote size={28} className="text-primary" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-800">No incoming payouts</p>
            <p className="mt-1 text-sm text-gray-500">Payouts initiated by Safi will appear here.</p>
          </div>
        </div>
      )}

      {!isLoading && !isError && payouts.length > 0 && (
        <div className="space-y-3">
          {payouts.map((payout) => (
            <PayoutCard key={payout.payout_id} payout={payout} />
          ))}
        </div>
      )}
    </div>
  )
}
