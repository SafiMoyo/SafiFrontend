"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"
import { ENUM_BillingCycle } from "@/types/subscription"
import { useQueryPublicPricing } from "@/services/subscription/queries"
import { ENUM_PLAN_TYPE, PlanType } from "@/types/plan"
import { AuthModal } from "@/components/modals/auth"
import { SelectProfileModal } from "@/components/modals/select-profile-modal"
import { ENUM_AUTH } from "@/lib/enum"

export default function PricingPage() {
  const [billing, setBilling] = useState<ENUM_BillingCycle>(
    ENUM_BillingCycle.YEARLY
  )
  const [authOpen, setAuthOpen] = useState(false)
  const [selectProfileOpen, setSelectProfileOpen] = useState(false)

  const { data: plansData, isLoading: plansLoading } =
    useQueryPublicPricing({})

  const plans = plansData?.data ?? []
  const filteredPlans = plans.filter(
    (plan) => plan.duration.toLowerCase() === billing
  )

  const getPrice = (plan: PlanType) => plan.amount

  const formatPrice = (amount: number) => `₦${amount?.toLocaleString()}`

  const getSavings = (plan: PlanType) => {
    if (billing !== ENUM_BillingCycle.YEARLY) return null
    const saved = plan.amount * 0.2
    return saved > 0 ? `Save ₦${saved.toLocaleString()}` : null
  }

  const isFamilyPlan = (plan: PlanType) =>
    plan.plan_type === ENUM_PLAN_TYPE.FAMILY

  return (
    <div className="min-h-screen bg-purple-100/20">
      <Navbar />

      <div className="mx-auto max-w-3xl px-5 py-16">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="mx-auto max-w-lg text-sm text-gray-500">
            Choose the plan that works best for you and your family.
            <br />
            Unlock the full AI curriculum and start learning today.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mb-8 flex justify-center gap-2">
          {(
            [
              { label: "Monthly", value: ENUM_BillingCycle.MONTHLY },
              { label: "Quarterly", value: ENUM_BillingCycle.QUARTERLY },
              { label: "Yearly", value: ENUM_BillingCycle.YEARLY },
            ] as const
          ).map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setBilling(value)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                billing === value
                  ? "bg-primary text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-primary/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        {plansLoading ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-sm">
            Loading plans...
          </div>
        ) : filteredPlans.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {filteredPlans.map((plan) => {
              const featured = isFamilyPlan(plan)
              const savings = getSavings(plan)
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 transition-shadow ${
                    featured
                      ? "border-2 border-primary bg-white shadow-md"
                      : "border border-gray-100 bg-white shadow-sm"
                  }`}
                >
                  <p className="mb-1 text-lg font-bold text-gray-900">
                    {plan.plan_type === ENUM_PLAN_TYPE.INDIVIDUAL
                      ? "Individual Plan"
                      : "Family Plan"}
                  </p>
                  {savings && (
                    <p className="mb-3 text-xs font-medium text-primary">
                      {savings}
                    </p>
                  )}

                  <div className="mb-6 flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {formatPrice(getPrice(plan))}
                    </span>
                    <span className="text-sm text-gray-400">
                      per{" "}
                      {billing === ENUM_BillingCycle.YEARLY
                        ? "year"
                        : billing === ENUM_BillingCycle.QUARTERLY
                          ? "quarter"
                          : "month"}
                    </span>
                  </div>

                  <ul className="mb-6 space-y-2.5">
                    {plan.subscription_benefits.map((feature) => (
                      <li
                        key={feature.id}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded ${
                            featured ? "bg-primary" : "bg-primary/10"
                          }`}
                        >
                          <Check
                            size={11}
                            className={featured ? "text-white" : "text-primary"}
                            strokeWidth={3}
                          />
                        </span>
                        {feature.benefit}
                      </li>
                    ))}
                  </ul>

                  <Button
                    type="button"
                    variant={featured ? "default" : "outline"}
                    className="h-11 w-full rounded-full"
                    onClick={() => setAuthOpen(true)}
                  >
                    Unlock Full Access
                  </Button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-sm">
            Subscription plans are not available right now. Please try again.
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
