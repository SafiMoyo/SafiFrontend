/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios"
import handleResponseError from "./handleResponseError"
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  persistAuthSession,
  parseAuthPayload,
  clearAuthSession,
} from "@/services/auth/session"

const baseURL = process.env.NEXT_PUBLIC_API_URL || ""

const requestHeaders: Record<string, string> = {
  "Content-Type": "application/json",
}

const Axios: AxiosInstance = axios.create({
  baseURL,
  headers: requestHeaders,
  timeout: 60000,
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

function handleSessionExpired() {
  if (typeof window === "undefined") return
  clearAuthSession()
  window.location.href = "/"
}

Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = getStoredAccessToken()
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Auth endpoints (login, etc.) return 401 for invalid credentials — not session expiry
      const isAuthEndpoint = originalRequest.url?.includes("/auth/login")
      if (isAuthEndpoint) {
        handleResponseError(error)
        return Promise.reject(error)
      }

      const refreshToken = getStoredRefreshToken()

      if (!refreshToken) {
        handleSessionExpired()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`
            return Axios(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
          refresh_token: refreshToken,
        })
        const payload = parseAuthPayload(response.data)
        persistAuthSession(payload)

        const newToken = payload.accessToken!
        processQueue(null, newToken)

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`
        return Axios(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        handleSessionExpired()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    handleResponseError(error)
    throw error
  }
)

export default Axios
