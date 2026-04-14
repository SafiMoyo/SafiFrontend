import type { ModuleType } from "@/types/module"
import { BadgeCard } from "./badge-card"

interface BadgeGridProps {
  modules: ModuleType[]
  badgesEarned: number
  ageGroup?: string
  isLoading?: boolean
}

// Fallback placeholder slots shown when no module data is available
const PLACEHOLDER_COUNT = 8

export function BadgeGrid({ modules, badgesEarned, ageGroup = "4–6", isLoading }: BadgeGridProps) {
  const sortedModules = [...modules].sort(
    (a, b) => a.sequence_num - b.sequence_num
  )

  // Ensure we always show at least PLACEHOLDER_COUNT slots
  const totalSlots = Math.max(sortedModules.length, PLACEHOLDER_COUNT)

  const slots = Array.from({ length: totalSlots }, (_, i) => {
    const module = sortedModules[i]
    return {
      moduleNumber: i + 1,
      moduleTitle: module?.module_title ?? "Coming Soon",
      ageGroup,
      isUnlocked: i < badgesEarned,
    }
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className="aspect-square animate-pulse rounded-2xl bg-purple-100/60"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {slots.map((slot) => (
        <BadgeCard
          key={slot.moduleNumber}
          moduleNumber={slot.moduleNumber}
          moduleTitle={slot.moduleTitle}
          ageGroup={slot.ageGroup}
          isUnlocked={slot.isUnlocked}
        />
      ))}
    </div>
  )
}
