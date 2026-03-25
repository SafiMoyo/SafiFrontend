"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BadgeCheck, Sparkles } from "lucide-react"

type CancelSubscriptionSuccessModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CancelSubscriptionSuccessModal({
  open,
  onOpenChange,
}: CancelSubscriptionSuccessModalProps) {
  const nextSteps = [
    "You keep premium access until your current billing cycle ends.",
    "Your learning data remains available while your account stays active.",
    "You can reactivate at any time from Subscription settings.",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl"
      >
        <div className="bg-linear-to-r from-violet-50 via-indigo-50 to-cyan-50 px-6 py-5 sm:px-8">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <BadgeCheck size={22} />
          </div>
          <DialogTitle className="mt-4 text-center text-2xl font-extrabold tracking-tight sm:text-3xl">
            Subscription Cancelled
          </DialogTitle>
        </div>

        <div className="px-6 pb-7 sm:px-8">
          <DialogDescription className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-slate-700 sm:text-base">
            Your subscription has been cancelled. You will continue to have
            access until the end of your billing period.
          </DialogDescription>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide text-slate-900 uppercase">
              <Sparkles size={14} className="text-violet-600" />
              What Happens Next
            </p>
            <ul className="space-y-2.5 text-sm text-slate-700">
              {nextSteps.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-5 text-center text-base font-semibold text-slate-900 sm:text-lg">
            Thank you for being part of our learning community.
          </p>
          <p className="mt-1 text-center text-xs tracking-wide text-slate-500 uppercase">
            We hope to see you again in the future.
          </p>

          <Button
            type="button"
            className="mx-auto mt-6 h-11 rounded-xl px-8"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
