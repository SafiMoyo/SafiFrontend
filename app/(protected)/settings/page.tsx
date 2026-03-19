"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context"
import { ProfileCard } from "./_components/profile-card"
import { SecurityCard } from "./_components/security-card"
import { SubscriptionCard } from "./_components/subscription-card"
import { AccountActionsCard } from "./_components/account-actions-card"
import Footer from "@/components/footer/footer"
import Navbar from "@/components/navbar/navbar"

export default function SettingsPage() {
  const router = useRouter()
  const { activeUser, isAuthenticated, loggedIn } = useAuthContext()

  useEffect(() => {
    if (loggedIn === false) router.replace("/")
  }, [loggedIn, router])

  // Still hydrating or not authenticated
  if (loggedIn === null || !isAuthenticated) return null

  const displayName =
    [activeUser?.first_name, activeUser?.last_name].filter(Boolean).join(" ") ||
    "User"

  const memberSince = activeUser?.date_created
    ? new Date(activeUser.date_created).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : "N/A"

  return (
    <div className="min-h-screen bg-purple-100/20">
      {/* Page header */}
      <Navbar />

      <div className="mx-auto max-w-5xl px-5 py-10">
        {/* User hero */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-md">
            {displayName.slice(0, 1).toUpperCase()}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Member since {memberSince}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          {/* Left column */}
          <div className="space-y-6">
            <ProfileCard />
            <SecurityCard />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <SubscriptionCard />
            <AccountActionsCard />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
