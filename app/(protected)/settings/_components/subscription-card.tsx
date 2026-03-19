"use client"

import { useRouter } from "next/navigation"
import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context"

import { toast } from "sonner"
import { useMutateCancelSubscription } from "@/services/subscription/mutations"
import { SubscriptionStatus } from "@/types/subscription"

export function SubscriptionCard() {
  const router = useRouter()
  const { activeUser } = useAuthContext()
  const subscription = activeUser?.subscription

  const isFree =
    !subscription ||
    subscription.subscription_status === SubscriptionStatus.FREE

  const { mutate: cancelSubscription, isPending: isCancelling } =
    useMutateCancelSubscription({
      onSuccess: () => toast.success("Subscription cancelled"),
    })

  const handleCancel = () => {
    cancelSubscription({})
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <CreditCard size={18} className="text-primary" />
        <h2 className="font-bold text-gray-900">Subscription</h2>
      </div>

      <div className="mb-4 rounded-xl border border-purple-100 bg-purple-50/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-gray-900">
              {isFree
                ? "Free Plan"
                : `${subscription?.plan_type ?? "Premium"} Plan`}
            </p>
            {!isFree && subscription?.end_date && (
              <p className="mt-0.5 text-xs text-gray-500">
                Renews on{" "}
                {new Date(subscription.end_date).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
            {isFree && (
              <p className="mt-0.5 text-xs text-gray-500">
                Upgrade to unlock all lessons
              </p>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            {isFree ? "Free" : "Active"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          className="h-12 w-full rounded-full"
          onClick={() => router.push("/subscription")}
        >
          {isFree ? "Upgrade plan" : "Change plan"}
        </Button>
        {!isFree && (
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full rounded-full"
            onClick={handleCancel}
            loading={isCancelling}
          >
            Cancel subscription
          </Button>
        )}
      </div>
    </div>
  )
}
