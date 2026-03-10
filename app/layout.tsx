import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Safimoyo",
  description:
    "Safi teaches students how artificial intelligence works and how to use it productively through real-world, practical learning.",
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
      <body className="font-nunito bg-gray-100 antialiased">{children}</body>
    </html>
  )
}
