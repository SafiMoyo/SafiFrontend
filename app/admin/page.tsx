"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  useAdminLogin,
  useAdminLoginWithDeviceToken,
} from "@/services/admin-auth/mutations"

const ADMIN_EMAIL_KEY = "admin_email"
const ADMIN_DEVICE_TOKEN_KEY = "admin_device_token"

export default function AdminLoginPage() {
  const router = useRouter()
  const [stage, setStage] = useState<"checking" | "form">("checking")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const hasChecked = useRef(false)

  const loginWithDevice = useAdminLoginWithDeviceToken({
    onSuccess: (res) => {
      if (res?.data?.access_token) {
        localStorage.setItem("admin_access_token", res.data.access_token)
        localStorage.setItem("admin_refresh_token", res.data.refresh_token)
        router.push("/admin/dashboard")
      } else {
        setStage("form")
      }
    },
    onError: () => {
      localStorage.removeItem(ADMIN_DEVICE_TOKEN_KEY)
      localStorage.removeItem(ADMIN_EMAIL_KEY)
      setStage("form")
    },
  })

  const adminLogin = useAdminLogin({
    onSuccess: () => {
      toast.success("Verification code sent to your email")
      router.push(`/admin/verify-otp?email=${encodeURIComponent(email)}`)
    },
    onError: () => {
      setStage("form")
    },
  })

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true

    const storedEmail = localStorage.getItem(ADMIN_EMAIL_KEY)
    const deviceToken = localStorage.getItem(ADMIN_DEVICE_TOKEN_KEY)

    if (storedEmail && deviceToken) {
      loginWithDevice.mutate({
        email_address: storedEmail,
        device_token: deviceToken,
      })
    } else {
      setStage("form")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    adminLogin.mutate({ email_address: email, password })
  }

  if (stage === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-purple-100/40">
        <Loader className="animate-spin text-purple-500" size={28} />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-100/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900">Email</Label>
            <Input
              variant="auth"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900">Password</Label>
            <div className="relative">
              <Input
                variant="auth"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-opacity hover:opacity-70"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="mt-1 h-12 w-full rounded-full"
            loading={adminLogin.isPending}
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}
