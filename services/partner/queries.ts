import { createQuery } from "../api/queries"
import { PartnerDashboardData, Bank, BankAccount, BankVerification } from "@/types/partner"

export const keyPartnerDashboard = ["partner-dashboard"]
export const keyPartnerBanks = ["partner-banks"]
export const keyPartnerBankAccount = ["partner-bank-account"]
export const keyIncomingPayouts = ["partner-incoming-payouts"]

export type IncomingPayout = {
  payout_id: number
  amount: number
  note: string
  receipt_url?: string | null
  initiated_at: string
}

export const useQueryPartnerDashboard = createQuery<{ data: PartnerDashboardData }>({
  key: keyPartnerDashboard,
  url: "/partner/dashboard",
  options: {
    staleTime: 5 * 60 * 1000,
  },
})

export const useQueryPartnerBanks = createQuery<{ data: Bank[] }>({
  key: keyPartnerBanks,
  url: "/partner/banks",
})

export const useQueryVerifyBankAccount = createQuery<{ data: BankVerification }>({
  key: (params) => ["partner-bank-verify", params],
  url: "/partner/banks/verify",
})

export const useQueryPartnerBankAccount = createQuery<{ data: BankAccount }>({
  key: keyPartnerBankAccount,
  url: "/partner/bank-account",
})

export const useQueryIncomingPayouts = createQuery<{ data: IncomingPayout[] }>({
  key: keyIncomingPayouts,
  url: "/partner/payout/incoming",
})
