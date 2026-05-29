"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Pencil, Trash2 } from "lucide-react"
import {
  useQueryPartnerBanks,
  useQueryVerifyBankAccount,
  useQueryPartnerBankAccount,
} from "@/services/partner/queries"
import {
  useSaveBankAccount,
  useUpdateBankAccount,
  useDeleteBankAccount,
  useSubmitDispute,
} from "@/services/partner/mutations"
import { Bank, DISPUTE_TYPE_LABELS, DisputeType } from "@/types/partner"

export default function PartnerSettingsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Settings
        </h1>
        <p className="mt-1.5 text-sm font-semibold text-gray-500">
          Manage your bank account and submit disputes.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <BankAccountCard />
        <DisputeCard />
      </div>
    </div>
  )
}

type BankFormMode = "view" | "add" | "edit"

function BankAccountCard() {
  const [mode, setMode] = useState<BankFormMode>("view")
  const [bankCode, setBankCode] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")

  const { data: banksRes, isLoading: banksLoading } = useQueryPartnerBanks()
  const banks: Bank[] = banksRes?.data ?? []

  const { data: savedRes, isLoading: savedLoading } = useQueryPartnerBankAccount()
  const saved = savedRes?.data

  // Once the saved account query resolves, set the correct initial mode
  useEffect(() => {
    if (!savedLoading) {
      setMode(saved ? "view" : "add")
    }
  }, [savedLoading, saved])

  const shouldVerify = accountNumber.length === 10 && !!bankCode

  const { data: verifyRes, isFetching: isFetchingVerify } = useQueryVerifyBankAccount(
    shouldVerify
      ? { queryParams: { account_number: accountNumber, bank_code: bankCode }, enabled: true }
      : { enabled: false }
  )

  useEffect(() => {
    if (verifyRes?.data?.account_name) {
      setAccountName(verifyRes.data.account_name)
    }
  }, [verifyRes])

  useEffect(() => {
    if (accountNumber.length < 10) setAccountName("")
  }, [accountNumber])

  function resetForm() {
    setBankCode("")
    setAccountNumber("")
    setAccountName("")
  }

  const { mutate: saveBankAccount, isPending: saving } = useSaveBankAccount({
    onSuccess: () => {
      toast.success("Bank account saved successfully!")
      resetForm()
    },
  })

  const { mutate: updateBankAccount, isPending: updating } = useUpdateBankAccount({
    onSuccess: () => {
      toast.success("Bank account updated successfully!")
      resetForm()
      setMode("view")
    },
  })

  const { mutate: deleteBankAccount, isPending: deleting } = useDeleteBankAccount({
    onSuccess: () => {
      toast.success("Bank account removed.")
      resetForm()
      setMode("add")
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!accountName || !bankCode || accountNumber.length !== 10) return
    const payload = { account_name: accountName, account_number: accountNumber, bank_code: bankCode }
    if (mode === "edit") {
      updateBankAccount(payload)
    } else {
      saveBankAccount(payload)
    }
  }

  const isPending = saving || updating
  const isFormMode = mode === "add" || mode === "edit"

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/86 shadow-[0_18px_50px_rgba(16,24,40,0.08)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">Account Information</h2>
          <p className="mt-0.5 text-xs font-semibold text-gray-500">
            Add your account to receive commission payouts.
          </p>
        </div>
        {mode === "view" && saved && (
          <div className="flex items-center gap-1 pt-0.5">
            <button
              type="button"
              onClick={() => setMode("edit")}
              title="Edit bank account"
              className="rounded-xl p-2 text-gray-400 transition hover:bg-purple-50 hover:text-primary"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => deleteBankAccount(undefined)}
              disabled={deleting}
              title="Remove bank account"
              className="rounded-xl p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
            >
              {deleting ? (
                <span className="block h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* Skeleton while loading */}
        {savedLoading && (
          <div className="flex flex-col gap-3">
            <div className="h-16 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        )}

        {/* Current account display */}
        {!savedLoading && mode === "view" && saved && (
          <div className="rounded-2xl border border-dashed border-purple-300 bg-purple-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-gray-400">
              Current Account
            </p>
            <p className="mt-1.5 text-base font-extrabold text-gray-900">{saved.account_name}</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-600">
              {saved.bank_name} · {saved.account_number}
            </p>
          </div>
        )}

        {/* Add / Edit form */}
        {!savedLoading && isFormMode && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Bank name */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900">Bank Name</Label>
              {banksLoading ? (
                <div className="h-11 animate-pulse rounded-[14px] bg-gray-100" />
              ) : (
                <Select
                  value={bankCode}
                  onValueChange={(v) => {
                    setBankCode(v)
                    setAccountName("")
                  }}
                >
                  <SelectTrigger className="h-11!" variant="auth">
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {banks.map((b) => (
                      <SelectItem key={b.id} value={b.code}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Account number */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900">Account Number</Label>
              <Input
                variant="auth"
                placeholder="10-digit account number"
                value={accountNumber}
                maxLength={10}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10)
                  setAccountNumber(val)
                  if (val.length < 10) setAccountName("")
                }}
                required
              />
              {accountNumber.length > 0 && accountNumber.length < 10 && (
                <p className="text-xs font-semibold text-gray-400">
                  {10 - accountNumber.length} more digit
                  {10 - accountNumber.length !== 1 ? "s" : ""} needed
                </p>
              )}
            </div>

            {/* Account name (auto-filled) */}
            {(shouldVerify || accountName) && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-bold text-gray-900">Account Name</Label>
                {isFetchingVerify ? (
                  <div className="h-11 animate-pulse rounded-[14px] bg-gray-100" />
                ) : (
                  <Input
                    variant="auth"
                    value={accountName}
                    readOnly
                    className="cursor-not-allowed bg-gray-50 text-gray-600"
                    placeholder="Verifying..."
                  />
                )}
              </div>
            )}

            <div className={mode === "edit" ? "flex gap-3" : ""}>
              {mode === "edit" && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 flex-1 rounded-full border-gray-200"
                  onClick={() => {
                    resetForm()
                    setMode("view")
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className={`h-12 rounded-full ${mode === "edit" ? "flex-1" : "w-full"}`}
                disabled={!accountName || !bankCode || accountNumber.length !== 10}
                loading={isPending}
              >
                {mode === "edit" ? "Update Information" : "Submit Information"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function DisputeCard() {
  const [disputeType, setDisputeType] = useState<DisputeType | "">("")
  const [comments, setComments] = useState("")

  const { mutate: submitDispute, isPending } = useSubmitDispute({
    onSuccess: () => {
      toast.success("Dispute submitted successfully!")
      setDisputeType("")
      setComments("")
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!disputeType || !comments.trim()) return
    submitDispute({ dispute_type: disputeType, comments: comments.trim() })
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/86 shadow-[0_18px_50px_rgba(16,24,40,0.08)]">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-extrabold text-gray-900">Submit a Dispute</h2>
        <p className="mt-0.5 text-xs font-semibold text-gray-500">
          Raise a concern about your commission or payout.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">Dispute Type</Label>
          <Select value={disputeType} onValueChange={(v) => setDisputeType(v as DisputeType)}>
            <SelectTrigger className="h-11!" variant="auth">
              <SelectValue placeholder="Select dispute type" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(DISPUTE_TYPE_LABELS) as DisputeType[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {DISPUTE_TYPE_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">Comments</Label>
          <textarea
            placeholder="Describe your dispute in detail..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            required
            rows={5}
            className="w-full resize-none rounded-[14px] border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-primary focus:shadow-[0_0_0_4px_rgba(137,0,235,0.10)]"
          />
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-full"
          disabled={!disputeType || !comments.trim()}
          loading={isPending}
        >
          Submit Dispute
        </Button>
      </form>
    </div>
  )
}
