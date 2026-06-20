import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createMutation } from "../api/mutation"
import adminAxios from "./adminInstance"

export type AdminLoginResponse = {
  status: boolean
  message: string
}

export type AdminVerifyOtpResponse = {
  status: boolean
  message: string
  data: {
    access_token: string
    refresh_token: string
    device_token?: string
    user: {
      id: number
      first_name: string
      last_name: string
      user_role: string
      [key: string]: unknown
    }
  }
}

export type AdminDeviceTokenResponse = {
  status: boolean
  message: string
  data: {
    access_token: string
    refresh_token: string
    user: {
      id: number
      first_name: string
      last_name: string
      user_role: string
      [key: string]: unknown
    }
  }
}

export const useAdminLogin = createMutation<AdminLoginResponse>({
  url: "/admin/auth/login",
  method: "POST",
})

export const useAdminVerifyOtp = createMutation<AdminVerifyOtpResponse>({
  url: "/admin/auth/verify-otp",
  method: "POST",
})

export const useAdminLoginWithDeviceToken =
  createMutation<AdminDeviceTokenResponse>({
    url: "/admin/auth/login-with-device-token",
    method: "POST",
  })

// ── User management ───────────────────────────────────────────────────────────

export const useAdminResetUserPassword = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
      adminAxios
        .post(`/admin/users/${userId}/reset-password`, { reason })
        .then((r) => r.data),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ["admin-user-detail", userId] })
      qc.invalidateQueries({ queryKey: ["admin-audit-logs"] })
    },
  })
}

export const useAdminDeactivateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
      adminAxios
        .put(`/admin/users/${userId}/deactivate`, { reason })
        .then((r) => r.data),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ["admin-user-detail", userId] })
      qc.invalidateQueries({ queryKey: ["admin-all-users"] })
      qc.invalidateQueries({ queryKey: ["admin-audit-logs"] })
    },
  })
}

export const useAdminReactivateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) =>
      adminAxios
        .put(`/admin/users/${userId}/reactivate`)
        .then((r) => r.data),
    onSuccess: (_data, userId) => {
      qc.invalidateQueries({ queryKey: ["admin-user-detail", userId] })
      qc.invalidateQueries({ queryKey: ["admin-all-users"] })
      qc.invalidateQueries({ queryKey: ["admin-audit-logs"] })
    },
  })
}

export const useAdminDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
      adminAxios
        .delete(`/admin/users/${userId}`, { data: { reason } })
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-all-users"] })
      qc.invalidateQueries({ queryKey: ["admin-users-overview"] })
      qc.invalidateQueries({ queryKey: ["admin-audit-logs"] })
    },
  })
}

// ── Partners ──────────────────────────────────────────────────────────────────

export const useAdminPartnerPayout = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ partnerId, amount, note, receipt }: { partnerId: number; amount: number; note: string; receipt?: File }) => {
      const form = new FormData()
      form.append("amount", String(amount))
      form.append("note", note)
      if (receipt) form.append("receipt", receipt)
      return adminAxios
        .post(`/admin/partners/${partnerId}/payout`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data)
    },
    onSuccess: (_data, { partnerId }) => {
      qc.invalidateQueries({ queryKey: ["admin-partner-detail", partnerId] })
    },
  })
}

// ── Subscription Plans ────────────────────────────────────────────────────────

export type SubscriptionPlanPayload = {
  amount: number
  duration: string
  discount: number
  plan_type: string
  subscription_benefits: string[]
}

export const useAdminCreateSubscriptionPlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SubscriptionPlanPayload) =>
      adminAxios.post("/admin/subscription-plans", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-subscription-plans"] })
    },
  })
}

export const useAdminUpdateSubscriptionPlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ planId, ...payload }: SubscriptionPlanPayload & { planId: number }) =>
      adminAxios.put(`/admin/subscription-plans/${planId}`, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-subscription-plans"] })
    },
  })
}

export const useAdminDeleteSubscriptionPlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (planId: number) =>
      adminAxios.delete(`/admin/subscription-plans/${planId}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-subscription-plans"] })
    },
  })
}

// ── Commission Rate ───────────────────────────────────────────────────────────

export const useAdminSetCommissionRate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (rate: number) =>
      adminAxios.put("/admin/comission-rate", { rate }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-commission-rate"] })
    },
  })
}

// ── Payment Verification ──────────────────────────────────────────────────────

export type PaymentVerificationResult = {
  reference: string
  action: string
  message: string
  email: string
  duration: string
  local_status: string
  flutterwave_status: string
  user_id: number
  user_name: string
  plan_type: string
  amount_paid: number
  activated_at: string
  expires_at: string
  created_at: string
}

export const useAdminVerifyPayment = () =>
  useMutation({
    mutationFn: (reference: string) =>
      adminAxios
        .post(`/admin/payments/${reference}/verify`)
        .then((r) => r.data as { status: boolean; message: string; data: PaymentVerificationResult }),
  })

// ── Courses ───────────────────────────────────────────────────────────────────

export type CreateModulePayload = {
  module_title: string
  module_description?: string
  no_of_lessons: number
  sequence_num: number
  module_tier?: string
  age_group?: string
  module_cover_image?: File
}

export type CreateModuleResponse = {
  status: boolean
  message: string
  data: { module_id: string }
}

function buildModuleForm(payload: CreateModulePayload): FormData {
  const form = new FormData()
  form.append("module_title", payload.module_title)
  if (payload.module_description) form.append("module_description", payload.module_description)
  form.append("no_of_lessons", String(payload.no_of_lessons))
  form.append("sequence_num", String(payload.sequence_num))
  if (payload.module_tier) form.append("module_tier", payload.module_tier)
  if (payload.age_group) form.append("age_group", payload.age_group)
  if (payload.module_cover_image) form.append("module_cover_image", payload.module_cover_image)
  return form
}

export const useAdminCreateModule = () =>
  useMutation({
    mutationFn: (payload: CreateModulePayload) =>
      adminAxios
        .post<CreateModuleResponse>("/admin/create-module", buildModuleForm(payload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
  })

export const useAdminEditModule = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ moduleId, ...payload }: CreateModulePayload & { moduleId: string }) =>
      adminAxios
        .put(`/admin/edit-module/${moduleId}`, buildModuleForm(payload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-published-modules"] })
    },
  })
}

export const useAdminDeleteModule = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (moduleId: string) =>
      adminAxios.delete("/admin/delete-module", { params: { module_id: moduleId } }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-published-modules"] })
    },
  })
}

export const useAdminCreateModuleDraft = () =>
  useMutation({
    mutationFn: (payload: CreateModulePayload) =>
      adminAxios
        .post<CreateModuleResponse>("/admin/create-module/draft", buildModuleForm(payload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
  })

export type CreateLessonPayload = {
  lesson_title: string
  lesson_duration: string
  lesson_description: string
  module_id: string
  serial_number: number
  file?: File
  lesson_cover_image?: File
}

export type CreateLessonResponse = {
  status: boolean
  message: string
  data: unknown
}

function buildLessonForm(payload: CreateLessonPayload): FormData {
  const form = new FormData()
  form.append("lesson_title", payload.lesson_title)
  form.append("lesson_duration", payload.lesson_duration)
  form.append("lesson_description", payload.lesson_description)
  form.append("module_id", payload.module_id)
  form.append("serial_number", String(payload.serial_number))
  if (payload.file) form.append("file", payload.file)
  if (payload.lesson_cover_image) form.append("lesson_cover_image", payload.lesson_cover_image)
  return form
}

export const useAdminCreateLesson = () =>
  useMutation({
    mutationFn: (payload: CreateLessonPayload) =>
      adminAxios
        .post<CreateLessonResponse>("/admin/create-lesson", buildLessonForm(payload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
  })

export const useAdminEditLesson = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ lessonId, ...payload }: CreateLessonPayload & { lessonId: number }) =>
      adminAxios
        .put(`/admin/edit-lesson/${lessonId}`, buildLessonForm(payload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
    onSuccess: (_data, { module_id }) => {
      qc.invalidateQueries({ queryKey: ["admin-module-lessons", module_id] })
    },
  })
}

export const useAdminCreateLessonDraft = () =>
  useMutation({
    mutationFn: (payload: CreateLessonPayload) =>
      adminAxios
        .post<CreateLessonResponse>("/admin/create-lesson/draft", buildLessonForm(payload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
  })

export const useAdminPublishModule = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (moduleId: string) =>
      adminAxios.put(`/admin/modules/${moduleId}/publish`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-unpublished-modules"] })
      qc.invalidateQueries({ queryKey: ["admin-published-modules"] })
    },
  })
}

export const useAdminPublishLesson = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (lessonId: number) =>
      adminAxios.put(`/admin/lessons/${lessonId}/publish`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-unpublished-modules"] })
    },
  })
}
