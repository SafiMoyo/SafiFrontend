"use client"

import { useState } from "react"
import { Eye, EyeOff, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useMutateResetPassword } from "@/services/auth/mutations"
import { toast } from "sonner"

type Visibility = {
  current: boolean
  newPw: boolean
  confirm: boolean
}

export function SecurityCard() {
  const [current, setCurrent] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirm, setConfirm] = useState("")
  const [show, setShow] = useState<Visibility>({
    current: false,
    newPw: false,
    confirm: false,
  })

  const toggleShow = (field: keyof Visibility) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }))

  const { mutate: changePassword, isPending } = useMutateResetPassword({
    onSuccess: () => {
      toast.success("Password changed successfully")
      setCurrent("")
      setNewPw("")
      setConfirm("")
    },
  })

  const handleSave = () => {
    if (newPw !== confirm) {
      toast.error("New passwords do not match")
      return
    }
    changePassword({ old_password: current, new_password: newPw })
  }

  const canSave = current.length > 0 && newPw.length > 0 && confirm.length > 0

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Shield size={18} className="text-primary" />
        <h2 className="font-bold text-gray-900">Security</h2>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">
            Current Password
          </Label>
          <div className="relative">
            <Input
              variant="auth"
              type={show.current ? "text" : "password"}
              placeholder="••••••••"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => toggleShow("current")}
              aria-label={show.current ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-purple-400 transition-opacity hover:opacity-70"
            >
              {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">
            New Password
          </Label>
          <div className="relative">
            <Input
              variant="auth"
              type={show.newPw ? "text" : "password"}
              placeholder="Enter new password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => toggleShow("newPw")}
              aria-label={show.newPw ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-purple-400 transition-opacity hover:opacity-70"
            >
              {show.newPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              variant="auth"
              type={show.confirm ? "text" : "password"}
              placeholder="Repeat new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => toggleShow("confirm")}
              aria-label={show.confirm ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-purple-400 transition-opacity hover:opacity-70"
            >
              {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="button"
          className="h-12 w-full rounded-lg"
          onClick={handleSave}
          loading={isPending}
          disabled={!canSave}
        >
          Save changes
        </Button>
      </div>
    </div>
  )
}
