"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Camera, MoveRight, User } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context"
import { ROUTE_KEYS } from "@/lib/constants"
import {
  useMutateUpdateProfile,
  useMutateUpdateProfilePicture,
} from "@/services/auth/mutations"
import { toast } from "sonner"
import { ProfileForm } from "../utils"

export function ProfileCard() {
  const { activeUser } = useAuthContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const { mutate: uploadPicture, isPending: isUploading } =
    useMutateUpdateProfilePicture({
      onSuccess: () => toast.success("Profile picture updated"),
      queryParams: {
        user_id: activeUser?.id.toString() || "",
      },
    })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setField("avatarPreview", reader.result as string)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append("file", file)
    uploadPicture(formData)
  }

  const handleSave = () => {
    updateProfile({
      first_name: form.firstName,
      last_name: form.lastName,
    })
  }

  const displayName =
    [activeUser?.first_name, activeUser?.last_name].filter(Boolean).join(" ") ||
    "User"

  const initials = displayName.slice(0, 1).toUpperCase()

  const memberSince = activeUser?.date_created
    ? new Date(activeUser.date_created).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : null

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <User size={18} className="text-primary" />
        <h2 className="font-bold text-gray-900">Profile</h2>
      </div>

      {/* Avatar upload */}
      <div className="mb-4 flex flex-col items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex size-20 items-center justify-center overflow-hidden rounded-full bg-primary text-2xl font-bold text-white shadow-md"
            aria-label="Change profile picture"
          >
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
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              {isUploading ? (
                <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Camera size={20} className="text-white" />
              )}
            </span>
          </button>
          <input
            aria-label="Upload image"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <Link
          href={ROUTE_KEYS.SETTINGS_PROFILE}
          className="text-center transition-opacity hover:opacity-70"
        >
          <p className="font-semibold text-gray-900">{displayName}</p>
          {memberSince && (
            <p className="flex items-center justify-center gap-1 text-xs text-gray-400">
              Member since {memberSince} {<MoveRight size={12} />}
            </p>
          )}
        </Link>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900">
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
            <Label className="text-sm font-bold text-gray-900">Last Name</Label>
            <Input
              variant="auth"
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">Email</Label>
          <Input
            disabled
            variant="auth"
            type="email"
            placeholder="your@email.com"
            className="disabled:cursor-not-allowed"
            value={form.email}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">Age Group</Label>
          <div className="flex h-11 items-center rounded-xl border border-purple-100 bg-purple-50/40 px-4 text-sm text-gray-700">
            {form.ageGroup || "—"}
          </div>
        </div>

        <Button
          type="button"
          className="h-12 w-full rounded-full"
          onClick={handleSave}
          loading={isSaving}
        >
          Save changes
        </Button>
      </div>
    </div>
  )
}
