"use client"

import Image from "next/image"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTE_KEYS } from "@/lib/constants"
import { cn } from "@/lib/utils"

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
  const initials = displayName.slice(0, 1).toUpperCase()

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch">
        {/* Left: info + stats */}
        <div className="flex flex-1 flex-col justify-between gap-5">
          {/* Member since + name */}
          <div>
            <p className="text-xs font-extrabold tracking-widest text-gray-500 uppercase">
              Joined {memberSince}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
              {displayName}
            </h1>
          </div>

          {/* Stat cards */}
          <div className="flex gap-3">
            {/* Streak card */}
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-[#E4D6B3] bg-[#FFF7E3] px-4 py-5">
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
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-purple-200 bg-purple-200/60 px-4 py-5">
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

        {/* Right: profile image */}
        <div className="mx-auto w-full max-w-65 overflow-hidden rounded-2xl sm:mx-0 sm:w-65 sm:shrink-0 md:w-75 md:max-w-75">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt={displayName}
              width={260}
              height={300}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <div className="flex h-full min-h-55 w-full items-center justify-center bg-primary text-7xl font-extrabold text-white">
              {initials}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
