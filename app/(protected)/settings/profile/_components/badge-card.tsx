import type { BadgeItem } from "@/services/module-lesson/types"

interface BadgeCardProps {
  badge?: BadgeItem
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const isEarned = !!badge
  const hasImage = !!badge?.image_url

  return (
    <div className={`relative aspect-square overflow-hidden rounded-2xl border shadow-sm ${isEarned ? "border-green-500" : "border-purple-100 bg-purple-50/60"}`}>
      {isEarned && hasImage ? (
        // Earned badge with real image — show clearly
        <img
          src={badge.image_url!}
          alt={badge.name}
          className="h-full w-full object-cover"
        />
      ) : (
        // Earned but no image, or not yet earned — show blurred placeholder
        <div
          className={`flex h-full w-full items-center justify-center text-4xl ${
            isEarned ? "blur-[2px]" : "blur-sm opacity-40"
          }`}
        >
          🏅
        </div>
      )}

      {/* Blur overlay for null image earned badges */}
      {isEarned && !hasImage && (
        <div className="absolute inset-0 rounded-2xl bg-white/30" />
      )}

      {/* Lock overlay for unearned */}
      {!isEarned && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/40">
          <span className="text-lg text-gray-400">🔒</span>
        </div>
      )}
    </div>
  )
}
