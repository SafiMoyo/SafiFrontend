"use client"

import { FormEvent, useContext, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useLoginUser } from "@/services/auth/mutations"
import { persistAuthSession, parseAuthPayload, extractResponseData } from "@/services/auth/session"
import { AuthContext } from "@/context/auth"
import { UserType } from "@/types/user"
import { toast } from "sonner"

type LoginFormState = {
  email: string
  password: string
  remember: boolean
  showPassword: boolean
}

type Props = {
  onForgotPassword?: () => void
  onAuthSuccess?: (accountType: string) => void
}

export function LogInForm({ onForgotPassword, onAuthSuccess }: Props) {
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    remember: false,
    showPassword: false,
  })
  const { setLoggedIn, setActiveUser } = useContext(AuthContext)

  const set = <K extends keyof LoginFormState>(
    key: K,
    value: LoginFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const { mutate, isPending } = useLoginUser({
    onSuccess: (response) => {
      persistAuthSession(parseAuthPayload(response), form.remember)
      const data = extractResponseData(response)
      const user = data.user as UserType | undefined
      const accountType = user?.account_type ?? "INDIVIDUAL"
      if (user) setActiveUser(user)
      setLoggedIn(true)
      toast.success("Welcome back!")
      onAuthSuccess?.(accountType)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutate({
      email_address: form.email,
      password: form.password,
      remember_me: form.remember,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={form.remember}
            onCheckedChange={(v) => set("remember", !!v)}
          />
          <label
            htmlFor="remember"
            className="cursor-pointer text-xs text-gray-700"
          >
            Remember me
          </label>
        </div>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" className="h-12 rounded-full" loading={isPending}>
        Log In
      </Button>
    </form>
  )
}
