"use client"
import usePersistedState from "@/hooks/usePersistedState"
import { STORAGE_KEYS } from "@/lib/storage-keys"
import { useQueryMe } from "@/services/auth/queries"
import { clearAuthSession, hasStoredAccessToken, getStoredAccessToken } from "@/services/auth/session"

import { UserType } from "@/types/user"

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react"

export type AuthContextTypes = {
  loggedIn: null | boolean
  setLoggedIn: (data: boolean | null) => void
  isAuthenticated: boolean
  activeUser: UserType | null
  logout: () => void
}

const defaultValues: AuthContextTypes = {
  loggedIn: null,
  setLoggedIn: () => undefined,
  isAuthenticated: false,
  activeUser: null,
  logout: () => undefined,
}

export const AuthContext = createContext(defaultValues)

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = usePersistedState<null | boolean>({
    key: STORAGE_KEYS.loggedIn,
    defaultValue: null,
  })
  const [activeUser, setActiveUser] = usePersistedState<UserType | null>({
    key: STORAGE_KEYS.activeUser,
    defaultValue: null,
  })
  const userId =
    typeof window !== "undefined"
      ? ((localStorage.getItem(STORAGE_KEYS.userId) ||
          sessionStorage.getItem(STORAGE_KEYS.userId)) ??
        "")
      : ""

  const hasToken = hasStoredAccessToken()
  const isAuthenticated = Boolean(loggedIn || hasToken)

  const { data } = useQueryMe({
    enabled: isAuthenticated && userId?.length > 0,
    queryParams: {
      user_id: userId,
    },
  })

  useEffect(() => {
    if (hasToken && loggedIn !== true) {
      setLoggedIn(true)
    }
  }, [hasToken, loggedIn, setLoggedIn])

  useEffect(() => {
    if (data?.data) setActiveUser(data.data)
  }, [data, setActiveUser])

  const logout = useCallback(() => {
    clearAuthSession()
    setLoggedIn(false)
    setActiveUser(null)
  }, [setActiveUser, setLoggedIn])

  const value = useMemo(
    () => ({
      loggedIn,
      setLoggedIn,
      isAuthenticated,
      activeUser,
      logout,
    }),
    [activeUser, isAuthenticated, loggedIn, logout, setLoggedIn]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider
