"use client"

import Image from "next/image"
import React, { useState, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, LogOut, Menu, Settings, User, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ROUTE_KEYS } from "@/lib/constants"
import { AuthModal } from "@/components/modals/auth"
import { SelectProfileModal } from "@/components/modals/select-profile-modal"
import { ENUM_AUTH } from "@/lib/enum"
import { useAuthContext } from "@/context"
import { AccountType } from "@/types/user"

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { activeUser, isAuthenticated, logout } = useAuthContext()
  const isSettingsArea = pathname?.startsWith(ROUTE_KEYS.SETTINGS)
  const isStatisticsPage = pathname === ROUTE_KEYS.SETTINGS_STATISTICS
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [selectProfileOpen, setSelectProfileOpen] = useState(false)
  const [authTab, setAuthTab] = useState<ENUM_AUTH>(ENUM_AUTH.LOGIN)
  const isFamilyAccount = activeUser?.account_type === AccountType.FAMILY
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const profileRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY > 60 && currentY > lastScrollY.current) {
        setHidden(true)
        setOpen(false)
      } else {
        setHidden(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileRef.current) return
      if (!profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const openAuth = (tab: ENUM_AUTH) => {
    setAuthTab(tab)
    setAuthOpen(true)
    setOpen(false)
  }

  const handleLogout = () => {
    setProfileOpen(false)
    setOpen(false)
    logout()
    router.push("/")
  }

  const navigate = (path: string) => {
    setProfileOpen(false)
    setOpen(false)
    router.push(path)
  }

  const displayName = activeUser?.first_name || "User"
  const initials = displayName.slice(0, 1).toUpperCase()
  const hasProfilePicture = activeUser?.profile_picture
  const shouldShowNameInButton = !hasProfilePicture

  const navItems = [
    { label: "About Safi", href: ROUTE_KEYS.ABOUT },
    { label: "How it works", href: "" },
    { label: "Pricing", href: "" },
  ]

  const settingsPrimaryHref = isStatisticsPage
    ? ROUTE_KEYS.SETTINGS
    : ROUTE_KEYS.SETTINGS_STATISTICS
  const settingsPrimaryLabel = isStatisticsPage ? "Settings" : "Statistics"

  return (
    <motion.div
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 z-50 bg-white py-4"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* LOGO */}
        <Button variant={"ghost"} href="/">
          <Image
            alt="Logo"
            src={"/images/logo.svg"}
            width={30}
            height={10}
            className="w-20"
          />
        </Button>

        {/* DESKTOP NAV LINKS */}
        {!isSettingsArea ? (
          <div className="hidden gap-10 font-semibold md:flex">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="link"
                href={item.href}
                className={
                  pathname === item.href
                    ? "font-bold text-primary"
                    : "text-black"
                }
              >
                {item.label}
              </Button>
            ))}
          </div>
        ) : (
          <div className="hidden md:block" />
        )}

        {isAuthenticated && isSettingsArea && (
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <Button
              href={settingsPrimaryHref}
              variant="outline"
              className="rounded-xl border-primary/30 bg-white text-primary hover:bg-purple-50"
            >
              {settingsPrimaryLabel}
            </Button>
            <Button
              href={ROUTE_KEYS.DASHBOARD}
              variant="outline"
              className="rounded-xl border-primary/30 bg-white text-primary hover:bg-purple-50"
            >
              Dashboard
            </Button>
          </div>
        )}

        {/* DESKTOP AUTH — two modes */}
        <div className="hidden gap-4 md:flex">
          {isAuthenticated ? (
            isSettingsArea ? null : (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className={`flex items-center gap-2 rounded-full border transition-colors ${
                    hasProfilePicture
                      ? "border-gray-200 bg-transparent p-0.5"
                      : "border-purple-200 bg-purple-50 px-2 py-1 pr-3 hover:bg-purple-100"
                  }`}
                >
                  {hasProfilePicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activeUser.profile_picture}
                      alt={displayName}
                      className="size-8 rounded-full object-cover"
                    />
                  ) : (
                    <>
                      <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {initials}
                      </span>
                      {shouldShowNameInButton && (
                        <span className="text-sm font-semibold text-gray-800">
                          {displayName}
                        </span>
                      )}
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
                        onClick={() => navigate(ROUTE_KEYS.DASHBOARD)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </button>
                      {isFamilyAccount && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false)
                            setSelectProfileOpen(true)
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          <User size={16} />
                          Switch Account
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => navigate(ROUTE_KEYS.SETTINGS)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        <User size={16} />
                        Edit Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(ROUTE_KEYS.SETTINGS)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        <Settings size={16} />
                        Settings
                      </button>
                      <div className="my-1 border-t border-gray-100" />
                      <button
                        type="button"
                        onClick={handleLogout}
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
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="border-primary/60 bg-transparent px-6 shadow-xs"
                onClick={() => openAuth(ENUM_AUTH.LOGIN)}
              >
                Log in
              </Button>
              <Button
                type="button"
                className="px-6"
                onClick={() => openAuth(ENUM_AUTH.SIGNUP)}
              >
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full left-0 z-20 w-full bg-white shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-6 px-6 py-6">
              {!isSettingsArea && (
                <>
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      variant="link"
                      href={item.href}
                      className={
                        pathname === item.href
                          ? "justify-start font-bold text-primary"
                          : "justify-start text-black"
                      }
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                {isAuthenticated ? (
                  <>
                    {isSettingsArea && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(settingsPrimaryHref)}
                      >
                        {settingsPrimaryLabel}
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(ROUTE_KEYS.DASHBOARD)}
                    >
                      Dashboard
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(ROUTE_KEYS.SETTINGS)}
                    >
                      Settings
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleLogout}
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
                      onClick={() => openAuth(ENUM_AUTH.LOGIN)}
                    >
                      Log in
                    </Button>
                    <Button
                      type="button"
                      onClick={() => openAuth(ENUM_AUTH.SIGNUP)}
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

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        authTab={authTab}
        onFamilyAuth={() => setSelectProfileOpen(true)}
      />
      <SelectProfileModal
        open={selectProfileOpen}
        onOpenChange={setSelectProfileOpen}
      />
    </motion.div>
  )
}

export default Navbar
