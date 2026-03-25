"use client"

import { HeartCrack } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type AccountDeletedModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function AccountDeletedModal({
  open,
  onOpenChange,
  onClose,
}: AccountDeletedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl"
      >
        <div className="bg-linear-to-r from-slate-50 via-zinc-50 to-stone-50 px-6 py-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
            <HeartCrack size={24} />
          </div>
          <DialogTitle className="mt-4 text-center text-3xl font-extrabold text-slate-900">
            Account deleted
          </DialogTitle>
        </div>

        <div className="px-6 pb-7 text-center">
          <DialogDescription className="mt-5 text-base leading-relaxed text-slate-700">
            Your account and associated data have been removed.
          </DialogDescription>

          <Button
            type="button"
            className="mt-7 h-11 rounded-xl px-8"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
