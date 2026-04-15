import React from "react"
import MagneticLink from "../magnetic-links"
import { Linkedin, Instagram, Youtube } from "lucide-react"
import { Button } from "../ui/button"
import { ROUTE_KEYS } from "@/lib/constants"

const Footer = () => {
  return (
    <footer className="mt-16 bg-[#e7d8b6] py-6">
      <div className="grid grid-cols-1 items-center gap-6 px-5 text-sm md:grid-cols-3 lg:px-10">
        <div className="text-center md:text-left">© 2026 SAFIMOYO. ALL RIGHTS RESERVED</div>

        <div className="flex justify-center gap-6">
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

        <div className="flex justify-center gap-4 md:justify-end">
          <MagneticLink>
            <a
              href="https://www.linkedin.com/company/safimoyo/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="cursor-pointer"
            >
              <Linkedin size={18} />
            </a>
          </MagneticLink>
          <MagneticLink>
            <a
              href="https://www.instagram.com/learnsafi?igsh=bTQzMnlzc29remg1&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="cursor-pointer"
            >
              <Instagram size={18} />
            </a>
          </MagneticLink>
          <MagneticLink>
            <a
              href="https://www.youtube.com/@SafiMoyoOfficial"
              target="_blank"
              rel="noopener noreferrer"
              title="Youtube"
              className="cursor-pointer"
            >
              <Youtube size={18} />
            </a>
          </MagneticLink>
          <MagneticLink>
            <a
              href="https://www.tiktok.com/@learnsafi"
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok"
              className="cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/tiktok.png" alt="TikTok" className="size-[18px] object-contain" />
            </a>
          </MagneticLink>
        </div>
      </div>
    </footer>
  )
}

export default Footer
