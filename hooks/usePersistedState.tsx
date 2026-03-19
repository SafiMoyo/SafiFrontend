"use client"
import { useEffect, useState } from "react"

type Props<T> = {
  key: string
  defaultValue: T
}

function usePersistedState<T>({
  key,
  defaultValue,
}: Props<T>): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue
    const storedState = localStorage.getItem(key)
    if (storedState !== null) {
      try {
        return JSON.parse(storedState) as T
      } catch (e) {
        console.error("Failed to parse localStorage item", e)
      }
    }
    return defaultValue
  })
  const [isHydrated, setIsHydrated] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      if (state !== undefined && state !== null) {
        localStorage.setItem(key, JSON.stringify(state))
      } else {
        localStorage.removeItem(key)
      }
    }
  }, [key, state, isHydrated])

  return [state, setState]
}

export default usePersistedState
