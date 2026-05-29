import { createMutation } from "../api/mutation"
import { keyPartnerBankAccount } from "./queries"

export const useSaveBankAccount = createMutation({
  url: "/partner/bank-account",
  method: "POST",
  keysToRefetch: [keyPartnerBankAccount],
})

export const useUpdateBankAccount = createMutation({
  url: "/partner/bank-account",
  method: "PUT",
  keysToRefetch: [keyPartnerBankAccount],
})

export const useDeleteBankAccount = createMutation({
  url: "/partner/bank-account",
  method: "DELETE",
  keysToRefetch: [keyPartnerBankAccount],
})

export const useSubmitDispute = createMutation({
  url: "/partner/disputes",
  method: "POST",
})
