"use client"

import { FormEvent, useState } from "react"
import Image from "next/image"
import { ArrowLeftIcon, Eye, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  useMutateForgotPassword,
  useMutateResetPassword,
} from "@/services/auth/mutations"
import { passwordRules, PasswordStrength } from "@/components/ui/password-strength"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
}

type Step = "email" | "reset" | "success"

type ForgotFormState = {
  email: string
  otp: string
  newPassword: string
  confirmPassword: string
  showPassword: boolean
  showConfirmPassword: boolean
}

const initialForm: ForgotFormState = {
  email: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
  showPassword: false,
  showConfirmPassword: false,
}

export function ForgotPasswordModal({ open, onOpenChange, onBack }: Props) {
  const [step, setStep] = useState<Step>("email")
  const [form, setForm] = useState<ForgotFormState>(initialForm)

  const set = <K extends keyof ForgotFormState>(
    key: K,
    value: ForgotFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const forgotPassword = useMutateForgotPassword({
    onSuccess: () => {
      setStep("reset")
    },
  })

  const resetPassword = useMutateResetPassword({
    onSuccess: () => {
      setStep("success")
    },
  })

  const handleRequestReset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    forgotPassword.mutate({ email: form.email })
  }

  const handleResetPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetPassword.mutate({
      otp: form.otp,
      newPassword: form.newPassword,
    })
  }

  const handleProceedToLogin = () => {
    setStep("email")
    setForm(initialForm)
    onOpenChange(false)
    onBack()
  }

  const passwordValid = passwordRules.every((r) => r.test(form.newPassword))
  const passwordsMatch = form.confirmPassword === form.newPassword

  const subtextMap: Record<Step, string> = {
    email: "Enter your email and we'll send you an OTP to reset your password",
    reset: "Proceed to reset your password",
    success: "Password reset successful",
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
            {subtextMap[step]}
          </p>
        </div>

        {step === "email" && (
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
              Continue
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
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900">OTP</Label>
              <Input
                variant="auth"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={(e) => set("otp", e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900">
                New Password
              </Label>
              <div className="relative">
                <Input
                  variant="auth"
                  type={form.showPassword ? "text" : "password"}
                  placeholder="Type in here"
                  value={form.newPassword}
                  onChange={(e) => set("newPassword", e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  aria-label={form.showPassword ? "Hide password" : "Show password"}
                  onClick={() => set("showPassword", !form.showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-opacity hover:opacity-70"
                >
                  {form.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.newPassword.length > 0 && (
                <PasswordStrength password={form.newPassword} />
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  variant="auth"
                  type={form.showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  aria-label={
                    form.showConfirmPassword ? "Hide password" : "Show password"
                  }
                  onClick={() =>
                    set("showConfirmPassword", !form.showConfirmPassword)
                  }
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-opacity hover:opacity-70"
                >
                  {form.showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {form.confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs font-medium text-red-500">
                  Passwords do not match
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full"
              loading={resetPassword.isPending}
              disabled={!form.otp || !passwordValid || !passwordsMatch}
            >
              Submit
            </Button>

            <button
              type="button"
              onClick={() => setStep("email")}
              className="flex items-center justify-center gap-1.5 text-sm font-semibold text-primary transition-opacity hover:opacity-70"
            >
              <ArrowLeftIcon className="size-3.5" />
              Back to Email Step
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm font-semibold text-gray-700">
              Proceed to login
            </p>
            <Button
              type="button"
              className="h-12 w-full rounded-full"
              onClick={handleProceedToLogin}
            >
              Proceed
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
