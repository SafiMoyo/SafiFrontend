"use client"

import { useEffect, useState } from "react"
import { User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context"
import { useMutateUpdateProfile } from "@/services/auth/mutations"
import { toast } from "sonner"
import { ProfileForm } from "../utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AGE_GROUP_OPTIONS } from "@/components/ui/age-group-select"

export function ProfileCard() {
  const { activeUser } = useAuthContext()

  const [form, setForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    email: "",
    ageGroup: "",
    avatarPreview: null,
  })

  useEffect(() => {
    if (activeUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        firstName: activeUser.first_name ?? "",
        lastName: activeUser.last_name ?? "",
        email: activeUser.email_address ?? "",
        ageGroup: activeUser.age_group ?? "",
        avatarPreview: activeUser.profile_picture || null,
      })
    }
  }, [activeUser])

  const setField = (key: keyof ProfileForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const { mutate: updateProfile, isPending: isSaving } = useMutateUpdateProfile(
    {
      onSuccess: () => toast.success("Profile updated"),
    }
  )

  const handleSave = () => {
    updateProfile({
      first_name: form.firstName,
      last_name: form.lastName,
      age_group: form.ageGroup,
    })
  }

  const displayName =
    [activeUser?.first_name, activeUser?.last_name].filter(Boolean).join(" ") ||
    "User"

  const initials = displayName.slice(0, 1).toUpperCase()

  const memberSince = activeUser?.date_created
    ? new Date(activeUser.date_created).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "N/A"

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Avatar + name row */}
      <div className="mb-5 flex items-center gap-4">
        {/* Display-only avatar — upload on /settings/profile */}
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-2xl font-bold text-white shadow-md">
          {form.avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.avatarPreview}
              alt="Profile"
              className="size-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* Name + member since */}
        <div>
          <p className="text-lg font-bold text-gray-900">{displayName}</p>
          <p className="mt-0.5 text-xs text-gray-500">Member since {memberSince}</p>
        </div>
      </div>

      {/* Profile label — below avatar row, left-aligned */}
      <div className="mb-4 flex items-center gap-2">
        <User size={18} className="text-primary" />
        <h2 className="font-bold text-gray-900">Profile</h2>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-black uppercase">
              First Name
            </Label>
            <Input
              variant="auth"
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-black uppercase">Last Name</Label>
            <Input
              variant="auth"
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-black uppercase">Email</Label>
          <Input
            disabled
            variant="auth"
            type="email"
            placeholder="your@email.com"
            className="disabled:cursor-not-allowed"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-black uppercase">Age Group</Label>
          <Select
            value={form.ageGroup}
            onValueChange={(v) => setField("ageGroup", v)}
          >
            <SelectTrigger variant="auth" className="h-11">
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              {AGE_GROUP_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          className="h-12 w-full rounded-lg"
          onClick={handleSave}
          loading={isSaving}
        >
          Save changes
        </Button>
      </div>
    </div>
  )
}
