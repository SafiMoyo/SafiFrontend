import { Button } from "@/components/ui/button"
import { ROUTE_KEYS } from "@/lib/constants"

type SettingsShortcutsProps = {
  isAuthenticated: boolean
  isSettingsArea: boolean
  settingsPrimaryHref: string
  settingsPrimaryLabel: string
}

export const SettingsShortcuts = ({
  isAuthenticated,
  isSettingsArea,
  settingsPrimaryHref,
  settingsPrimaryLabel,
}: SettingsShortcutsProps) => {
  if (!isAuthenticated || !isSettingsArea) return null

  return (
    <div className="ml-auto hidden items-center gap-3 md:flex">
      <Button
        href={settingsPrimaryHref}
        variant="outline"
        className="border-primary/30 bg-white text-primary hover:bg-purple-50"
      >
        {settingsPrimaryLabel}
      </Button>
      <Button
        href={ROUTE_KEYS.DASHBOARD}
        variant="outline"
        className="border-primary/30 bg-white text-primary hover:bg-purple-50"
      >
        Dashboard
      </Button>
    </div>
  )
}
