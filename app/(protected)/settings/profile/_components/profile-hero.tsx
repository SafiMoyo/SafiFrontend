"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Camera, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTE_KEYS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useAuthContext } from "@/context"
import { useMutateUpdateProfilePicture } from "@/services/auth/mutations"
import { toast } from "sonner"
import { AvatarPickerModal } from "../../_components/avatar-picker-modal"

interface ProfileHeroProps {
  displayName: string
  memberSince: string
  profilePicture: string | null
  dayStreak: number
  modulesCompleted: number
  isLoading?: boolean
}

export function ProfileHero({
  displayName,
  memberSince,
  profilePicture,
  dayStreak,
  modulesCompleted,
  isLoading,
}: ProfileHeroProps) {
  const { activeUser } = useAuthContext()
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profilePicture)

  useEffect(() => {
    setAvatarPreview(profilePicture)
  }, [profilePicture])

  const { mutate: uploadPicture, isPending: isUploading } =
    useMutateUpdateProfilePicture({
      onSuccess: () => toast.success("Profile picture updated"),
      queryParams: {
        user_id: activeUser?.id.toString() || "",
      },
    })

  const handleAvatarSelect = async (src: string) => {
    try {
      setAvatarPreview(src)
      const res = await fetch(src)
      const blob = await res.blob()
      const filename = src.split("/").pop() ?? "avatar.png"
      const file = new File([blob], filename, { type: blob.type || "image/png" })
      const formData = new FormData()
      formData.append("file", file)
      uploadPicture(formData, {
        onSuccess: () => setAvatarPickerOpen(false),
      })
    } catch {
      toast.error("Failed to set avatar. Please try again.")
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch">
        {/* Left: info + stats */}
        <div className="flex flex-1 flex-col justify-between gap-5">
          {/* Member since + name */}
          <div>
            <p className="text-xs font-extrabold tracking-widest text-black uppercase">
              Joined {memberSince}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
              {displayName}
            </h1>
          </div>

          {/* Stat cards */}
          <div className="flex gap-3">
            {/* Streak card */}
            <div className="flex flex-1 flex-col items-center justify-center rounded-[16px] border border-[#FFC733] bg-[#F3E6C4] px-4 py-8">
              <span className="text-3xl">🔥</span>
              <p
                className={cn(
                  "mt-1 text-4xl font-extrabold text-gray-900",
                  isLoading && "blur-sm"
                )}
              >
                {isLoading ? "–" : dayStreak}
              </p>
              <p className="mt-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Days Streak
              </p>
            </div>

            {/* Modules card */}
            <div className="flex flex-1 flex-col items-center justify-center rounded-[16px] border border-[#BB2EFA] bg-[#C9A3F2] px-4 py-8">
              <GraduationCap size={28} className="text-gray-700" />
              <p
                className={cn(
                  "mt-1 text-4xl font-extrabold text-gray-900",
                  isLoading && "blur-sm"
                )}
              >
                {isLoading ? "–" : modulesCompleted}
              </p>
              <p className="mt-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Module{modulesCompleted === 1 ? "" : "s"} Completed
              </p>
            </div>
          </div>

          {/* CTA */}
          <Button
            href={ROUTE_KEYS.MODULES}
            variant="outline"
            className="w-fit rounded-xl border-primary/30 text-primary hover:bg-purple-50"
          >
            Continue learning
          </Button>
        </div>

        {/* Right: profile image — clickable to open avatar picker */}
        <button
          type="button"
          onClick={() => setAvatarPickerOpen(true)}
          aria-label="Change profile picture"
          className="group relative mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl sm:mx-0 sm:w-[260px] sm:flex-shrink-0"
        >
          {avatarPreview ? (
            <>
              <Image
                src={avatarPreview}
                alt={displayName}
                width={260}
                height={300}
                className="h-full w-full object-cover"
                priority
              />
              {/* Hover overlay */}
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                {isUploading ? (
                  <span className="size-7 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Camera size={28} className="text-white" />
                    <span className="text-xs font-semibold text-white">
                      Change avatar
                    </span>
                  </>
                )}
              </span>
            </>
          ) : (
            <div className="flex min-h-[220px] w-full flex-col items-center justify-center gap-3 bg-primary">
              {isUploading ? (
                <span className="size-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Camera size={36} className="text-white" />
                  <span className="text-sm font-semibold text-white">
                    Click to upload avatar
                  </span>
                </>
              )}
            </div>
          )}
        </button>
      </div>

      <AvatarPickerModal
        open={avatarPickerOpen}
        onOpenChange={setAvatarPickerOpen}
        userAgeGroup={activeUser?.age_group}
        onSelect={handleAvatarSelect}
        isUploading={isUploading}
      />
    </div>
  )
}
