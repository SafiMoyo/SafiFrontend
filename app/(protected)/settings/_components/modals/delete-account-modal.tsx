"use client"

import { useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { AlertTriangle, ShieldAlert, Trash2 } from "lucide-react"

type DeleteAccountModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDelete: (payload: { reasons: string[] }) => void
  isDeleting?: boolean
}

const REASONS = [
  "Too expensive",
  "Not enough content",
  "Technical issues",
  "Child lost interest",
  "Switching to another platform",
]

const DELETION_ITEMS = [
  "All child profiles and learning progress",
  "Saved videos and favourites",
  "Achievements and badges",
  "Subscription records and settings",
]

export function DeleteAccountModal({
  open,
  onOpenChange,
  onConfirmDelete,
  isDeleting,
}: DeleteAccountModalProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [typedWord, setTypedWord] = useState("")
  const [agreed, setAgreed] = useState(false)

  const canDelete = useMemo(
    () => typedWord.trim().toUpperCase() === "DELETE" && agreed,
    [typedWord, agreed]
  )

  const toggleReason = (reason: string) =>
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    )

  const resetForm = () => {
    setSelectedReasons([])
    setTypedWord("")
    setAgreed(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm()
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-full !max-w-lg flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-2xl"
      >
        {/* ── Fixed Header ── */}
        <div className="shrink-0 bg-gradient-to-r from-amber-50 via-red-50 to-rose-50 px-6 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <ShieldAlert size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Delete Account
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                This is permanent and cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* What gets deleted */}
          <div className="rounded-xl border border-red-200 bg-red-50/60 p-4">
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold tracking-widest text-red-800 uppercase">
              <AlertTriangle size={13} />
              What will be deleted
            </p>
            <ul className="space-y-1.5">
              {DELETION_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-700"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-amber-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Reason chips */}
          <div>
            <p className="mb-2.5 text-sm font-semibold text-slate-800">
              Why are you leaving?{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((reason) => {
                const selected = selectedReasons.includes(reason)
                return (
                  <button
                    type="button"
                    key={reason}
                    onClick={() => toggleReason(reason)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                      selected
                        ? "border-red-600 bg-red-50 text-red-600"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                    )}
                  >
                    {reason}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Type DELETE */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Type{" "}
              <span className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs font-bold text-slate-900">
                DELETE
              </span>{" "}
              to confirm
            </p>
            <Input
              variant="auth"
              value={typedWord}
              onChange={(e) => setTypedWord(e.target.value)}
              placeholder="DELETE"
              className="mt-3 h-11 rounded-lg border-slate-300 bg-white font-mono text-sm tracking-widest placeholder:font-sans placeholder:tracking-normal"
            />
          </div>

          {/* Agree checkbox */}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-700 transition-colors hover:bg-slate-50">
            <Checkbox
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(Boolean(checked))}
              className="mt-0.5 size-4 shrink-0"
            />
            <span>
              I understand this action is <strong>permanent</strong> and cannot
              be undone.
            </span>
          </label>
        </div>

        {/* ── Fixed Footer ── */}
        <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-100 bg-white px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-lg border-slate-200 px-5 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-10 rounded-lg px-5 text-sm font-semibold"
            disabled={!canDelete || isDeleting}
            loading={isDeleting}
            onClick={() => onConfirmDelete({ reasons: selectedReasons })}
          >
            <Trash2 size={15} className="mr-1.5" />
            {isDeleting ? "Deleting…" : "Delete Account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
