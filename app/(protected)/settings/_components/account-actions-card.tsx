"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context"
import { toast } from "sonner"
import { useMutateDeleteAccount } from "@/services/auth/mutations"
import { AccountDeletedModal, DeleteAccountModal } from "./modals"

export function AccountActionsCard() {
  const router = useRouter()
  const { logout } = useAuthContext()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletedOpen, setDeletedOpen] = useState(false)

  const { mutate: deleteAccount, isPending: isDeleting } =
    useMutateDeleteAccount({
      onSuccess: () => {
        setDeleteOpen(false)
        setDeletedOpen(true)
      },
      onError: () => toast.error("Unable to delete account right now"),
    })

  const handleSignOut = () => {
    logout()
    router.push("/")
  }

  const handleDeleteAccount = ({ reasons }: { reasons: string[] }) => {
    deleteAccount({ reasons })
  }

  const handleDeletedClose = () => {
    setDeletedOpen(false)
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
          onClick={() => setDeleteOpen(true)}
        >
          Delete account
        </Button>
      </div>

      <DeleteAccountModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirmDelete={handleDeleteAccount}
        isDeleting={isDeleting}
      />

      <AccountDeletedModal
        open={deletedOpen}
        onOpenChange={setDeletedOpen}
        onClose={handleDeletedClose}
      />
    </div>
  )
}
