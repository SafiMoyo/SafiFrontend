import { useContext } from "react"
import { AuthContext } from "./auth"

export const useAuthContext = () => useContext(AuthContext)
