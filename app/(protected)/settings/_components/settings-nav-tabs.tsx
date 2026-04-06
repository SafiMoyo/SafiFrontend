"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ROUTE_KEYS } from "@/lib/constants"

const NAV_TABS = [
  { label: "Settings", href: ROUTE_KEYS.SETTINGS },
  { label: "Statistics", href: ROUTE_KEYS.SETTINGS_STATISTICS },
  { label: "Profile", href: ROUTE_KEYS.SETTINGS_PROFILE },
  { label: "Dashboard", href: ROUTE_KEYS.DASHBOARD },
]

export function SettingsNavTabs() {
  const pathname = usePathname()

  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
      {NAV_TABS.filter((tab) => tab.href !== pathname).map((tab) => (
        <Button
          key={tab.href}
          href={tab.href}
          variant="outline"
          className="rounded-xl border-primary/30 bg-white text-primary hover:bg-purple-50"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
