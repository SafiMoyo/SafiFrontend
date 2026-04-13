import { createMutation } from "../api/mutation"
import { keyMe } from "./queries"

export const useLoginUser = createMutation({
  url: "/auth/login",
  method: "POST",
})

export const useSignupUser = createMutation({
  url: "/auth/register",
  method: "POST",
})
export const useVerifyUserEmail = createMutation({
  url: "/auth/validate-email/",
  method: "POST",
})

export const useMutateForgotPassword = createMutation({
  url: "/auth/request-password-reset-email/",
  method: "POST",
})
export const useMutateResetPassword = createMutation({
  url: "/auth/change-password/",
  method: "POST",
})

export const useMutateUpdateProfile = createMutation({
  url: "/auth/update-profile",
  keysToRefetch: [keyMe],
  method: "PUT",
})
export const useMutateUpdateProfilePicture = createMutation({
  url: "/auth/upload-profile-picture",
  keysToRefetch: [keyMe],
  method: "POST",
  apiOptions: {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  },
})

export const useMutateDeleteAccount = createMutation({
  url: "/user/delete-account",
  method: "DELETE",
})

export const useSwitchProfile = createMutation({
  url: "/auth/switch-profile/:profileId",
  method: "POST",
})

export const useAddFamilyMember = createMutation({
  url: "/auth/add-family-member",
  keysToRefetch: [keyMe],
  method: "POST",
})

export const useMutateVerifyPassword = createMutation<{
  status: boolean
  message: string
}>({
  url: "/user/verify-password",
  method: "POST",
})

export const useMutateContactSupport = createMutation<{
  status: boolean
  message: string
  data: Record<string, unknown>
}>({
  url: "/contact",
  method: "POST",
})
