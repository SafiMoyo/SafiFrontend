"use client"

import { FormEvent, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRegisterPartner } from "@/services/auth/mutations"
import { parseAuthPayload, persistAuthSession, extractResponseData } from "@/services/auth/session"
import { toast } from "sonner"
import { useAuthContext } from "@/context"
import { UserType } from "@/types/user"
import { passwordRules, PasswordStrength } from "@/components/ui/password-strength"

type PartnerSignupFormState = {
  firstName: string
  lastName: string
  username: string
  email: string
  organizationName: string
  password: string
  confirmPassword: string
  showPassword: boolean
  showConfirmPassword: boolean
}

type Props = {
  onAuthSuccess?: (userRole?: string) => void
}

export function PartnerSignupForm({ onAuthSuccess }: Props) {
  const [form, setForm] = useState<PartnerSignupFormState>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    organizationName: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  })
  const { setLoggedIn, setActiveUser } = useAuthContext()

  const set = <K extends keyof PartnerSignupFormState>(
    key: K,
    value: PartnerSignupFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const register = useRegisterPartner({
    onSuccess: (response) => {
      const authPayload = parseAuthPayload(response)
      persistAuthSession(authPayload)
      const data = extractResponseData(response)
      const user = data.user as UserType | undefined
      const userRole = user?.user_role
      if (user) setActiveUser(user)
      setLoggedIn(true)
      toast.success("Your partner account has been created.")
      onAuthSuccess?.(userRole)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    register.mutate({
      first_name: form.firstName,
      last_name: form.lastName,
      username: form.username,
      email_address: form.email,
      organization_name: form.organizationName,
      password: form.password,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">First Name</Label>
          <Input
            variant="auth"
            placeholder="Type in here"
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">Last Name</Label>
          <Input
            variant="auth"
            placeholder="Type in here"
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">Username</Label>
          <Input
            variant="auth"
            placeholder="Type in here"
            value={form.username}
            onChange={(e) => set("username", e.target.value)}
            required
          />
        </div>

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
          <Label className="text-sm font-bold text-gray-900">Organization Name</Label>
          <Input
            variant="auth"
            placeholder="Type in here"
            value={form.organizationName}
            onChange={(e) => set("organizationName", e.target.value)}
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
          {form.password.length > 0 && (
            <PasswordStrength password={form.password} />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">Confirm Password</Label>
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
              aria-label={form.showConfirmPassword ? "Hide password" : "Show password"}
              onClick={() => set("showConfirmPassword", !form.showConfirmPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-opacity hover:opacity-70"
            >
              {form.showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.confirmPassword.length > 0 && form.confirmPassword !== form.password && (
            <p className="text-xs font-medium text-red-500">Passwords do not match</p>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 mt-4 border-t border-purple-100 bg-white pt-4">
        <Button
          type="submit"
          className="h-12 w-full rounded-full"
          disabled={
            passwordRules.some((r) => !r.test(form.password)) ||
            form.confirmPassword !== form.password
          }
          loading={register.isPending}
        >
          Create Partner Account
        </Button>
      </div>
    </form>
  )
}
