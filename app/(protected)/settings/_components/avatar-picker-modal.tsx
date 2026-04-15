"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Lock } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

type Avatar = {
  src: string
  label: string
}

type AvatarLevel = {
  title: string
  ageGroupKey: string
  avatars: [Avatar, Avatar]
}

const AVATAR_LEVELS: AvatarLevel[] = [
  {
    title: "Early Level",
    ageGroupKey: "Early",
    avatars: [
      { src: "/images/early_male.png", label: "Early Male" },
      { src: "/images/early_female.png", label: "Early Female" },
    ],
  },
  {
    title: "Middle Level",
    ageGroupKey: "Middle",
    avatars: [
      { src: "/images/middle_level_male.png", label: "Middle Male" },
      { src: "/images/middle_level_female.png", label: "Middle Female" },
    ],
  },
  {
    title: "Advanced Level",
    ageGroupKey: "Advanced",
    avatars: [
      { src: "/images/advanced_level_male.png", label: "Advanced Male" },
      { src: "/images/advanced_level_female.png", label: "Advanced Female" },
    ],
  },
]

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userAgeGroup: string | undefined
  onSelect: (src: string) => void
  isUploading: boolean
}

export function AvatarPickerModal({
  open,
  onOpenChange,
  userAgeGroup,
  onSelect,
  isUploading,
}: Props) {
  const [loadingSrc, setLoadingSrc] = useState<string | null>(null)

  const userLevelKey = AVATAR_LEVELS.find((l) =>
    userAgeGroup?.includes(l.ageGroupKey)
  )?.ageGroupKey

  // Clear spinner only after upload truly finishes
  useEffect(() => {
    if (!isUploading) setLoadingSrc(null)
  }, [isUploading])

  // Reset when modal closes
  useEffect(() => {
    if (!open) setLoadingSrc(null)
  }, [open])

  const handleSelect = (src: string) => {
    setLoadingSrc(src)
    onSelect(src)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] !max-w-[92vw] gap-0 overflow-y-auto rounded-2xl bg-white p-6 md:w-[70vw] md:!max-w-[70vw] md:p-8 lg:w-[38vw] lg:!max-w-[38vw]">
        <DialogTitle className="mb-1 text-xl font-extrabold text-gray-900">
          Choose Your Avatar
        </DialogTitle>
        <p className="mb-8 text-sm text-gray-500">
          Select an avatar that matches your level.
        </p>

        <div className="space-y-10">
          {AVATAR_LEVELS.map((level) => {
            const isUnlocked = level.ageGroupKey === userLevelKey

            return (
              <div key={level.title}>
                {/* Level label */}
                <div className="mb-4 flex items-center gap-1.5">
                  <p
                    className={`text-sm font-bold tracking-wide ${
                      isUnlocked ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {level.title}
                  </p>
                  {!isUnlocked && <Lock size={12} className="text-gray-400" />}
                </div>

                {/* Two characters side by side */}
                <div className="flex justify-between gap-6">
                  {level.avatars.map((avatar) => (
                    <div key={avatar.src} className="flex items-end gap-3">
                      {/* Small circle — decorative only */}
                      <div
                        className={`relative size-14 shrink-0 self-end overflow-hidden rounded-full border border-black shadow-sm ${
                          !isUnlocked ? "opacity-40 grayscale" : ""
                        }`}
                      >
                        <Image
                          src={avatar.src}
                          alt={avatar.label}
                          fill
                          className="object-cover object-top"
                        />
                      </div>

                      {/* Big image — the only selectable element */}
                      <button
                        type="button"
                        disabled={!isUnlocked || isUploading}
                        onClick={() => handleSelect(avatar.src)}
                        className={`relative overflow-hidden rounded-2xl border border-black transition-all ${
                          isUnlocked
                            ? "cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2"
                            : "cursor-not-allowed opacity-40 grayscale"
                        }`}
                        style={{ width: 140, height: 130 }}
                      >
                        <Image
                          src={avatar.src}
                          alt={avatar.label}
                          fill
                          className="object-cover"
                        />
                        {loadingSrc === avatar.src && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="size-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
