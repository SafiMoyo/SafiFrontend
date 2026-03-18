import { createQuery } from "../api/queries"
import { QueryUserTypeRes } from "./types"

export const keyMe = ["me"]
export const useQueryMe = createQuery<QueryUserTypeRes>({
  key: keyMe,
  url: "/auth/get-profile",
})
