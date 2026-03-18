"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ENUM_AUTH } from "@/lib/enum"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SignUpForm } from "./signup-form"
import { LogInForm } from "./login-form"
import { ForgotPasswordModal } from "./forgot-password-modal"
import { useAuthContext } from "@/context"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  authTab: ENUM_AUTH
}

export function AuthModal({ open, onOpenChange, authTab }: Props) {
  const router = useRouter()
  const { isAuthenticated } = useAuthContext()
  const [tab, setTab] = useState<ENUM_AUTH>(authTab)
  const [forgotOpen, setForgotOpen] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setTab(authTab), [authTab])

  useEffect(() => {
    if (open && isAuthenticated) {
      onOpenChange(false)
      router.push("/dashboard")
    }
  }, [isAuthenticated, onOpenChange, open, router])

  function handleForgotPassword() {
    onOpenChange(false)
    setForgotOpen(true)
  }

  function handleBackToLogin() {
    setForgotOpen(false)
    setTab(ENUM_AUTH.LOGIN)
    onOpenChange(true)
  }

  function handleSignupSuccess() {
    setTab(ENUM_AUTH.LOGIN)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-lg gap-0 overflow-hidden bg-white p-6">
          <div className="mb-4 flex justify-center">
            <Image
              src="/images/logo.svg"
              alt="Safi"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          <div className="mb-5 text-center">
            <h2 className="text-2xl font-extrabold text-gray-900">
              {tab === ENUM_AUTH.SIGNUP
                ? "Welcome to Safi!"
                : "Welcome back to Safi!"}
            </h2>
            <p className="mt-1 text-sm font-semibold text-gray-700">
              {tab === ENUM_AUTH.SIGNUP
                ? "Start your learning journey today"
                : "Continue your learning journey"}
            </p>
          </div>

          {/* Sliding tab switcher */}
          <div className="relative mb-6 flex rounded-xl bg-purple-100 p-1">
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
            <SignUpForm onSignedUp={handleSignupSuccess} />
          ) : (
            <LogInForm onForgotPassword={handleForgotPassword} />
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
