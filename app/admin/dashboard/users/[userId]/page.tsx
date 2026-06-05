"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, RotateCcw, UserX, UserCheck, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { useAdminUserDetail } from "@/services/admin-auth/queries"
import {
  useAdminResetUserPassword,
  useAdminDeactivateUser,
  useAdminReactivateUser,
  useAdminDeleteUser,
} from "@/services/admin-auth/mutations"

type ModalType = "reset" | "deactivate" | "reactivate" | "delete" | null

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const DELETE_REASONS = [
  "Fraudulent activity",
  "Policy violation",
  "User request",
  "Duplicate account",
  "Abusive behaviour",
  "Other",
]

function ConfirmModal({
  type,
  onConfirm,
  onClose,
  loading,
}: {
  type: "reset" | "deactivate" | "reactivate" | "delete"
  onConfirm: (reason: string) => void
  onClose: () => void
  loading: boolean
}) {
  const [reason, setReason] = useState("")
  const [selectedChip, setSelectedChip] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [attempted, setAttempted] = useState(false)

  const isDelete = type === "delete"
  const needsReason = type === "reset" || type === "deactivate"
  const finalReason = isDelete
    ? selectedChip === "Other" ? reason.trim() : selectedChip
    : reason.trim()

  const canSubmit = isDelete
    ? !!selectedChip && (selectedChip !== "Other" || !!reason.trim()) && confirmText === "DELETE"
    : type === "reactivate" || !!reason.trim()

  const titles = { reset: "Reset Password", deactivate: "Deactivate Account", reactivate: "Reactivate Account", delete: "Delete Account" }
  const descriptions = {
    reset: "A password reset email will be sent to the user. Please provide a reason for this action.",
    deactivate: "This will prevent the user from logging in. All their tokens will be immediately revoked.",
    reactivate: "This will restore the user's access to the platform.",
    delete: "This will permanently archive and purge all student data including tokens, progress, enrollments, badges, and subscriptions. This cannot be undone.",
  }

  function handleSubmit() {
    setAttempted(true)
    if (!canSubmit) return
    onConfirm(finalReason)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X size={18} />
        </button>
        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{titles[type]}</h3>
        <p className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">{descriptions[type]}</p>

        {isDelete && (
          <div className="mt-4">
            <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Reason <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DELETE_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setSelectedChip(r); if (r !== "Other") setReason("") }}
                  className={`rounded-full px-3 py-1 text-xs font-extrabold transition ${
                    selectedChip === r
                      ? "bg-primary text-white"
                      : "border border-gray-200 bg-gray-50 text-gray-600 hover:border-primary hover:text-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {attempted && !selectedChip && (
              <p className="mt-1.5 text-xs font-semibold text-red-500">Please select a reason.</p>
            )}
            {selectedChip === "Other" && (
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the reason…"
                rows={2}
                className="mt-3 w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            )}
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Type <span className="font-black text-gray-900 dark:text-white">DELETE</span> to confirm
              </label>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-red-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
              {attempted && confirmText !== "DELETE" && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">You must type DELETE to confirm.</p>
              )}
            </div>
          </div>
        )}

        {!isDelete && needsReason && (
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={type === "reset" ? "e.g. User requested password reset" : "e.g. Violated community guidelines"}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
            {attempted && !reason.trim() && (
              <p className="mt-1.5 text-xs font-semibold text-red-500">Please enter a reason.</p>
            )}
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-extrabold text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={
              type === "delete"
                ? "flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:opacity-50"
                : "flex-1 rounded-xl bg-primary py-2.5 text-sm font-extrabold text-white transition hover:bg-primary/90 disabled:opacity-50"
            }
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing…
              </span>
            ) : (
              type === "delete" ? "Delete" : type === "deactivate" ? "Deactivate" : type === "reset" ? "Send Reset" : "Reactivate"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = Number(params.userId)

  const [modal, setModal] = useState<ModalType>(null)
  const [isDeactivated, setIsDeactivated] = useState<boolean | null>(null)

  const { data: res, isLoading } = useAdminUserDetail(userId)
  const user = res?.data

  useEffect(() => {
    if (!user) return
    if (user.account_status !== undefined) {
      setIsDeactivated(user.account_status !== "ACTIVE")
    } else if (user.is_active !== undefined) {
      setIsDeactivated(!user.is_active)
    } else if (user.status !== undefined) {
      setIsDeactivated(user.status === "INACTIVE" || user.status === "DEACTIVATED")
    }
  }, [user])

  const { mutate: resetPassword, isPending: resetting } =
    useAdminResetUserPassword()
  const { mutate: deactivate, isPending: deactivating } =
    useAdminDeactivateUser()
  const { mutate: reactivate, isPending: reactivating } =
    useAdminReactivateUser()
  const { mutate: deleteUser, isPending: deleting } = useAdminDeleteUser()

  function handleConfirm(reason: string) {
    if (modal === "reset") {
      resetPassword(
        { userId, reason },
        {
          onSuccess: () => {
            toast.success("Password reset email sent to user")
            setModal(null)
          },
          onError: () => {
            toast.error("Failed to reset password")
          },
        }
      )
    } else if (modal === "deactivate") {
      deactivate(
        { userId, reason },
        {
          onSuccess: () => {
            toast.success("User deactivated successfully")
            setIsDeactivated(true)
            setModal(null)
          },
          onError: () => {
            toast.error("Failed to deactivate user")
          },
        }
      )
    } else if (modal === "reactivate") {
      reactivate(userId, {
        onSuccess: () => {
          toast.success("User reactivated successfully")
          setIsDeactivated(false)
          setModal(null)
        },
        onError: () => {
          toast.error("Failed to reactivate user")
        },
      })
    } else if (modal === "delete") {
      deleteUser(
        { userId, reason },
        {
          onSuccess: () => {
            toast.success("User deleted successfully")
            router.push("/admin/dashboard/users")
          },
          onError: () => {
            toast.error("Failed to delete user")
          },
        }
      )
    }
  }

  const accountStatus = user?.account_status ?? (user?.is_active === false || user?.status === "INACTIVE" || user?.status === "DEACTIVATED" ? "INACTIVE" : "ACTIVE")
  const deactivated = isDeactivated ?? (accountStatus !== "ACTIVE")

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-sm font-semibold text-gray-500">User not found.</p>
        <button
          onClick={() => router.back()}
          className="text-xs font-extrabold text-primary underline"
        >
          Go back
        </button>
      </div>
    )
  }

  const initial = user.first_name?.[0]?.toUpperCase() ?? "?"

  return (
    <>
      {modal && (
        <ConfirmModal
          type={modal}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
          loading={
            modal === "reset" ? resetting :
            modal === "reactivate" ? reactivating :
            modal === "deactivate" ? deactivating :
            deleting
          }
        />
      )}

      <div className="flex flex-col gap-5">
        {/* Back + Export */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/admin/dashboard/users")}
            className="flex items-center gap-2 text-sm font-extrabold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={16} /> Students
          </button>
          <button className="rounded-xl bg-primary px-5 py-2 text-sm font-extrabold text-white shadow-[0_4px_14px_rgba(137,0,235,0.3)] hover:bg-primary/90">
            Export
          </button>
        </div>

        {/* Profile card */}
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_18px_50px_rgba(16,24,40,0.07)] dark:border-gray-700 dark:bg-gray-900 sm:flex-row sm:items-start">
          {user.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.first_name}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-black text-white">
              {initial}
            </div>
          )}
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Email: {user.email}
            </p>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Age Group: {user.age_group}
            </p>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Status:{" "}
              <span
                className={
                  accountStatus === "ACTIVE"
                    ? "font-extrabold text-emerald-600"
                    : accountStatus === "RESTRICTED"
                    ? "font-extrabold text-amber-500"
                    : "font-extrabold text-red-500"
                }
              >
                {accountStatus === "ACTIVE" ? "Active" : accountStatus === "RESTRICTED" ? "Restricted" : accountStatus ?? "Inactive"}
              </span>
            </p>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Subscription:{" "}
              <span className="font-extrabold text-gray-800 dark:text-gray-200">
                {user.subscription_status}
              </span>
            </p>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Registration Date: {formatDate(user.registered_at)}
            </p>
            {user.last_login_at && (
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Last Login: {formatDateTime(user.last_login_at)}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setModal("reset")}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-extrabold text-white hover:bg-primary/90"
          >
            <RotateCcw size={14} />
            Reset Password
          </button>

          {deactivated ? (
            <button
              onClick={() => setModal("reactivate")}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-extrabold text-white hover:bg-primary/90"
            >
              <UserCheck size={14} />
              Reactivate Account
            </button>
          ) : (
            <button
              onClick={() => setModal("deactivate")}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-extrabold text-white hover:bg-primary/90"
            >
              <UserX size={14} />
              Deactivate Account
            </button>
          )}

          <button
            onClick={() => setModal("delete")}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-red-700"
          >
            <Trash2 size={14} />
            Delete Account
          </button>
        </div>

        {/* Academic + Activity row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Academic & Course Info */}
          <div className="flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_18px_50px_rgba(16,24,40,0.07)] dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-900 dark:text-white">
              Academic &amp; Course Info
            </h3>

            {/* Current Enrollments */}
            <div>
              <p className="mb-3 text-sm font-extrabold text-gray-700 dark:text-gray-300">
                Current Enrollments
              </p>
              {user.current_enrollments.length === 0 ? (
                <p className="text-xs font-semibold text-gray-400">
                  No active enrollments.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {user.current_enrollments.map((e, i) => (
                    <div key={e.module_id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <span className="font-extrabold text-gray-500 dark:text-gray-400">
                            Module {i + 1}:
                          </span>{" "}
                          {e.module_title}
                        </p>
                        <span className="ml-3 shrink-0 text-xs font-extrabold text-gray-600 dark:text-gray-300">
                          Progress: {e.progress_percentage}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-[#bb2efa] transition-all"
                          style={{ width: `${Math.max(e.progress_percentage, e.progress_percentage > 0 ? 4 : 0)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Modules */}
            <div>
              <p className="mb-3 text-sm font-extrabold text-gray-700 dark:text-gray-300">
                Completed Modules
              </p>
              {user.completed_modules.length === 0 ? (
                <p className="text-xs font-semibold text-gray-400">
                  No completed modules yet.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {user.completed_modules.map((m) => (
                    <div
                      key={m.module_id}
                      className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 dark:bg-emerald-900/20"
                    >
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {m.module_title}
                      </p>
                      <span className="text-xs font-extrabold text-emerald-600">
                        100%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Log */}
          <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_18px_50px_rgba(16,24,40,0.07)] dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-900 dark:text-white">
              Activity Log
            </h3>
            <div>
              <p className="mb-3 text-sm font-extrabold text-gray-700 dark:text-gray-300">
                Recent Activities
              </p>
              {user.activity_log.length === 0 ? (
                <p className="text-xs font-semibold text-gray-400">
                  No activity recorded.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {user.activity_log.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-gray-100 p-3 dark:border-gray-700"
                    >
                      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-gray-700 dark:text-gray-300">
                          {entry.description}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-gray-400">
                          {formatDateTime(entry.timestamp)}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-extrabold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                        {entry.event_type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
