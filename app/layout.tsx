import type { Metadata, Viewport } from "next"
import "./globals.css"
import Providers from "./providers"
import { PWARegister } from "@/components/pwa-register"

export const metadata: Metadata = {
  title: "Safi – Learn Smarter with AI",
  description:
    "Safi teaches students how artificial intelligence works and how to use it productively through real-world, practical learning.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Safi",
  },
  applicationName: "Safi",
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: "#8900eb",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-nunito overflow-x-hidden bg-gray-100 antialiased">
        <PWARegister />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
