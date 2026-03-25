"use client"

import { FormEvent, useState } from "react"
import Image from "next/image"
import { ArrowLeftIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  useMutateForgotPassword,
  useMutateResetPassword,
} from "@/services/auth/mutations"
import { toast } from "sonner"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
}

type ForgotFormState = {
  email: string
  token: string
  newPassword: string
  confirmPassword: string
  isResetStep: boolean
}

export function ForgotPasswordModal({ open, onOpenChange, onBack }: Props) {
  const [form, setForm] = useState<ForgotFormState>({
    email: "",
    token: "",
    newPassword: "",
    confirmPassword: "",
    isResetStep: false,
  })

  const set = <K extends keyof ForgotFormState>(
    key: K,
    value: ForgotFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const forgotPassword = useMutateForgotPassword({
    onSuccess: () => {
      toast.success("Reset code sent. Check your email.")
      set("isResetStep", true)
    },
  })

  const resetPassword = useMutateResetPassword({
    onSuccess: () => {
      toast.success("Password updated successfully.")
      setForm({
        email: "",
        token: "",
        newPassword: "",
        confirmPassword: "",
        isResetStep: false,
      })
      onOpenChange(false)
      onBack()
    },
  })

  const handleRequestReset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    forgotPassword.mutate({ email: form.email })
  }

  const handleResetPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    resetPassword.mutate({
      email: form.email,
      token: form.token,
      new_password: form.newPassword,
    })
  }

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
          <DialogTitle className="text-2xl font-extrabold text-gray-900">
            Reset Password
          </DialogTitle>
          <p className="mt-1 text-sm font-semibold text-gray-500">
            {form.isResetStep
              ? "Enter the code from your email and choose a new password"
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {!form.isResetStep ? (
          <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900">Email</Label>
              <Input
                variant="auth"
                type="email"
                placeholder="Type in here"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full"
              loading={forgotPassword.isPending}
            >
              Send Reset Link
            </Button>

            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center gap-1.5 text-sm font-semibold text-primary transition-opacity hover:opacity-70"
            >
              <ArrowLeftIcon className="size-3.5" />
              Back to Log In
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900">
                Reset Code
              </Label>
              <Input
                variant="auth"
                placeholder="Enter code"
                value={form.token}
                onChange={(e) => set("token", e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900">
                New Password
              </Label>
              <Input
                variant="auth"
                type="password"
                placeholder="Type in here"
                value={form.newPassword}
                onChange={(e) => set("newPassword", e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900">
                Confirm Password
              </Label>
              <Input
                variant="auth"
                type="password"
                placeholder="Type in here"
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full"
              loading={resetPassword.isPending}
            >
              Update Password
            </Button>

            <button
              type="button"
              onClick={() => set("isResetStep", false)}
              className="flex items-center justify-center gap-1.5 text-sm font-semibold text-primary transition-opacity hover:opacity-70"
            >
              <ArrowLeftIcon className="size-3.5" />
              Back to Email Step
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
