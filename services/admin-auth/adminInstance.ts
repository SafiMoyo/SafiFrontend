import axios from "axios"
import handleResponseError from "../api/handleResponseError"

const baseURL = process.env.NEXT_PUBLIC_API_URL || ""

const adminAxios = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
})

adminAxios.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_access_token")
      if (token) config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

adminAxios.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_access_token")
      localStorage.removeItem("admin_refresh_token")
      localStorage.removeItem("admin_device_token")
      localStorage.removeItem("admin_email")
      window.location.href = "/admin"
    }
    handleResponseError(error)
    throw error
  }
)

export default adminAxios
