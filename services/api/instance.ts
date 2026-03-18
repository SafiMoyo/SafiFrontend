/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios"
import handleResponseError from "./handleResponseError"

const baseURL = process.env.NEXT_PUBLIC_API_URL || ""

const requestHeaders: Record<string, string> = {
  "Content-Type": "application/json",
}

const Axios: AxiosInstance = axios.create({
  baseURL,
  headers: requestHeaders,
})

function handleClearLocalStorage() {
  if (typeof window === "undefined") return
  ;["user", "loggedIn", "accessToken"].forEach((key) => {
    localStorage.removeItem(key)
  })
}

Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken")
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
    handleClearLocalStorage()
    handleResponseError(error)

    throw error
  }
)

export default Axios
