"use client"

import Image from "next/image"
import { ArrowLeftIcon } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
}

export function ForgotPasswordModal({ open, onOpenChange, onBack }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg gap-0 overflow-y-auto bg-white p-6">
        <div className="mb-4 flex justify-center">
          <Image
            src="/images/logo.svg"
            alt="Safi"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">Reset Password</h2>
          <p className="mt-1 text-sm font-semibold text-gray-500">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900">Email</Label>
            <Input variant="auth" type="email" placeholder="Type in here" />
          </div>

          <Button className="h-12 w-full rounded-full">Send Reset Link</Button>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-primary transition-opacity hover:opacity-70"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to Log In
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
