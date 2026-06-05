"use client"

import { use, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Building2, CreditCard, Calendar, Users, DollarSign, Clock, Banknote, ImageIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAdminPartnerDetail } from "@/services/admin-auth/queries"
import { useAdminPartnerPayout } from "@/services/admin-auth/mutations"
import { validateCoverImage } from "@/lib/validate-media"
import { toast } from "sonner"

function formatMoney(val: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 }).format(val)
}

function formatDate(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-0.5 truncate text-base font-black text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}

export default function PartnerDetailPage({ params }: { params: Promise<{ partnerId: string }> }) {
  const { partnerId } = use(params)
  const router = useRouter()
  const id = Number(partnerId)

  const { data, isLoading } = useAdminPartnerDetail(id)
  const partner = data?.data

  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const receiptRef = useRef<HTMLInputElement>(null)
  const payout = useAdminPartnerPayout()

  function handleReceiptSelect(file: File) {
    const result = validateCoverImage(file)
    if (!result.ok) { toast.error(result.error); return }
    setReceiptFile(file)
    setReceiptPreview(URL.createObjectURL(file))
  }

  function handleReceiptRemove() {
    if (receiptPreview) URL.revokeObjectURL(receiptPreview)
    setReceiptFile(null)
    setReceiptPreview(null)
  }

  function handlePayout() {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) return
    payout.mutate(
      { partnerId: id, amount: amt, note: note.trim(), receipt: receiptFile ?? undefined },
      {
        onSuccess: () => {
          toast.success("Payout initiated successfully")
          setAmount("")
          setNote("")
          handleReceiptRemove()
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-sm font-semibold text-gray-500">Partner not found.</p>
        <button onClick={() => router.back()} className="text-xs font-extrabold text-primary underline">Go back</button>
      </div>
    )
  }

  const initial = partner.first_name?.[0]?.toUpperCase() ?? "?"

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push("/admin/dashboard/partners")}
        className="flex items-center gap-2 text-sm font-extrabold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft size={16} /> Partners
      </button>

      {/* Profile card */}
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700 sm:flex-row sm:items-start">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-black text-white">
          {initial}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{partner.first_name} {partner.last_name}</h1>
          <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-400">{partner.email}</p>
          {partner.organization_name && (
            <div className="mt-1 flex items-center justify-center gap-1.5 sm:justify-start">
              <Building2 size={13} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{partner.organization_name}</span>
            </div>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
            {partner.referral_code && (
              <span className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-extrabold text-primary dark:bg-purple-900/30">
                <CreditCard size={11} /> Code: {partner.referral_code}
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              <Calendar size={11} /> Joined {formatDate(partner.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Users} label="Total Sign-ups" value={partner.total_signups.toLocaleString()} color="bg-purple-500" />
        <StatCard icon={Users} label="Paid Customers" value={partner.paid_customers.toLocaleString()} color="bg-blue-500" />
        <StatCard icon={DollarSign} label="Total Commission Earned" value={formatMoney(partner.total_commission_earned)} color="bg-emerald-500" />
        <StatCard icon={Clock} label="Pending Payout" value={formatMoney(partner.pending_payout)} color="bg-amber-500" />
        <StatCard icon={Banknote} label="Total Paid Out" value={formatMoney(partner.total_paid_out)} color="bg-indigo-500" />
        <StatCard icon={Calendar} label="Last Payout" value={formatDate(partner.last_payout_date)} color="bg-pink-500" />
      </div>

      {/* Bank account */}
      {partner.bank_account && (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
          <h2 className="mb-4 text-sm font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400">Bank Account</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold text-gray-400">Bank</p>
              <p className="mt-0.5 text-sm font-extrabold text-gray-900 dark:text-white">{partner.bank_account.bank_name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400">Account Number</p>
              <p className="mt-0.5 font-mono text-sm font-extrabold text-gray-900 dark:text-white">{partner.bank_account.account_number}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400">Account Name</p>
              <p className="mt-0.5 text-sm font-extrabold text-gray-900 dark:text-white">{partner.bank_account.account_name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payout card */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
        <h2 className="mb-1 text-sm font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400">Disburse Payment</h2>
        <p className="mb-5 text-xs text-gray-400">
          Pending payout: <span className="font-bold text-amber-600">{formatMoney(partner.pending_payout)}</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">
              Amount (₦) <span className="text-red-500">*</span>
            </Label>
            <Input
              variant="auth"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Note</Label>
            <Input
              variant="auth"
              placeholder="e.g. March commission payout"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* Receipt upload */}
        <div className="mt-4 flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">
            Receipt <span className="text-xs font-normal text-gray-400">(optional)</span>
          </Label>
          <div
            className="relative flex min-h-[110px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 transition-colors hover:border-purple-400 dark:border-purple-800 dark:bg-purple-900/10"
            onClick={() => !receiptFile && receiptRef.current?.click()}
          >
            {receiptPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={receiptPreview} alt="receipt" className="max-h-[200px] w-full object-contain" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleReceiptRemove() }}
                  className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X size={13} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 p-4 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <ImageIcon size={18} className="text-primary" />
                </div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Click to upload receipt image
                </p>
                <p className="text-xs text-gray-400">JPG, PNG, HEIC · max 10 MB</p>
              </div>
            )}
            <input
              ref={receiptRef}
              type="file"
              accept=".jpg,.jpeg,.png,.heic,.heif,image/jpeg,image/png,image/heic"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleReceiptSelect(f); e.target.value = "" }}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            className="h-11 rounded-full px-8 text-sm font-bold"
            disabled={!amount || parseFloat(amount) <= 0}
            loading={payout.isPending}
            onClick={handlePayout}
          >
            Disburse Payment
          </Button>
        </div>
      </div>
    </div>
  )
}
