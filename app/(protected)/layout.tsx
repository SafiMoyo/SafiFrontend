"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context"
import { CenteredAuthSkeleton } from "@/components/skeleton"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { loggedIn } = useAuthContext()

  useEffect(() => {
    if (loggedIn === false || loggedIn === null) {
      router.push("/")
    }
  }, [loggedIn, router])

  if (loggedIn !== true) return <CenteredAuthSkeleton />

  return <>{children}</>
}
