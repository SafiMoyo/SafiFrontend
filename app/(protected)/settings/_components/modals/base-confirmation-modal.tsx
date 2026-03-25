"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertTriangle, Sparkles } from "lucide-react"

type BaseConfirmationModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  confirmLoading?: boolean
  tone?: "purple" | "danger"
}

export function BaseConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Yes",
  cancelLabel = "No",
  onConfirm,
  confirmLoading,
  tone = "purple",
}: BaseConfirmationModalProps) {
  const isDanger = tone === "danger"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-xl overflow-hidden rounded-md border border-slate-200 bg-white p-0 shadow-2xl"
        )}
      >
        <div
          className={cn(
            "px-6 py-5 sm:px-8",
            isDanger
              ? "bg-linear-to-r from-amber-50 via-orange-50 to-rose-50"
              : "bg-linear-to-r from-indigo-50 via-violet-50 to-cyan-50"
          )}
        >
          <div
            className={cn(
              "mx-auto flex size-12 items-center justify-center rounded-2xl",
              isDanger
                ? "bg-orange-100 text-orange-700"
                : "bg-violet-100 text-violet-700"
            )}
          >
            {isDanger ? <AlertTriangle size={22} /> : <Sparkles size={22} />}
          </div>

          <DialogTitle
            className={cn(
              "mt-4 text-center text-2xl font-extrabold tracking-tight",
              isDanger ? "text-orange-900" : "text-slate-900"
            )}
          >
            {title}
          </DialogTitle>
        </div>

        <div className="px-6 pb-7 sm:px-8">
          <DialogDescription
            className={cn(
              "mx-auto mt-5 max-w-lg text-center text-sm leading-relaxed sm:text-base",
              isDanger ? "text-slate-700" : "text-slate-700"
            )}
          >
            {description}
          </DialogDescription>

          <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-11 border-slate-300 px-7 text-slate-700 hover:bg-slate-100"
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              className={cn(
                "h-11 px-7 font-semibold",
                isDanger
                  ? "bg-orange-600 text-white hover:bg-orange-700"
                  : "bg-primary text-white hover:bg-primary/90"
              )}
              onClick={onConfirm}
              loading={confirmLoading}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
