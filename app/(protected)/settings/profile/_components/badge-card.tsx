import { cn } from "@/lib/utils"

interface BadgeCardProps {
  moduleNumber: number
  moduleTitle: string
  ageGroup: string
  isUnlocked: boolean
}

export function BadgeCard({
  moduleNumber,
  moduleTitle,
  ageGroup,
  isUnlocked,
}: BadgeCardProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-square flex-col items-center overflow-hidden rounded-2xl border-2 p-2 shadow-sm transition-transform",
        isUnlocked
          ? "border-purple-400 bg-gradient-to-b from-[#6B21A8] to-[#312e81]"
          : "border-purple-100 bg-purple-50/60"
      )}
    >
      {/* Top module banner */}
      <div
        className={cn(
          "absolute top-0 inset-x-0 py-1 text-center text-[7px] font-black tracking-[0.12em] uppercase",
          isUnlocked
            ? "bg-amber-400 text-purple-900"
            : "bg-purple-100 text-purple-300"
        )}
      >
        Module {moduleNumber}
      </div>

      {/* Sparkles */}
      {isUnlocked && (
        <>
          <span className="absolute top-6 left-1.5 text-[9px] text-yellow-300">
            ✦
          </span>
          <span className="absolute top-6 right-1.5 text-[9px] text-yellow-300">
            ✦
          </span>
        </>
      )}

      {/* Rainbow stripe */}
      <div className="mt-6 h-1 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full w-full",
            isUnlocked
              ? "bg-gradient-to-r from-red-400 via-yellow-300 via-green-400 via-sky-400 to-violet-400"
              : "bg-purple-100"
          )}
        />
      </div>

      {/* Icon */}
      <div
        className={cn(
          "mt-1 flex flex-1 items-center justify-center text-2xl",
          !isUnlocked && "opacity-25"
        )}
      >
        🤖
      </div>

      {/* Bottom text */}
      <div className="w-full text-center">
        <p
          className={cn(
            "truncate text-[8px] font-bold leading-tight",
            isUnlocked ? "text-white" : "text-purple-200"
          )}
        >
          {moduleTitle}
        </p>
        <p
          className={cn(
            "mt-0.5 text-[7px]",
            isUnlocked ? "text-amber-300" : "text-purple-200/60"
          )}
        >
          ★ Age {ageGroup} ★
        </p>
      </div>

      {/* Locked overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 rounded-2xl bg-white/30" />
      )}
    </div>
  )
}
