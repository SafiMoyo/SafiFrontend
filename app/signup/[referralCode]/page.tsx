"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tag } from "lucide-react"
import { SignUpForm } from "@/components/modals/auth/signup-form"
import { useRouter } from "next/navigation"
import { ROUTE_KEYS } from "@/lib/constants"
import { UserRole } from "@/types/user"

export default function ReferralSignupPage({
  params,
}: {
  params: Promise<{ referralCode: string }>
}) {
  const { referralCode } = use(params)
  const router = useRouter()

  function handleAuthSuccess(accountType: string, userRole?: string) {
    if (userRole === UserRole.PARTNER) {
      router.push(ROUTE_KEYS.PARTNER_DASHBOARD)
    } else if (accountType === "FAMILY") {
      router.push(ROUTE_KEYS.DASHBOARD)
    } else {
      router.push(ROUTE_KEYS.DASHBOARD)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-purple-100/40 px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt="Safi"
              width={100}
              height={36}
              className="h-9 w-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          {/* Invite banner */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Tag size={15} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-gray-900">
                You&apos;ve been invited!
              </p>
              <p className="truncate text-xs font-semibold text-gray-500">
                Referral code{" "}
                <span className="font-extrabold text-primary">
                  {referralCode}
                </span>{" "}
                will be applied automatically.
              </p>
            </div>
          </div>

          <h1 className="mb-1 text-xl font-extrabold text-gray-900">
            Create your Safi account
          </h1>
          <p className="mb-5 text-sm font-semibold text-gray-500">
            Start your AI learning journey today.
          </p>

          <SignUpForm
            initialReferralCode={referralCode}
            onAuthSuccess={handleAuthSuccess}
          />
        </div>

        <p className="mt-4 text-center text-xs font-semibold text-gray-400">
          Already have an account?{" "}
          <Link href="/" className="font-extrabold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
