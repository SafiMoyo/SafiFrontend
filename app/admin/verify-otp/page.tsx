"use client"

import { FormEvent, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useAdminVerifyOtp } from "@/services/admin-auth/mutations"

const ADMIN_EMAIL_KEY = "admin_email"
const ADMIN_DEVICE_TOKEN_KEY = "admin_device_token"

function OtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""

  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const verifyOtp = useAdminVerifyOtp({
    onSuccess: (res) => {
      const data = res?.data
      if (!data?.access_token) {
        toast.error("Something went wrong. Please try again.")
        return
      }

      localStorage.setItem("admin_access_token", data.access_token)
      localStorage.setItem("admin_refresh_token", data.refresh_token)
      localStorage.setItem(ADMIN_EMAIL_KEY, email)

      if (data.device_token) {
        localStorage.setItem(ADMIN_DEVICE_TOKEN_KEY, data.device_token)
      }

      toast.success(res.message ?? "Login successful!")
      router.push("/admin/dashboard")
    },
  })

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
    if (!pasted) return
    const next = [...digits]
    pasted.split("").forEach((char, i) => {
      next[i] = char
    })
    setDigits(next)
    const focusIndex = Math.min(pasted.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const otp = digits.join("")
    if (otp.length < 6) {
      toast.error("Please enter all 6 digits")
      return
    }
    verifyOtp.mutate({ email_address: email, otp, trust_device: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-100/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Verify OTP
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-gray-700">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex w-full justify-between gap-1.5">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="h-12 min-w-0 flex-1 rounded-xl border border-purple-200 bg-purple-50 text-center text-lg font-semibold text-gray-900 outline-none transition-colors placeholder:text-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-full"
            loading={verifyOtp.isPending}
          >
            Continue
          </Button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600"
        >
          Back to login
        </button>
      </div>
    </div>
  )
}

export default function AdminVerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-purple-100/40" />
      }
    >
      <OtpForm />
    </Suspense>
  )
}
