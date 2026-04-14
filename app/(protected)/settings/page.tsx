"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SettingsIcon } from "lucide-react"
import { useAuthContext } from "@/context"
import { ProfileCard } from "./_components/profile-card"
import { SecurityCard } from "./_components/security-card"
import { SubscriptionCard } from "./_components/subscription-card"
import { AccountActionsCard } from "./_components/account-actions-card"
import Footer from "@/components/footer/footer"
import Navbar from "@/components/navbar/navbar"

export default function SettingsPage() {
  const router = useRouter()
  const { isAuthenticated, loggedIn } = useAuthContext()

  useEffect(() => {
    if (loggedIn === false) router.replace("/")
  }, [loggedIn, router])

  if (loggedIn === null || !isAuthenticated) return null

  return (
    <div className="min-h-screen bg-purple-100/20">
      <Navbar />

      {/* Yellow title banner */}
      <div className="bg-[#F3E6C4] px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-lg font-bold">
          <SettingsIcon className="size-5" />
          Settings
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          {/* Left column */}
          <div className="space-y-6">
            <ProfileCard />
            <SecurityCard />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <SubscriptionCard />
          </div>
        </div>

        {/* Account actions — full width at bottom */}
        <div className="mt-6">
          <AccountActionsCard />
        </div>
      </div>

      <Footer />
    </div>
  )
}
