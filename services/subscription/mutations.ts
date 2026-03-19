import { createMutation } from "../api/mutation"
import { keyMe } from "../auth/queries"
import { keyPlans } from "./queries"

export const useMutateCancelSubscription = createMutation({
  url: "/user/cancel-subscription",
  method: "POST",
  keysToRefetch: [keyMe, keyPlans],
})

export const useMutateUpgradePlan = createMutation({
  url: "/user/upgrade-plan",
  method: "POST",
  keysToRefetch: [keyMe, keyPlans],
})
export const useMutatePayStackWebhook = createMutation({
  url: "/webhook/paystack",
  method: "POST",
  keysToRefetch: [keyMe, keyPlans],
})
