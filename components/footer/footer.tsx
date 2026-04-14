"use client"

import React, { useState } from "react"
import MagneticLink from "../magnetic-links"
import { Linkedin, Instagram, Youtube, Music2 } from "lucide-react"
import { Button } from "../ui/button"
import { ROUTE_KEYS } from "@/lib/constants"
import { ContactModal } from "@/components/modals/contact-modal"

const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <footer className="mt-16 bg-[#e7d8b6] py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm md:flex-row">
          <div>© 2026 SAFI. ALL RIGHTS RESERVED</div>

          <div className="flex gap-6">
            <Button className="text-black" variant={"link"} href={ROUTE_KEYS.ABOUT}>
              About Safi
            </Button>
            <Button className="text-black" variant={"link"} href={ROUTE_KEYS.PRIVACY}>
              Privacy
            </Button>
            <Button className="text-black" variant={"link"} href={ROUTE_KEYS.TERMS}>
              Terms
            </Button>
            <Button
              type="button"
              className="text-black"
              variant={"link"}
              onClick={() => setContactOpen(true)}
            >
              Contact Us
            </Button>
          </div>

          <div className="flex gap-4">
            <MagneticLink>
              <a href="#" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin size={18} />
              </a>
            </MagneticLink>
            <MagneticLink>
              <a href="#" title="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram size={18} />
              </a>
            </MagneticLink>
            <MagneticLink>
              <a href="#" title="YouTube" target="_blank" rel="noopener noreferrer">
                <Youtube size={18} />
              </a>
            </MagneticLink>
            <MagneticLink>
              <a href="#" title="TikTok" target="_blank" rel="noopener noreferrer">
                <Music2 size={18} />
              </a>
            </MagneticLink>
          </div>
        </div>
      </footer>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </>
  )
}

export default Footer
