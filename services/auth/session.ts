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

/**
 * Returns localStorage when "remember me" is checked,
 * sessionStorage otherwise (cleared when the browser tab closes).
 */
export const getAuthStorage = (): Storage | null => {
  if (typeof window === "undefined") return null
  const remembered = localStorage.getItem(STORAGE_KEYS.accessToken)
  // If a token lives in localStorage already (remembered session), use it.
  // During a fresh login the caller passes the storage explicitly via persistAuthSession.
  return remembered ? localStorage : sessionStorage
}

export const persistAuthSession = (
  payload: ParsedAuthPayload,
  remember = false
) => {
  if (typeof window === "undefined") return

  // Clear the other storage so stale tokens don't linger.
  const primary = remember ? localStorage : sessionStorage
  const other = remember ? sessionStorage : localStorage

  const sessionKeys = [
    STORAGE_KEYS.accessToken,
    STORAGE_KEYS.refreshToken,
    STORAGE_KEYS.userId,
  ]
  sessionKeys.forEach((k) => other.removeItem(k))

  if (payload.accessToken) {
    primary.setItem(STORAGE_KEYS.accessToken, payload.accessToken)
  }

  if (payload.refreshToken) {
    primary.setItem(STORAGE_KEYS.refreshToken, payload.refreshToken)
  }

  if (payload.userId) {
    primary.setItem(STORAGE_KEYS.userId, payload.userId)
  }
}

// Copies tokens from sessionStorage → localStorage so they survive a cross-origin
// redirect (e.g. Paystack payment) where sessionStorage may not be restored.
export const promoteSessionToLocalStorage = () => {
  if (typeof window === "undefined") return
  const keys = [STORAGE_KEYS.accessToken, STORAGE_KEYS.refreshToken, STORAGE_KEYS.userId]
  keys.forEach((k) => {
    const val = sessionStorage.getItem(k)
    if (val && !localStorage.getItem(k)) {
      localStorage.setItem(k, val)
    }
  })
}

export const clearAuthSession = () => {
  if (typeof window === "undefined") return

  const keys = [
    STORAGE_KEYS.accessToken,
    STORAGE_KEYS.refreshToken,
    STORAGE_KEYS.webSocketToken,
    STORAGE_KEYS.userId,
    STORAGE_KEYS.username,
    STORAGE_KEYS.activeUser,
    STORAGE_KEYS.loggedIn,
  ]

  keys.forEach((k) => {
    localStorage.removeItem(k)
    sessionStorage.removeItem(k)
  })
}

export const getStoredAccessToken = (): string | null => {
  if (typeof window === "undefined") return null
  return (
    localStorage.getItem(STORAGE_KEYS.accessToken) ||
    sessionStorage.getItem(STORAGE_KEYS.accessToken)
  )
}

export const getStoredRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null
  return (
    localStorage.getItem(STORAGE_KEYS.refreshToken) ||
    sessionStorage.getItem(STORAGE_KEYS.refreshToken)
  )
}

export const hasStoredAccessToken = () => Boolean(getStoredAccessToken())
