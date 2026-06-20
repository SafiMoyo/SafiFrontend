"use client"

import { useState } from "react"
import {
  Percent,
  Pencil,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAdminCommissionRate } from "@/services/admin-auth/queries"
import {
  useAdminSetCommissionRate,
  useAdminVerifyPayment,
  type PaymentVerificationResult,
} from "@/services/admin-auth/mutations"
import { toast } from "sonner"

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

// ── Commission Card ─────────────────────────────────────────────────────────

function CommissionCard() {
  const { data, isLoading } = useAdminCommissionRate()
  const commission = data?.data
  const setRate = useAdminSetCommissionRate()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [rateInput, setRateInput] = useState("")

  function openEdit() {
    setRateInput(commission ? String(commission.rate) : "")
    setEditOpen(true)
  }

  function handleSave() {
    const parsed = parseFloat(rateInput)
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Please enter a valid rate.")
      return
    }
    setRate.mutate(parsed, {
      onSuccess: () => {
        toast.success("Commission rate updated!")
        setEditOpen(false)
      },
      onError: () => {
        toast.error("Failed to update commission rate.")
      },
    })
  }

  function handleDelete() {
    setRate.mutate(0, {
      onSuccess: () => {
        toast.success("Commission rate cleared.")
        setDeleteOpen(false)
      },
      onError: () => {
        toast.error("Failed to clear commission rate.")
      },
    })
  }

  return (
    <>
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
        <div className="flex items-start justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Percent size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Commission Rate</p>
              {isLoading ? (
                <div className="mt-1 h-8 w-24 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
              ) : commission ? (
                <>
                  <p className="mt-0.5 text-3xl font-black text-gray-900 dark:text-white">
                    {commission.rate}%
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    Last updated: {formatDate(commission.updated_at)}
                  </p>
                </>
              ) : (
                <p className="mt-1 text-sm font-semibold text-gray-400 dark:text-gray-500">
                  No commission rate set
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={openEdit}
              className="flex size-9 items-center justify-center rounded-lg text-gray-400 hover:bg-purple-50 hover:text-primary dark:hover:bg-purple-900/30 dark:hover:text-purple-300"
              title={commission ? "Edit rate" : "Set rate"}
            >
              {commission ? <Pencil size={16} /> : <Plus size={16} />}
            </button>
            {commission && (
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex size-9 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                title="Clear rate"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit / Set Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm bg-white p-6 dark:bg-gray-900" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-base font-black text-gray-900 dark:text-white">
              {commission ? "Edit Commission Rate" : "Set Commission Rate"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">
              Rate (%) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                variant="auth"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 5"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                className="pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">%</span>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="outline" className="rounded-full" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-full px-6 font-bold"
              loading={setRate.isPending}
              disabled={!rateInput}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete / Clear Confirm Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm bg-white p-6 dark:bg-gray-900" showCloseButton={false}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-base font-black text-gray-900 dark:text-white">Clear commission rate?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This will set the commission rate to 0. You can re-configure it at any time.
            </p>
          </div>
          <div className="mt-5 space-y-3">
            <Button
              type="button"
              variant="destructive"
              className="h-12 w-full rounded-full font-bold"
              loading={setRate.isPending}
              onClick={handleDelete}
            >
              Yes, Clear Rate
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full rounded-full font-bold text-gray-500"
              disabled={setRate.isPending}
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ── Payment Verification Card ────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  SUCCESS: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

function ResultRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
      <span className="w-36 shrink-0 text-xs font-bold text-gray-400 dark:text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</span>
    </div>
  )
}

function PaymentVerificationCard() {
  const [reference, setReference] = useState("")
  const [result, setResult] = useState<PaymentVerificationResult | null>(null)
  const verifyPayment = useAdminVerifyPayment()

  function handleVerify() {
    const ref = reference.trim()
    if (!ref) return
    setResult(null)
    verifyPayment.mutate(ref, {
      onSuccess: (res) => {
        setResult(res.data)
        toast.success(res.message ?? "Payment verified!")
      },
      onError: () => {
        toast.error("Verification failed. Check the reference and try again.")
      },
    })
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Verify Payment</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Enter a payment reference to verify its status
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">
            Payment Reference <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              variant="auth"
              placeholder="e.g. FLW-REF-123456"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="flex-1"
            />
            <Button
              type="button"
              className="h-12 shrink-0 rounded-xl px-5 font-bold"
              loading={verifyPayment.isPending}
              disabled={!reference.trim()}
              onClick={handleVerify}
            >
              <Search size={16} />
              Verify
            </Button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Verification Result
              </p>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${STATUS_STYLE[result.local_status] ?? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
              >
                {result.local_status}
              </span>
            </div>
            <div className="space-y-2.5">
              <ResultRow label="Reference" value={result.reference} />
              <ResultRow label="User" value={`${result.user_name} (ID: ${result.user_id})`} />
              <ResultRow label="Email" value={result.email} />
              <ResultRow label="Plan" value={`${result.plan_type} — ${result.duration}`} />
              <ResultRow
                label="Amount Paid"
                value={new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(result.amount_paid)}
              />
              <ResultRow label="Flutterwave Status" value={result.flutterwave_status} />
              <ResultRow label="Action" value={result.action} />
              {result.message && <ResultRow label="Message" value={result.message} />}
              {result.activated_at && <ResultRow label="Activated" value={formatDate(result.activated_at)} />}
              {result.expires_at && <ResultRow label="Expires" value={formatDate(result.expires_at)} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage commission rates and verify payments
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <CommissionCard />
        <PaymentVerificationCard />
      </div>
    </div>
  )
}
