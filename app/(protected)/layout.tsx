"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { loggedIn } = useAuthContext()

  useEffect(() => {
    if (loggedIn === false || loggedIn === null) {
      router.push("/")
    }
  }, [loggedIn, router])

  if (loggedIn !== true)
    return (
      <div className="flex min-h-screen items-center justify-center bg-purple-100/20">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )

  return <>{children}</>
}
