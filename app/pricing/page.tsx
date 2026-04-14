"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"
import { AuthModal } from "@/components/modals/auth"
import { SelectProfileModal } from "@/components/modals/select-profile-modal"
import { ENUM_AUTH } from "@/lib/enum"
import { useAuthContext } from "@/context"
import { useRouter } from "next/navigation"

type PricingBenefit = { id: number; benefit: string }
type PricingPlan = {
  id: number
  amount: number
  discount: number
  duration: string
  plan_type: "INDIVIDUAL" | "FAMILY"
  subscription_benefits: PricingBenefit[]
}

export default function PricingPage() {
  const { isAuthenticated } = useAuthContext()
  const router = useRouter()
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [authOpen, setAuthOpen] = useState(false)
  const [selectProfileOpen, setSelectProfileOpen] = useState(false)

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
    fetch(`${baseUrl}public/pricing`)
      .then((r) => r.json())
      .then((json) => setPlans(json.data ?? []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false))
  }, [])

  const handleUnlock = () => {
    if (isAuthenticated) {
      router.push("/subscription")
    } else {
      setAuthOpen(true)
    }
  }

  const formatAmount = (amount: number) => `₦${amount.toLocaleString()}`

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-[#F3E6C4] px-6 py-3">
        <div className="mx-auto max-w-7xl text-lg font-bold">Pricing</div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-extrabold text-gray-900">
            Simple, transparent pricing
          </h1>
          <p className="text-gray-500">
            Choose the plan that works best for you and your family.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <p className="text-center text-gray-500">
            Plans unavailable right now. Please check back later.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {plans.map((plan) => {
              const isFamily = plan.plan_type === "FAMILY"
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-2xl p-8 transition-shadow ${
                    isFamily
                      ? "border-2 border-primary bg-white shadow-lg"
                      : "border border-gray-200 bg-white shadow-sm"
                  }`}
                >
                  {isFamily && (
                    <span className="mb-3 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      Most Popular
                    </span>
                  )}

                  <h2 className="mb-1 text-xl font-extrabold text-gray-900">
                    {plan.plan_type === "INDIVIDUAL" ? "Individual" : "Family"}{" "}
                    Plan
                  </h2>
                  <p className="mb-6 text-xs font-medium tracking-wide text-gray-400 uppercase">
                    {plan.duration}
                  </p>

                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-gray-900">
                      {formatAmount(plan.amount)}
                    </span>
                    <span className="text-sm text-gray-400">/month</span>
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.subscription_benefits.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-start gap-3 text-sm text-gray-700"
                      >
                        <span
                          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                            isFamily ? "bg-primary" : "bg-primary/10"
                          }`}
                        >
                          <Check
                            size={11}
                            strokeWidth={3}
                            className={isFamily ? "text-white" : "text-primary"}
                          />
                        </span>
                        {b.benefit}
                      </li>
                    ))}
                  </ul>

                  <Button
                    type="button"
                    variant={isFamily ? "default" : "outline"}
                    className="h-12 w-full rounded-full"
                    onClick={handleUnlock}
                  >
                    Unlock Full Access
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        authTab={ENUM_AUTH.SIGNUP}
        onFamilyAuth={() => {
          setAuthOpen(false)
          setSelectProfileOpen(true)
        }}
      />
      <SelectProfileModal
        open={selectProfileOpen}
        onOpenChange={setSelectProfileOpen}
      />
    </div>
  )
}
