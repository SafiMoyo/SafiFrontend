"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

type Props = {
  onForgotPassword?: () => void
}

export function LogInForm({ onForgotPassword }: Props) {
  const [remember, setRemember] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-bold text-gray-900">Email</Label>
        <Input variant="auth" type="email" placeholder="Type in here" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-bold text-gray-900">Password</Label>
        <Input variant="auth" type="password" placeholder="Type in here" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(v) => setRemember(!!v)}
          />
          <label htmlFor="remember" className="cursor-pointer text-xs text-gray-700">
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

      <Button className="h-12 rounded-full">Log In</Button>
    </div>
  )
}
