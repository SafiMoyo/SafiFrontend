import React from "react"
import MagneticLink from "../magnetic-links"
import { Linkedin, Instagram, Youtube, Music2 } from "lucide-react"
import { Button } from "../ui/button"
import { ROUTE_KEYS } from "@/lib/constants"

const Footer = () => {
  return (
    <footer className="mt-16 bg-[#e7d8b6] py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm md:flex-row">
        <div>© 2026 SAFI. ALL RIGHTS RESERVED</div>

        <div className="flex gap-6">
          <Button
            className="text-black"
            variant={"link"}
            href={ROUTE_KEYS.ABOUT}
          >
            About Safi
          </Button>
          <Button
            className="text-black"
            variant={"link"}
            href={ROUTE_KEYS.PRIVACY}
          >
            Privacy{" "}
          </Button>
          <Button
            className="text-black"
            variant={"link"}
            href={ROUTE_KEYS.TERMS}
          >
            Terms{" "}
          </Button>
          <Button className="text-black" variant={"link"}>
            Contact Us
          </Button>
        </div>

        <div className="flex gap-4">
          <MagneticLink>
            <button className="cursor-pointer" title="LinkedIn">
              <Linkedin size={18} />
            </button>
          </MagneticLink>
          <MagneticLink>
            <button className="cursor-pointer" title="Instagram">
              <Instagram size={18} />
            </button>
          </MagneticLink>
          <MagneticLink>
            <button className="cursor-pointer" title="Youtube">
              <Youtube size={18} />
            </button>
          </MagneticLink>
          <MagneticLink>
            <button className="cursor-pointer" title="Music2">
              <Music2 size={18} />
            </button>
          </MagneticLink>
        </div>
      </div>
    </footer>
  )
}

export default Footer
