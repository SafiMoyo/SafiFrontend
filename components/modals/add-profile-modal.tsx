"use client"

import { FormEvent, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useAddFamilyMember } from "@/services/auth/mutations"
import { toast } from "sonner"

type FormState = {
  firstName: string
  lastName: string
  ageGroup: string
}

const EMPTY_FORM: FormState = { firstName: "", lastName: "", ageGroup: "" }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded?: () => void
}

export function AddProfileModal({ open, onOpenChange, onAdded }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const { mutate, isPending } = useAddFamilyMember({
    onSuccess: () => {
      toast.success("Profile added!")
      setForm(EMPTY_FORM)
      onOpenChange(false)
      onAdded?.()
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({
      first_name: form.firstName,
      last_name: form.lastName,
      age_group: form.ageGroup,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm gap-0 rounded-3xl bg-white p-8">
        <DialogTitle className="mb-6 text-center text-2xl font-extrabold text-gray-900">
          Add Profile
        </DialogTitle>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900">
              First Name
            </Label>
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

          <Select value={form.ageGroup} onValueChange={(v) => set("ageGroup", v)}>
            <SelectTrigger className="h-12" variant="auth">
              <SelectValue placeholder="Age Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Early Level 4-8">Early Level 4–8</SelectItem>
              <SelectItem value="Middle Level 9-13">Middle Level 9–13</SelectItem>
              <SelectItem value="Advanced 14-18">Advanced 14–18</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="submit"
            className="mt-2 h-12 w-full rounded-full"
            disabled={!form.firstName.trim() || !form.lastName.trim() || !form.ageGroup}
            loading={isPending}
          >
            Save Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
