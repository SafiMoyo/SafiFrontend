import { Button } from "@/components/ui/button"
import { ROUTE_KEYS } from "@/lib/constants"
import { ENUM_AUTH } from "@/lib/enum"
import { AnimatePresence, motion } from "framer-motion"
import { PublicNavLinks } from "./public-nav-links"

type NavItem = {
  label: string
  href: string
}

type MobileMenuProps = {
  open: boolean
  pathname: string | null
  navItems: NavItem[]
  isSettingsArea: boolean
  isAuthenticated: boolean
  settingsPrimaryHref: string
  settingsPrimaryLabel: string
  onClose: () => void
  onHowItWorks: () => void
  onNavigate: (path: string) => void
  onLogout: () => void
  onOpenAuth: (tab: ENUM_AUTH) => void
}

export const MobileMenu = ({
  open,
  pathname,
  navItems,
  isSettingsArea,
  isAuthenticated,
  settingsPrimaryHref,
  settingsPrimaryLabel,
  onClose,
  onHowItWorks,
  onNavigate,
  onLogout,
  onOpenAuth,
}: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="absolute top-full left-0 z-20 w-full bg-white shadow-lg lg:hidden"
        >
          <div className="flex flex-col gap-6 px-6 py-6">
            {!isSettingsArea && (
              <PublicNavLinks
                mobile
                pathname={pathname}
                navItems={navItems}
                onHowItWorks={onHowItWorks}
                onItemClick={onClose}
              />
            )}

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
              {isAuthenticated ? (
                <>
                  {isSettingsArea && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onNavigate(settingsPrimaryHref)}
                    >
                      {settingsPrimaryLabel}
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onNavigate(ROUTE_KEYS.DASHBOARD)}
                  >
                    Dashboard
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onNavigate(ROUTE_KEYS.SETTINGS)}
                  >
                    Settings
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-primary/60 bg-transparent"
                    onClick={() => onOpenAuth(ENUM_AUTH.LOGIN)}
                  >
                    Log in
                  </Button>
                  <Button
                    type="button"
                    onClick={() => onOpenAuth(ENUM_AUTH.SIGNUP)}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
