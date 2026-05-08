"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ENUM_AUTH } from "@/lib/enum"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { SignUpForm } from "./signup-form"
import { LogInForm } from "./login-form"
import { ForgotPasswordModal } from "./forgot-password-modal"
import { useAuthContext } from "@/context"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  authTab: ENUM_AUTH
  onFamilyAuth?: () => void
}

export function AuthModal({ open, onOpenChange, authTab, onFamilyAuth }: Props) {
  const router = useRouter()
  const { isAuthenticated } = useAuthContext()
  const [tab, setTab] = useState<ENUM_AUTH>(authTab)
  const [forgotOpen, setForgotOpen] = useState(false)
  const pendingAccountTypeRef = useRef<string | null>(null)

  useEffect(() => {
    if (open) setTab(authTab)
  }, [open, authTab])

  useEffect(() => {
    if (open && isAuthenticated && pendingAccountTypeRef.current === null) {
      // User is already authenticated when modal opens — route based on stored account type
      onOpenChange(false)
      router.push("/dashboard")
    }
  }, [isAuthenticated, onOpenChange, open, router])

  function handleAuthSuccess(accountType: string) {
    pendingAccountTypeRef.current = accountType
    onOpenChange(false)
    if (accountType === "FAMILY") {
      onFamilyAuth?.()
    } else {
      router.push("/dashboard")
    }
  }

  function handleForgotPassword() {
    onOpenChange(false)
    setForgotOpen(true)
  }

  function handleBackToLogin() {
    setForgotOpen(false)
    setTab(ENUM_AUTH.LOGIN)
    onOpenChange(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex w-[calc(100%-2rem)] max-w-lg flex-col gap-0 overflow-hidden bg-white p-4 sm:p-6 max-h-[calc(100svh-2rem)]">
          <div className="mb-3 flex justify-center sm:mb-4">
            <Image
              src="/images/logo.svg"
              alt="Safi"
              width={120}
              height={40}
              className="h-8 w-auto sm:h-10"
            />
          </div>

          <div className="mb-4 text-center sm:mb-5">
            <DialogTitle className="text-xl font-extrabold text-gray-900 sm:text-2xl">
              {tab === ENUM_AUTH.SIGNUP
                ? "Welcome to Safi!"
                : "Welcome back to Safi!"}
            </DialogTitle>
            <p className="mt-1 text-sm font-semibold text-gray-700">
              {tab === ENUM_AUTH.SIGNUP
                ? "Start your learning journey today"
                : "Continue your learning journey"}
            </p>
          </div>

          {/* Sliding tab switcher */}
          <div className="relative mb-4 flex rounded-xl bg-purple-100 p-1 sm:mb-6">
            {/* Sliding pill */}
            <div
              aria-hidden
              className={cn(
                "absolute inset-y-1 left-1 w-[calc(50%-6px)] rounded-lg bg-primary shadow-xs transition-transform duration-600 ease-in-out",
                tab === ENUM_AUTH.LOGIN && "translate-x-[calc(100%+4px)]"
              )}
            />
            <button
              type="button"
              onClick={() => setTab(ENUM_AUTH.SIGNUP)}
              className={cn(
                "relative z-10 flex-1 rounded-lg py-2.5 text-sm font-bold transition-colors duration-200",
                tab === ENUM_AUTH.SIGNUP ? "text-white" : "text-primary"
              )}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setTab(ENUM_AUTH.LOGIN)}
              className={cn(
                "relative z-10 flex-1 rounded-lg py-2.5 text-sm font-bold transition-colors duration-200",
                tab === ENUM_AUTH.LOGIN ? "text-white" : "text-primary"
              )}
            >
              Log In
            </button>
          </div>

          {tab === ENUM_AUTH.SIGNUP ? (
            <SignUpForm onAuthSuccess={handleAuthSuccess} />
          ) : (
            <LogInForm
              onForgotPassword={handleForgotPassword}
              onAuthSuccess={handleAuthSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      <ForgotPasswordModal
        open={forgotOpen}
        onOpenChange={setForgotOpen}
        onBack={handleBackToLogin}
      />
    </>
  )
}
