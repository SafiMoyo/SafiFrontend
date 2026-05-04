"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useMutateVerifyPassword } from "@/services/auth/mutations"
import { ROUTE_KEYS } from "@/lib/constants"

interface ParentMenuModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ParentMenuModal({ open, onOpenChange }: ParentMenuModalProps) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { mutate: verifyPassword, isPending } = useMutateVerifyPassword({
    onSuccess: () => {
      onOpenChange(false)
      setPassword("")
      router.push(ROUTE_KEYS.SETTINGS_STATISTICS)
    },
    onError: () => {
      toast.error("Incorrect password! You can't access the menu.")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return
    verifyPassword({ password })
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <Image src="/images/logo.svg" alt="Safi" width={80} height={28} />
        </div>

        {/* Title */}
        <h2 className="mb-6 text-xl font-bold text-gray-900">Parent Menu</h2>

        <form onSubmit={handleSubmit}>
          {/* Password row */}
          <div className="mb-1 flex items-center gap-4">
            <label className="w-24 shrink-0 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-lg bg-purple-50 px-3 pr-10 text-sm outline-none ring-1 ring-purple-300 focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Helper text */}
          <div className="mb-4 flex items-center gap-4">
            <div className="w-24 shrink-0" />
            <p className="text-xs text-gray-400">Same as login password</p>
          </div>

          {/* Enter button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isPending || !password}
              className="h-10 min-w-28 rounded-lg bg-primary px-8 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isPending ? "Verifying..." : "Enter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
