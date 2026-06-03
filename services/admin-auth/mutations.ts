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
