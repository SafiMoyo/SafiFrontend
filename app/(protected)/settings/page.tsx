"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Settings } from "lucide-react"
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

      {/* Header card — flush against navbar, full width */}
      <div className="bg-[#F3E6C4] px-8 py-3">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Settings size={22} className="text-gray-700" />
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8">
        {/* Main grid */}
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

        {/* Account Actions — full width at the bottom */}
        <div className="mt-6">
          <AccountActionsCard />
        </div>
      </div>

      <Footer />
    </div>
  )
}
