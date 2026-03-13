"use client"

import Image from "next/image"
import React, { useState, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ROUTE_KEYS } from "@/lib/constants"
import { AuthModal } from "@/components/modals/auth"
import { ENUM_AUTH } from "@/lib/enum"

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<ENUM_AUTH>(ENUM_AUTH.LOGIN)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

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

  const openAuth = (tab: ENUM_AUTH) => {
    setAuthTab(tab)
    setAuthOpen(true)
    setOpen(false)
  }

  const navItems = [
    { label: "About Safi", href: ROUTE_KEYS.ABOUT },
    { label: "How it works", href: "" },
    { label: "Pricing", href: "" },
  ]
  const isModulesScreen = pathname.includes("/modules")

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
        {/* DESKTOP NAV */}
        <div className="hidden gap-10 font-semibold md:flex">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="link"
              href={item.href}
              className={
                pathname === item.href ? "font-bold text-primary" : "text-black"
              }
            >
              {item.label}
            </Button>
          ))}
        </div>

        {/* DESKTOP AUTH */}
        <div className="hidden gap-4 md:flex">
          {!isModulesScreen ? (
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
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="gap-1.5 rounded-full border-gray-300 px-4 text-sm font-semibold"
            >
              <ArrowLeft size={15} />
              Back
            </Button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
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
              {navItems.map((item) => (
                <Button
                  key={item.href}
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

              <div className="flex flex-col gap-3 pt-4">
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} authTab={authTab} />
    </motion.div>
  )
}

export default Navbar
