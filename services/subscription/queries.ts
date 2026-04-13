import { createQuery } from "../api/queries"
import { QueryResGetPlans } from "./types"

export const keyPlans = ["user-plans"]

export const useQueryPlans = createQuery<QueryResGetPlans>({
  key: keyPlans,
  url: "/user/plans",
})

export const keyPublicPricing = ["public-pricing"]

export const useQueryPublicPricing = createQuery<QueryResGetPlans>({
  key: keyPublicPricing,
  url: "/public/pricing",
})
