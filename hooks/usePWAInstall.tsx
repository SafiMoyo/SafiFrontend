"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true

    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    const ua = navigator.userAgent
    const isIOSDevice = /iphone|ipad|ipod/i.test(ua)
    const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/i.test(ua)

    if (isIOSDevice && isSafari) {
      setIsIOS(true)
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      deferredPrompt.current = null
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const install = useCallback(async (): Promise<"accepted" | "dismissed" | "ios" | "unavailable"> => {
    if (isIOS) return "ios"
    if (!deferredPrompt.current) return "unavailable"

    await deferredPrompt.current.prompt()
    const { outcome } = await deferredPrompt.current.userChoice
    deferredPrompt.current = null

    if (outcome === "accepted") setIsInstallable(false)
    return outcome
  }, [isIOS])

  return { isInstallable, isIOS, isInstalled, install }
}
