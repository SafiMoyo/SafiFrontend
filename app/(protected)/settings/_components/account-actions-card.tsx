"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context"

export function AccountActionsCard() {
  const router = useRouter()
  const { logout } = useAuthContext()

  const handleSignOut = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-bold text-gray-900">Account Actions</h2>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-12 flex-1 rounded-full"
          onClick={handleSignOut}
        >
          Sign out
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="h-12 flex-1 rounded-full"
        >
          Delete account
        </Button>
      </div>
    </div>
  )
}
