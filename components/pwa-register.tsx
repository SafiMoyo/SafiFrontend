"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Download, Share, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { usePWAInstall } from "@/hooks/usePWAInstall"

const DISMISSED_KEY = "pwa-fab-dismissed"

export function PWARegister() {
  const { isInstallable, isIOS, isInstalled, install } = usePWAInstall()
  const [visible, setVisible] = useState(false)
  const [showIOSDialog, setShowIOSDialog] = useState(false)

  // Register service worker
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {})
  }, [])

  // Show FAB 3 s after mount, unless dismissed this session
  useEffect(() => {
    if (isInstalled) return
    if (!isInstallable && !isIOS) return
    if (sessionStorage.getItem(DISMISSED_KEY) === "true") return

    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [isInstallable, isIOS, isInstalled])

  const handleInstall = async () => {
    const result = await install()
    if (result === "ios") {
      setShowIOSDialog(true)
    } else if (result === "accepted") {
      setVisible(false)
    }
  }

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem(DISMISSED_KEY, "true")
  }

  return (
    <>
      <AnimatePresence>
        {visible && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-1.5"
          >
            {/* Dismiss X */}
            <button
              onClick={handleDismiss}
              aria-label="Dismiss install prompt"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow ring-1 ring-gray-200 hover:bg-gray-50 transition-colors"
            >
              <X size={10} strokeWidth={2.5} />
            </button>

            {/* Install FAB */}
            <button
              onClick={handleInstall}
              aria-label="Install Safi app"
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg ring-2 ring-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
            >
              <Download size={16} strokeWidth={2.5} />
              Install App
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS "Add to Home Screen" instructions */}
      <Dialog open={showIOSDialog} onOpenChange={setShowIOSDialog}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Install Safi on iOS</DialogTitle>
            <DialogDescription>
              Add Safi to your home screen for the full app experience.
            </DialogDescription>
          </DialogHeader>

          <ol className="space-y-3 text-xs text-gray-700">
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                1
              </span>
              <span>
                Tap the{" "}
                <Share size={12} className="inline align-text-bottom mx-0.5" />
                <strong>Share</strong> button at the bottom of Safari
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                2
              </span>
              <span>
                Scroll down and tap <strong>"Add to Home Screen"</strong>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                3
              </span>
              <span>
                Tap <strong>"Add"</strong> in the top-right corner
              </span>
            </li>
          </ol>

          <Button
            className="w-full"
            onClick={() => {
              setShowIOSDialog(false)
              handleDismiss()
            }}
          >
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
