import { STORAGE_KEYS } from "@/lib/storage-keys"

type UnknownData = Record<string, unknown>

type ParsedAuthPayload = {
  accessToken?: string
  refreshToken?: string
  userId?: string
}

const toRecord = (value: unknown): UnknownData =>
  value && typeof value === "object" ? (value as UnknownData) : {}

export const extractResponseData = (response: unknown): UnknownData => {
  const root = toRecord(response)
  const data = root.data

  if (data && typeof data === "object") {
    return data as UnknownData
  }

  return root
}

export const parseAuthPayload = (response: unknown): ParsedAuthPayload => {
  const data = extractResponseData(response)
  const nestedUser = toRecord(data.user)

  const accessTokenRaw = data.access_token
  const refreshTokenRaw = data.refresh_token
  const userIdRaw = nestedUser.id

  const accessToken =
    typeof accessTokenRaw === "string" && accessTokenRaw.length > 0
      ? accessTokenRaw
      : undefined

  const refreshToken =
    typeof refreshTokenRaw === "string" && refreshTokenRaw.length > 0
      ? refreshTokenRaw
      : undefined

  const userId =
    typeof userIdRaw === "number" || typeof userIdRaw === "string"
      ? String(userIdRaw)
      : undefined

  return {
    accessToken,
    refreshToken,
    userId,
  }
}

export const persistAuthSession = (payload: ParsedAuthPayload) => {
  if (typeof window === "undefined") return

  if (payload.accessToken) {
    localStorage.setItem(STORAGE_KEYS.accessToken, payload.accessToken)
  }

  if (payload.refreshToken) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, payload.refreshToken)
  }

  if (payload.userId) {
    localStorage.setItem(STORAGE_KEYS.userId, payload.userId)
  }
}

export const clearAuthSession = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem(STORAGE_KEYS.accessToken)
  localStorage.removeItem(STORAGE_KEYS.refreshToken)
  localStorage.removeItem(STORAGE_KEYS.webSocketToken)
  localStorage.removeItem(STORAGE_KEYS.userId)
  localStorage.removeItem(STORAGE_KEYS.username)
  localStorage.removeItem(STORAGE_KEYS.activeUser)
  localStorage.removeItem(STORAGE_KEYS.loggedIn)
}

export const hasStoredAccessToken = () => {
  if (typeof window === "undefined") return false
  return Boolean(localStorage.getItem(STORAGE_KEYS.accessToken))
}
