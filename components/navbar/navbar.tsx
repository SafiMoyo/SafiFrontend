"use client"

import Image from "next/image"
import React, { useState, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import { ROUTE_KEYS } from "@/lib/constants"
import { AuthModal } from "@/components/modals/auth"
import { SelectProfileModal } from "@/components/modals/select-profile-modal"
import { ENUM_AUTH } from "@/lib/enum"
import { useAuthContext } from "@/context"
import { PublicNavLinks } from "./partials/public-nav-links"
import { SettingsShortcuts } from "./partials/settings-shortcuts"
import { ProfileMenu } from "./partials/profile-menu"
import { MobileMenu } from "./partials/mobile-menu"

const navItems = [{ label: "About Safi", href: ROUTE_KEYS.ABOUT }]

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

  const handleHowItWorks = () => {
    setOpen(false)
    if (pathname !== "/") {
      router.push("/#how-it-works")
      return
    }
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" })
  }

  const settingsPrimaryHref = isStatisticsPage
    ? ROUTE_KEYS.SETTINGS
    : ROUTE_KEYS.SETTINGS_STATISTICS
  const settingsPrimaryLabel = isStatisticsPage
    ? "Settings"
    : "Learning Journey"

  return (
    <motion.div
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 z-50 bg-white py-4"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* LOGO */}
        <Button className="hover:bg-transparent" variant={"ghost"} href="/">
          <Image
            alt="Logo"
            src={"/images/logo.jpg"}
            width={30}
            height={10}
            className="w-20"
          />
        </Button>

        {!isSettingsArea ? (
          <PublicNavLinks
            pathname={pathname}
            navItems={navItems}
            onHowItWorks={handleHowItWorks}
          />
        ) : (
          <div className="hidden md:block" />
        )}

        <SettingsShortcuts
          isAuthenticated={isAuthenticated}
          isSettingsArea={isSettingsArea}
          settingsPrimaryHref={settingsPrimaryHref}
          settingsPrimaryLabel={settingsPrimaryLabel}
        />

        {!isAuthenticated && (
          <div className="hidden gap-4 md:flex">
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
          </div>
        )}

        {isAuthenticated && !isSettingsArea && (
          <div className="hidden md:flex">
            <ProfileMenu
              activeUser={activeUser}
              profileOpen={profileOpen}
              profileRef={profileRef}
              onToggleOpen={() => setProfileOpen((prev) => !prev)}
              onNavigate={navigate}
              onSwitchAccount={() => {
                setProfileOpen(false)
                setSelectProfileOpen(true)
              }}
              onLogout={handleLogout}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      <MobileMenu
        open={open}
        pathname={pathname}
        navItems={navItems}
        isSettingsArea={isSettingsArea}
        isAuthenticated={isAuthenticated}
        settingsPrimaryHref={settingsPrimaryHref}
        settingsPrimaryLabel={settingsPrimaryLabel}
        onClose={() => setOpen(false)}
        onHowItWorks={handleHowItWorks}
        onNavigate={navigate}
        onLogout={handleLogout}
        onOpenAuth={openAuth}
      />

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
