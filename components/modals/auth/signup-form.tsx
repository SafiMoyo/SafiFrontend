"use client"

import { FormEvent, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useSignupUser } from "@/services/auth/mutations"
import { parseAuthPayload, persistAuthSession, extractResponseData } from "@/services/auth/session"
import { toast } from "sonner"
import { useAuthContext } from "@/context"

type SignupFormState = {
  firstName: string
  lastName: string
  email: string
  password: string
  ageGroup: string
  accountType: string
  agreed: boolean
  showPassword: boolean
}

type Props = {
  onAuthSuccess?: (accountType: string) => void
}

export function SignUpForm({ onAuthSuccess }: Props) {
  const [form, setForm] = useState<SignupFormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    ageGroup: "",
    accountType: "",
    agreed: false,
    showPassword: false,
  })
  const { setLoggedIn } = useAuthContext()

  const set = <K extends keyof SignupFormState>(
    key: K,
    value: SignupFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const signup = useSignupUser({
    onSuccess: (response) => {
      const authPayload = parseAuthPayload(response)
      persistAuthSession(authPayload)
      const data = extractResponseData(response)
      const user = data.user as Record<string, unknown> | undefined
      const accountType = (user?.account_type as string) ?? "INDIVIDUAL"
      setLoggedIn(true)
      toast.success("Your account has been created.")
      onAuthSuccess?.(accountType)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    signup.mutate({
      first_name: form.firstName,
      last_name: form.lastName,
      email_address: form.email,
      password: form.password,
      age_group: form.ageGroup,
      account_type: form.accountType,
      accepted_terms: form.agreed,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-h-[55vh] flex-col">
      <div className="space-y-4 overflow-y-auto pr-1">
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

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">Age group</Label>
          <Select
            value={form.ageGroup}
            onValueChange={(v) => set("ageGroup", v)}
          >
            <SelectTrigger className="h-11!" variant="auth">
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-13">Under 13</SelectItem>
              <SelectItem value="13-17">13–17</SelectItem>
              <SelectItem value="18-24">18–24</SelectItem>
              <SelectItem value="25-34">25–34</SelectItem>
              <SelectItem value="35+">35+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">Account</Label>
          <Select
            value={form.accountType}
            onValueChange={(v) => set("accountType", v)}
          >
            <SelectTrigger className="h-11!" variant="auth">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INDIVIDUAL">Individual</SelectItem>
              <SelectItem value="FAMILY">Family</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-start gap-2.5">
          <Checkbox
            id="terms"
            checked={form.agreed}
            onCheckedChange={(v) => set("agreed", !!v)}
            className="mt-0.5 shrink-0"
          />
          <label
            htmlFor="terms"
            className="cursor-pointer text-xs leading-relaxed text-gray-700"
          >
            I agree to the{" "}
            <a
              href="/terms"
              className="font-semibold text-primary hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="font-semibold text-primary hover:underline"
            >
              Privacy Policy
            </a>
            .
          </label>
        </div>
      </div>

      <div className="sticky bottom-0 mt-4 border-t border-purple-100 bg-white pt-4">
        <Button
          type="submit"
          className="h-12 w-full rounded-full"
          disabled={!form.agreed || !form.ageGroup || !form.accountType}
          loading={signup.isPending}
        >
          Create Account
        </Button>
      </div>
    </form>
  )
}
