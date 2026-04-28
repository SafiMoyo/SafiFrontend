"use client"

import ReactQueryProvider from "@/services/QueryProvider"
import { ReactNode } from "react"
import { Toaster } from "@/components/ui/sonner"
import AnimatedCursor from "@/components/animated-cursor"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      {children}

      <Toaster />
      <AnimatedCursor />
    </ReactQueryProvider>
  )
}
