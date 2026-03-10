"use client"

import Image from "next/image"
import React, { useState } from "react"
import { Button } from "../ui/button"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ROUTE_KEYS } from "@/lib/constants"

const Navbar = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems = [
    { label: "About Safi", href: ROUTE_KEYS.ABOUT },
    { label: "How it works", href: "" },
    { label: "Pricing", href: "" },
  ]

  return (
    <div className="relative bg-white py-4">
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
          <Button
            variant="outline"
            className="border-primary/60 bg-transparent px-6 shadow-xs"
          >
            Log in
          </Button>

          <Button className="px-6">Sign in</Button>
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
                  variant="outline"
                  className="border-primary/60 bg-transparent"
                >
                  Log in
                </Button>

                <Button>Sign in</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbar
