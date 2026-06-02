import { createMutation } from "../api/mutation"

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
