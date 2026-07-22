"use client"

import { FormEvent, useContext, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useLoginUser } from "@/services/auth/mutations"
import { persistAuthSession, parseAuthPayload, extractResponseData } from "@/services/auth/session"
import { AuthContext } from "@/context/auth"
import { UserType } from "@/types/user"
import { toast } from "sonner"

type PartnerLoginFormState = {
  email: string
  password: string
  showPassword: boolean
}

type Props = {
  onForgotPassword?: () => void
  onAuthSuccess?: (userRole?: string) => void
}

export function PartnerLoginForm({ onForgotPassword, onAuthSuccess }: Props) {
  const [form, setForm] = useState<PartnerLoginFormState>({
    email: "",
    password: "",
    showPassword: false,
  })
  const { setLoggedIn, setActiveUser } = useContext(AuthContext)

  const set = <K extends keyof PartnerLoginFormState>(
    key: K,
    value: PartnerLoginFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const { mutate, isPending } = useLoginUser({
    onSuccess: (response) => {
      persistAuthSession(parseAuthPayload(response))
      const data = extractResponseData(response)
      const user = data.user as UserType | undefined
      const userRole = user?.user_role
      if (user) setActiveUser(user)
      setLoggedIn(true)
      toast.success("Welcome back!")
      onAuthSuccess?.(userRole)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutate({
      email_address: form.email,
      password: form.password,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-bold text-gray-900">Email Address</Label>
        <Input
          variant="auth"
          type="email"
          placeholder="Type in here"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-bold text-gray-900">Password</Label>
        <div className="relative">
          <Input
            variant="auth"
            type={form.showPassword ? "text" : "password"}
            placeholder="Type in here"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
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
      </div>

      {onForgotPassword && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>
      )}

      <Button type="submit" className="h-12 rounded-full" loading={isPending}>
        Log In
      </Button>
    </form>
  )
}
