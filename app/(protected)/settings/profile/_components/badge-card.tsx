import Image from "next/image"
import type { BadgeItem } from "@/services/module-lesson/types"

interface BadgeCardProps {
  badge?: BadgeItem
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const isEarned = !!badge
  const hasImage = !!badge?.image_url

  return (
    <div
      className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border p-2 shadow-sm ${
        isEarned ? "border-green-500" : "border-purple-100 bg-purple-50/60"
      }`}
    >
      {isEarned && hasImage ? (
        <img
          src={badge.image_url!}
          alt={badge.name}
          className="h-full w-full object-cover"
        />
      ) : isEarned ? (
        // Earned but no image
        <div className="flex h-full w-full items-center justify-center text-4xl blur-[2px]">
          🏅
        </div>
      ) : (
        // Locked — show locked_module image inside the card
        <Image
          src="/images/locked_module.png"
          alt="Locked badge"
          fill
          className="object-contain p-2"
        />
      )}
    </div>
  )
}
