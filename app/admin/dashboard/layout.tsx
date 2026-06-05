"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Handshake,
  ClipboardList,
  MessageSquare,
  BookOpen,
  CheckCircle,
  FileStack,
  CreditCard,
  LogOut,
  X,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"
import { DarkModeToggle } from "@/components/admin/dark-mode-toggle"

const NAV_ITEMS = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/admin/dashboard/transactions", icon: ArrowLeftRight },
  { label: "Users", href: "/admin/dashboard/users", icon: Users },
  { label: "Partners", href: "/admin/dashboard/partners", icon: Handshake },
  { label: "Audit Logs", href: "/admin/dashboard/audit-logs", icon: ClipboardList },
  { label: "Enquiries", href: "/admin/dashboard/enquiries", icon: MessageSquare },
  { label: "Create Course", href: "/admin/dashboard/create-course", icon: BookOpen },
  { label: "Published Modules", href: "/admin/dashboard/modules/published", icon: CheckCircle },
  { label: "Unpublished Modules", href: "/admin/dashboard/modules/unpublished", icon: FileStack },
  { label: "Subscriptions", href: "/admin/dashboard/subscriptions", icon: CreditCard },
]

function isActive(href: string, pathname: string) {
  if (href === "/admin/dashboard") return pathname === href
  return pathname.startsWith(href)
}

function clearAdminSession() {
  localStorage.removeItem("admin_access_token")
  localStorage.removeItem("admin_refresh_token")
  localStorage.removeItem("admin_device_token")
  localStorage.removeItem("admin_email")
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    clearAdminSession()
    onClose?.()
    router.push("/admin")
  }

  return (
    <div className="flex h-full flex-col gap-7 p-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <Image
            src="/images/logo.svg"
            alt="Safi"
            width={80}
            height={28}
            className="h-7 w-auto"
          />
        </Link>
        <div className="flex items-center gap-1.5">
          <DarkModeToggle />
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 md:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Admin Dashboard
      </div>

      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href, pathname)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-extrabold transition-colors",
                active
                  ? "bg-primary text-white shadow-[0_10px_24px_rgba(137,0,235,0.18)]"
                  : "text-[#475467] hover:bg-purple-50 hover:text-primary dark:text-gray-400 dark:hover:bg-purple-900/30 dark:hover:text-purple-300"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon size={17} />
                {label}
              </span>
              <span className="text-base leading-none">›</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const token = localStorage.getItem("admin_access_token")
    if (!token) {
      router.push("/admin")
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) return null

  const bgGradient =
    theme === "dark"
      ? "radial-gradient(circle at top left, rgba(137,0,235,0.15), transparent 34%), #0f172a"
      : "radial-gradient(circle at top left, rgba(137,0,235,0.09), transparent 34%), #f3f4f6"

  return (
    <div
      className="min-h-screen transition-colors"
      style={{ background: bgGradient }}
    >
      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 hidden h-full w-[260px] border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:block">
        <Sidebar />
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/90 md:hidden">
        <Link href="/admin/dashboard">
          <Image
            src="/images/logo.svg"
            alt="Safi"
            width={72}
            height={26}
            className="h-6 w-auto"
          />
        </Link>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border border-gray-200 p-2 text-gray-600 dark:border-gray-700 dark:text-gray-300"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22 }}
              className="fixed top-0 left-0 z-50 h-full w-[80vw] max-w-[300px] bg-white dark:bg-gray-900 md:hidden"
            >
              <Sidebar onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="min-h-screen md:pl-[260px]">
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  )
}
