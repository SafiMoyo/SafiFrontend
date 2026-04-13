"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
    <div className="flex items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-sm">
      <h2 className="font-bold" style={{ color: "#999999" }}>Account Actions</h2>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="h-9 bg-white px-6 text-sm font-medium transition hover:bg-gray-50"
          style={{ border: "1px solid #D68BF7", borderRadius: 8, color: "#4D4D4D" }}
        >
          Sign out
        </button>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="h-9 bg-white px-6 text-sm font-medium transition hover:bg-gray-50"
          style={{ border: "1px solid #E53935", borderRadius: 8, color: "#4D4D4D" }}
        >
          Delete account
        </button>
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
