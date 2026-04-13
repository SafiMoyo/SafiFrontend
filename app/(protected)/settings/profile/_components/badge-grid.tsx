import type { BadgeItem } from "@/services/module-lesson/types"
import { BadgeCard } from "./badge-card"

interface BadgeGridProps {
  badges: BadgeItem[]
  isLoading?: boolean
}

const PLACEHOLDER_COUNT = 8

export function BadgeGrid({ badges, isLoading }: BadgeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-2xl bg-purple-100/60"
          />
        ))}
      </div>
    )
  }

  const totalSlots = Math.max(badges.length, PLACEHOLDER_COUNT)

  return (
    <div className="grid grid-cols-4 gap-3">
      {Array.from({ length: totalSlots }, (_, i) => (
        <BadgeCard key={i} badge={badges[i]} />
      ))}
    </div>
  )
}
