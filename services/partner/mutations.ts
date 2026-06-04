import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createMutation } from "../api/mutation"
import { keyPartnerBankAccount, keyIncomingPayouts } from "./queries"
import instance from "../api/instance"

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

export const useAcknowledgePayout = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payoutId: number) =>
      instance.post(`/partner/payout/${payoutId}/acknowledge`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keyIncomingPayouts })
    },
  })
}
