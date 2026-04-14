import { ROUTE_KEYS } from "@/lib/constants"
import { AccountType, UserType } from "@/types/user"
import { AnimatePresence, motion } from "framer-motion"
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react"
import { RefObject } from "react"

type ProfileMenuProps = {
  activeUser?: UserType | null
  profileOpen: boolean
  profileRef: RefObject<HTMLDivElement | null>
  onToggleOpen: () => void
  onNavigate: (path: string) => void
  onSwitchAccount: () => void
  onLogout: () => void
}

export const ProfileMenu = ({
  activeUser,
  profileOpen,
  profileRef,
  onToggleOpen,
  onNavigate,
  onSwitchAccount,
  onLogout,
}: ProfileMenuProps) => {
  const isFamilyAccount = activeUser?.account_type === AccountType.FAMILY
  const displayName = activeUser?.first_name || "User"
  const initials = displayName.slice(0, 1).toUpperCase()
  const hasProfilePicture = Boolean(activeUser?.profile_picture)

  return (
    <div className="relative" ref={profileRef}>
      <button
        type="button"
        onClick={onToggleOpen}
        className={`flex items-center gap-2 rounded-full border transition-colors ${
          hasProfilePicture
            ? "border-gray-200 bg-transparent p-0.5"
            : "border-purple-200 bg-purple-50 px-2 py-1 pr-3 hover:bg-purple-100"
        }`}
      >
        {hasProfilePicture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeUser?.profile_picture}
            alt={displayName}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <>
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {initials}
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {displayName}
            </span>
          </>
        )}
      </button>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
          >
            <button
              type="button"
              onClick={() => onNavigate(ROUTE_KEYS.DASHBOARD)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>

            {isFamilyAccount && (
              <button
                type="button"
                onClick={onSwitchAccount}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                <User size={16} />
                Switch Account
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate(ROUTE_KEYS.SETTINGS)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              <User size={16} />
              Edit Profile
            </button>

            <button
              type="button"
              onClick={() => onNavigate(ROUTE_KEYS.SETTINGS)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              <Settings size={16} />
              Settings
            </button>

            <div className="my-1 border-t border-gray-100" />

            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
