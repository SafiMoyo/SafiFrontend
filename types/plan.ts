export enum ENUM_PLAN_TYPE {
  INDIVIDUAL = "INDIVIDUAL",
  FAMILY = "FAMILY",
}

export enum ENUM_PLAN_BILLING_CYCLE {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
}
export type PlanType = {
  id: number
  amount: number
  discount: number
  duration: ENUM_PLAN_BILLING_CYCLE
  plan_type: ENUM_PLAN_TYPE
  subscription_benefits: {
    id: number
    benefit: string
  }[]
}
