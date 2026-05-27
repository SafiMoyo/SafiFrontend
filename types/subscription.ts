export enum ENUM_BillingCycle {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
}

export enum SubscriptionStatus {
  FREE = "FREE",
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  EXPIRED = "SUBSCRIPTION EXPIRED",
}

export type SubscriptionType = {
  duration: string | null
  subscription_status: SubscriptionStatus
  plan_id: number | null
  plan_type: string | null
  amount_paid: number | null
  start_date: string | null
  end_date: string | null
  paid_at: string | null
}
