"use client"

import { BaseConfirmationModal } from "./base-confirmation-modal"

type CancelSubscriptionConfirmModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading?: boolean
}

export function CancelSubscriptionConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: CancelSubscriptionConfirmModalProps) {
  return (
    <BaseConfirmationModal
      open={open}
      onOpenChange={onOpenChange}
      title="Cancel Subscription"
      description="Are you sure you want to cancel?"
      cancelLabel="No"
      confirmLabel="Yes"
      onConfirm={onConfirm}
      confirmLoading={isLoading}
      tone="purple"
    />
  )
}
