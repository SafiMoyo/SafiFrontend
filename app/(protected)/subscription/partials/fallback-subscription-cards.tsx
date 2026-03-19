import { Check } from "lucide-react"
import { staticPlans } from "../utils"
import { Button } from "@/components/ui/button"
import { ENUM_BillingCycle } from "@/types/subscription"

export function FallBackSubScriptionCards({
  billing,
  onUpgrade,
  isUpgrading,
}: {
  billing: ENUM_BillingCycle
  onUpgrade: (id: number) => void
  isUpgrading: boolean
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {staticPlans.map((plan) => {
        const price =
          billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice
        const savings =
          billing === "yearly"
            ? `Save ₦${plan.yearlySavings.toLocaleString()} per year`
            : null

        return (
          <div
            key={plan.id}
            className={`rounded-2xl p-6 transition-shadow ${
              plan.featured
                ? "border-2 border-primary bg-white shadow-md"
                : "border border-gray-100 bg-white shadow-sm"
            }`}
          >
            <p className="mb-1 text-lg font-bold text-gray-900">{plan.name}</p>
            {savings && (
              <p className="mb-3 text-xs font-medium text-primary">{savings}</p>
            )}

            <div className="mb-6 flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-gray-900">
                ₦{price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400">
                per {billing === "yearly" ? "year" : "month"}
              </span>
            </div>

            <ul className="mb-6 space-y-2.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span
                    className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded ${
                      plan.featured ? "bg-primary" : "bg-primary/10"
                    }`}
                  >
                    <Check
                      size={11}
                      className={plan.featured ? "text-white" : "text-primary"}
                      strokeWidth={3}
                    />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              type="button"
              variant={plan.featured ? "default" : "outline"}
              className="h-11 w-full rounded-full"
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
