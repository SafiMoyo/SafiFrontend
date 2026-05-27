import { Check } from "lucide-react"
import { staticPlans } from "../utils"
import { Button } from "@/components/ui/button"
import { ENUM_BillingCycle } from "@/types/subscription"
import { ENUM_PLAN_TYPE } from "@/types/plan"

export function FallBackSubScriptionCards({
  billing,
  accountType,
  onUpgrade,
  isUpgrading,
}: {
  billing: ENUM_BillingCycle
  accountType?: ENUM_PLAN_TYPE
  onUpgrade: (id: number) => void
  isUpgrading: boolean
}) {
  const filteredPlans = staticPlans.filter(
    (plan) =>
      plan.duration.toLowerCase() === billing &&
      (!accountType || plan.plan_type === accountType)
  )

  const formatPrice = (amount: number) => `₦${amount?.toLocaleString()}`

  const getPeriodLabel = () => {
    if (billing === ENUM_BillingCycle.YEARLY) return "year"
    if (billing === ENUM_BillingCycle.QUARTERLY) return "quarter"
    return "month"
  }

  const getSavings = (amount: number) => {
    if (billing !== ENUM_BillingCycle.YEARLY) return null
    const saved = amount * 0.2
    return saved > 0 ? `Save ₦${saved.toLocaleString()}` : null
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {filteredPlans.map((plan) => {
        const featured = plan.plan_type === ENUM_PLAN_TYPE.FAMILY
        const savings = getSavings(plan.amount)

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
            {savings && (
              <p className="mb-3 text-xs font-medium text-primary">{savings}</p>
            )}

            <div className="mb-6 flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-gray-900">
                {formatPrice(plan.amount)}
              </span>
              <span className="text-sm text-gray-400">
                per {getPeriodLabel()}
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
              onClick={() => onUpgrade(plan.id)}
              loading={isUpgrading}
            >
              Unlock Full Access
            </Button>
          </div>
        )
      })}
    </div>
  )
}
