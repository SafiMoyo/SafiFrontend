import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SubscriptionCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <CreditCard size={18} className="text-primary" />
        <h2 className="font-bold text-gray-900">Subscription</h2>
      </div>

      <div className="mb-4 rounded-xl border border-purple-100 bg-purple-50/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-gray-900">Monthly plan</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Renews on April 1st, 2026
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            Active
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Button type="button" className="h-12 w-full rounded-full">
          Upgrade plan
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-full"
        >
          Cancel subscription
        </Button>
      </div>
    </div>
  )
}
