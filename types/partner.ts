export type ReferredCustomer = {
  plan: string
  first_name: string
  last_name: string
  commission_earned: number
  payout_status: string
  signup_date: string
}

export type PaginatedReferredCustomer = {
  id: number
  first_name: string
  last_name: string
  email?: string
  plan: string
  commission_earned: number
  payout_status: string
  signup_date: string
}

export type PaginatedResponse<T> = {
  content: T[]
  page: number
  size: number
  total_elements: number
  total_pages: number
}

export type PlanBreakdown = {
  monthly: number
  quarterly: number
  yearly: number
}

export type PartnerDashboardData = {
  id: number
  first_name: string
  last_name: string
  organization_name: string
  referral_code: string
  commission_rate: number
  total_signups: number
  paid_customers: number
  pending_payout: number
  total_paid_out: number
  plan_breakdown: PlanBreakdown
  customers_referred: ReferredCustomer[]
}

export type Bank = {
  id: number
  name: string
  code: string
  slug: string
  supports_transfer: boolean
  active: boolean
}

export type BankVerification = {
  account_number: string
  account_name: string
  bank_id: number
}

export type BankAccount = {
  id: number
  account_name: string
  account_number: string
  bank_name: string
  bank_code: string
  created_at: string
  updated_at: string
}

export type DisputeType =
  | "PAYMENT_NOT_RECEIVED"
  | "INCORRECT_AMOUNT"
  | "DELAYED_PAYMENT"
  | "OTHER"

export const DISPUTE_TYPE_LABELS: Record<DisputeType, string> = {
  PAYMENT_NOT_RECEIVED: "Payment Not Received",
  INCORRECT_AMOUNT: "Incorrect Amount",
  DELAYED_PAYMENT: "Delayed Payment",
  OTHER: "Others",
}
