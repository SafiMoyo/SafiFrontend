"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuthContext } from "@/context"
import {
  useMutateUpdateProfile,
  useMutateUpdateProfilePicture,
} from "@/services/auth/mutations"
import { toast } from "sonner"

export function ProfileCard() {
  const { activeUser } = useAuthContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [ageGroup, setAgeGroup] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    if (activeUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFirstName(activeUser?.first_name ?? "")
      setLastName(activeUser?.last_name ?? "")
      setEmail(activeUser?.email_address ?? "")
      if (activeUser?.profile_picture) {
        setAvatarPreview(activeUser.profile_picture)
      }
    }
  }, [activeUser])

  const { mutate: updateProfile, isPending: isSaving } = useMutateUpdateProfile(
    {
      onSuccess: () => toast.success("Profile updated"),
    }
  )

  const { mutate: uploadPicture, isPending: isUploading } =
    useMutateUpdateProfilePicture({
      onSuccess: () => toast.success("Profile picture updated"),
    })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview immediately
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append("profile_picture", file)
    uploadPicture(formData)
  }

  const handleSave = () => {
    updateProfile({
      first_name: firstName,
      last_name: lastName,
      email_address: email,
      age_group: ageGroup,
    })
  }

  const displayName =
    [activeUser?.first_name, activeUser?.last_name].filter(Boolean).join(" ") ||
    "User"

  const initials = displayName.slice(0, 1).toUpperCase()

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <User size={18} className="text-primary" />
        <h2 className="font-bold text-gray-900">Profile</h2>
      </div>

      {/* Avatar upload */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex size-20 items-center justify-center overflow-hidden rounded-full bg-primary text-2xl font-bold text-white shadow-md transition-opacity"
            aria-label="Change profile picture"
          >
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900">Last Name</Label>
            <Input
              variant="auth"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">Email</Label>
          <Input
            variant="auth"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900">Age Group</Label>
          <Select value={ageGroup} onValueChange={setAgeGroup}>
            <SelectTrigger variant="auth">
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
