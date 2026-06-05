"use client"

import ReactQueryProvider from "@/services/QueryProvider"
import { ReactNode } from "react"
import { Toaster } from "@/components/ui/sonner"
import AnimatedCursor from "@/components/animated-cursor"
import { ThemeProvider } from "next-themes"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="safi-admin-theme">
        {children}
        <Toaster />
        <AnimatedCursor />
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
