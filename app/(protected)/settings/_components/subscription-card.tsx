"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context"

import { toast } from "sonner"
import { useMutateCancelSubscription } from "@/services/subscription/mutations"
import { SubscriptionStatus } from "@/types/subscription"
import {
  CancelSubscriptionConfirmModal,
  CancelSubscriptionSuccessModal,
  ContactSupportModal,
  MessageSentModal,
} from "./modals"

export function SubscriptionCard() {
  const router = useRouter()
  const { activeUser } = useAuthContext()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelledOpen, setCancelledOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [messageOpen, setMessageOpen] = useState(false)
  const [contactMessage, setContactMessage] = useState("")
  const subscription = activeUser?.subscription
  const subscriptionStatus =
    activeUser?.subscription_status ??
    subscription?.subscription_status ??
    SubscriptionStatus.FREE

  const isFree =
    !subscriptionStatus ||
    subscriptionStatus === SubscriptionStatus.FREE

  const { mutate: cancelSubscription, isPending: isCancelling } =
    useMutateCancelSubscription({
      onSuccess: () => {
        setCancelOpen(false)
        setCancelledOpen(true)
      },
    })

  const handleCancelConfirm = () => {
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
                : `${activeUser?.plan_type ?? subscription?.plan_type ?? "No"} PLAN`}
            </p>
            {!isFree && (activeUser?.end_date ?? subscription?.end_date) && (
              <p className="mt-0.5 text-xs text-gray-500">
                Renews on{" "}
                {new Date(
                  (activeUser?.end_date ?? subscription?.end_date)!
                ).toLocaleDateString(undefined, {
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
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white ${
              subscriptionStatus === SubscriptionStatus.CANCELLED ||
              subscriptionStatus === SubscriptionStatus.EXPIRED
                ? "bg-red-500"
                : "bg-primary"
            }`}
          >
            {subscriptionStatus}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            type="button"
            className="h-10 rounded-lg px-5"
            onClick={() => router.push("/subscription")}
          >
            Upgrade plan
          </Button>
          {!isFree && (
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg px-5"
              onClick={() => setCancelOpen(true)}
            >
              Cancel plan
            </Button>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          className="h-10 w-full rounded-lg text-primary"
          onClick={() => setContactOpen(true)}
        >
          Contact support
        </Button>
      </div>

      <CancelSubscriptionConfirmModal
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onConfirm={handleCancelConfirm}
        isLoading={isCancelling}
      />

      <CancelSubscriptionSuccessModal
        open={cancelledOpen}
        onOpenChange={setCancelledOpen}
      />

      <ContactSupportModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        onSuccess={(msg) => {
          setContactMessage(msg)
          setMessageOpen(true)
        }}
      />

      <MessageSentModal
        open={messageOpen}
        onOpenChange={setMessageOpen}
        message={contactMessage}
      />
    </div>
  )
}
