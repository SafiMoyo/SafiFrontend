"use client"

import { MailCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type MessageSentModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MessageSentModal({
  open,
  onOpenChange,
}: MessageSentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl"
      >
        <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-cyan-50 px-6 py-3">
          <div className="mx-auto flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <MailCheck size={18} />
          </div>
          <DialogTitle className="mt-4 text-center text-2xl font-extrabold text-slate-900">
            Message sent
          </DialogTitle>
        </div>

        <div className="px-6 pb-7 text-center">
          <DialogDescription className="mt-5 text-base leading-relaxed text-slate-700">
            Thanks for reaching out.
            <br />
            We&apos;ll get back to you shortly.
          </DialogDescription>

          <Button
            type="button"
            className="mt-7 h-11 px-8"
            onClick={() => onOpenChange(false)}
          >
            Okay!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
