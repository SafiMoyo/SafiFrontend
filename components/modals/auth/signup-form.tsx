"use client"

import { useState } from "react"
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

export function SignUpForm() {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-bold text-gray-900">Name</Label>
        <Input variant="auth" placeholder="Type in here" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-bold text-gray-900">Email</Label>
        <Input variant="auth" type="email" placeholder="Type in here" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-bold text-gray-900">Password</Label>
        <Input variant="auth" type="password" placeholder="Type in here" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-bold text-gray-900">Age group</Label>

        <Select>
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

      <div className="flex items-start gap-2.5">
        <Checkbox
          id="terms"
          checked={agreed}
          onCheckedChange={(v) => setAgreed(!!v)}
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

      <Button className="h-12 rounded-full">Create Account</Button>
    </div>
  )
}
