"use client"

import { Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

type LessonLimitModalProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubscribe: () => void
}

export function LessonLimitModal({
  open,
  onOpenChange,
  onSubscribe,
}: LessonLimitModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl"
      >
        {/* gradient header */}
        <div className="bg-linear-to-r from-indigo-50 via-violet-50 to-cyan-50 px-6 py-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Lock size={24} />
          </div>
          <DialogTitle className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Lesson Limit Reached
          </DialogTitle>
        </div>

        {/* body */}
        <div className="px-6 pb-7 pt-5">
          <DialogDescription className="mx-auto max-w-xs text-center text-sm leading-relaxed text-slate-600">
            You&apos;ve reached the free lesson limit. Subscribe to unlock all
            lessons and continue your learning journey.
          </DialogDescription>

          <div className="mt-7 flex flex-col gap-3">
            <Button
              type="button"
              className="h-11 w-full rounded-full font-semibold"
              onClick={onSubscribe}
            >
              <Sparkles size={15} className="mr-1.5" />
              Subscribe Now
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-full border-slate-300 text-slate-700"
              onClick={() => onOpenChange(false)}
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
