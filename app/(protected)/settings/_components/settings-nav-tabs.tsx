"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ROUTE_KEYS } from "@/lib/constants"

export function SettingsNavTabs() {
  const pathname = usePathname()
  const isStatisticsPage = pathname === ROUTE_KEYS.SETTINGS_STATISTICS

  const mainLabel = isStatisticsPage ? "Settings" : "Statistics"
  const mainHref = isStatisticsPage
    ? ROUTE_KEYS.SETTINGS
    : ROUTE_KEYS.SETTINGS_STATISTICS

  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
      <Button
        href={mainHref}
        variant="outline"
        className="rounded-xl border-primary/30 bg-white text-primary hover:bg-purple-50"
      >
        {mainLabel}
      </Button>
      <Button
        href={ROUTE_KEYS.DASHBOARD}
        variant="outline"
        className="rounded-xl border-primary/30 bg-white text-primary hover:bg-purple-50"
      >
        Dashboard
      </Button>
    </div>
  )
}
