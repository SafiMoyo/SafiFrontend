"use client"

import { Check, Lock, BookOpen, ChevronLeft } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"
import { useRouter } from "next/navigation"

import { toast } from "sonner"
import { SubscriptionProgressItem } from "./components/subscription-progress-item"
import { ENUM_BillingCycle } from "@/types/subscription"
import { useAuthContext } from "@/context"
import { useQueryPlans } from "@/services/subscription/queries"
import { useQueryDashboardStatistics } from "@/services/module-lesson/queries"
import { useMutateUpgradePlan } from "@/services/subscription/mutations"
import { promoteSessionToLocalStorage } from "@/services/auth/session"
import { ENUM_PLAN_TYPE, PlanType } from "@/types/plan"

export default function SubscriptionPage() {
  const router = useRouter()
  const { activeUser } = useAuthContext()
  const [billing, setBilling] = useState<ENUM_BillingCycle>(
    ENUM_BillingCycle.MONTHLY
  )

  const { data: plansData, isLoading: plansLoading } = useQueryPlans({})
  const { data: statsData } = useQueryDashboardStatistics({
    queryParams: {
      user_id: activeUser?.id.toString() || "",
    },
  })

  const plans = plansData?.data ?? []
  const filteredPlans = plans
    .filter(
      (plan) =>
        plan.plan_type === (activeUser?.account_type as unknown as ENUM_PLAN_TYPE) &&
        plan.duration.toLowerCase() === billing
    )
    .sort((a, b) => {
      if (a.plan_type === ENUM_PLAN_TYPE.FAMILY) return -1
      if (b.plan_type === ENUM_PLAN_TYPE.FAMILY) return 1
      return 0
    })
  const stats = statsData?.data

  const { mutate: upgradePlan, isPending: isUpgrading } = useMutateUpgradePlan({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (res: any) => {
      const url = res?.data?.authorization_url
      if (url) {
        promoteSessionToLocalStorage()
        window.location.href = url
      } else {
        toast.success("Plan upgraded successfully!")
      }
    },
  })

  const handleUpgrade = (planId: number, billingCycle: ENUM_BillingCycle) => {
    upgradePlan({ plan_id: planId, billing_cycle: billingCycle })
  }

  const getPrice = (plan: PlanType) => plan.amount

  const formatPrice = (amount: number) => `₦${amount?.toLocaleString()}`

  const getBillingCycle = (plan: PlanType): ENUM_BillingCycle =>
    plan.duration.toLowerCase() as ENUM_BillingCycle

  const getSavings = (plan: PlanType) => {
    if (getBillingCycle(plan) !== ENUM_BillingCycle.YEARLY) return null
    const saved = plan.amount * 0.2
    return saved > 0 ? `Save ₦${saved.toLocaleString()}` : null
  }

  const isFamilyPlan = (plan: PlanType) =>
    plan.plan_type === ENUM_PLAN_TYPE.FAMILY

  const lessonsCompleted = stats?.lessons_done ?? 0
  const totalLessons = stats?.overall_progress?.total_lessons ?? 0
  const lockedLessons = totalLessons - lessonsCompleted

  return (
    <div className="min-h-screen bg-purple-100/20">
      <Navbar />

      <div className="mx-auto max-w-5xl px-5 py-6">
        <div className="mb-8 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 transition hover:text-primary"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        </div>
        {/* Top row — title/subtext left, progress card right */}
        <div className="mb-8 grid items-start gap-6 lg:grid-cols-[1fr_220px]">
          <div>
            <h1 className="mb-3 text-4xl font-bold text-gray-900">
              Upgrade to <span className="text-primary">Continue</span>
            </h1>
            <p className="max-w-lg text-sm text-gray-500">
              You&apos;ve successfully completed your free introductory module.
              Now it&apos;s time to unlock the full potential of AI with our
              complete curriculum.
            </p>
          </div>

          {/* Progress card */}
          <div className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="mb-4 font-bold text-gray-900">Your Progress</p>
            <ul className="space-y-3">
              <SubscriptionProgressItem
                icon={<Check size={12} strokeWidth={3} className="text-white" />}
                label="30-Day Trial Active"
                active
              />
              <SubscriptionProgressItem
                icon={<BookOpen size={12} className="text-white" />}
                label={`${lessonsCompleted} Lesson${lessonsCompleted !== 1 ? "s" : ""} Completed`}
                active={lessonsCompleted > 0}
              />
              <SubscriptionProgressItem
                icon={<Lock size={12} className="text-white" />}
                label={`${lockedLessons > 0 ? `${lockedLessons}+` : "Many"} Lessons Locked`}
                active={false}
              />
            </ul>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="mb-6 flex justify-center gap-2">
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

        {/* Plan cards — full width below */}
        {plansLoading ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-sm">
            Loading plans...
          </div>
        ) : filteredPlans.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {filteredPlans.map((plan) => {
              const featured = isFamilyPlan(plan)
              const savings = getSavings(plan)
              const billingCycle = getBillingCycle(plan)
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-2xl p-6 transition-shadow ${
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
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary/70">
                    {billingCycle === ENUM_BillingCycle.YEARLY
                      ? "Yearly"
                      : billingCycle === ENUM_BillingCycle.QUARTERLY
                        ? "Quarterly"
                        : "Monthly"}
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
                      {billingCycle === ENUM_BillingCycle.YEARLY
                        ? "year"
                        : billingCycle === ENUM_BillingCycle.QUARTERLY
                          ? "quarter"
                          : "month"}
                    </span>
                  </div>

                  <ul className="mb-6 flex-1 space-y-2.5">
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
                    className="mt-auto h-11 w-full rounded-full"
                    onClick={() => handleUpgrade(plan.id, billingCycle)}
                    loading={isUpgrading}
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
    </div>
  )
}
