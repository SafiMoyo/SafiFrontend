"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { useAuthContext } from "@/context"
import { useQueryMe } from "@/services/auth/queries"
import { parseAuthPayload, persistAuthSession } from "@/services/auth/session"
import { createApiRequest } from "@/services/api/createRequest"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { AddProfileModal } from "@/components/modals/add-profile-modal"
import { FamilyProfile } from "@/types/user"
import { cn } from "@/lib/utils"

const MAX_FAMILY_MEMBERS = 2

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
]

function Initials({ name, colorClass }: { name: string; colorClass: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-2xl text-3xl font-bold text-white",
        colorClass
      )}
    >
      {initials || "?"}
    </div>
  )
}

function ProfileCard({
  name,
  picture,
  colorClass,
  active,
  loading,
  onClick,
}: {
  name: string
  picture?: string | null
  colorClass: string
  active?: boolean
  loading?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "group flex flex-col items-center gap-3 rounded-2xl p-3 transition-transform focus:outline-none",
        "hover:scale-105 active:scale-95",
        loading && "pointer-events-none opacity-70"
      )}
    >
      <div
        className={cn(
          "relative h-24 w-24 overflow-hidden rounded-2xl shadow-md ring-4 transition-all",
          active
            ? "ring-primary"
            : "ring-transparent group-hover:ring-primary/40"
        )}
      >
        {picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={picture} alt={name} className="h-full w-full object-cover" />
        ) : (
          <Initials name={name} colorClass={colorClass} />
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>
      <span className="max-w-[96px] truncate text-sm font-semibold text-gray-800">
        {name}
      </span>
    </button>
  )
}

function AddProfileCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center gap-3 rounded-2xl p-3 transition-transform focus:outline-none",
        "hover:scale-105 active:scale-95"
      )}
    >
      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-gray-100 shadow-sm ring-4 ring-transparent transition-all group-hover:ring-primary/30">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-gray-600 transition-colors group-hover:bg-primary/20 group-hover:text-primary">
          <Plus size={20} strokeWidth={2.5} />
        </div>
      </div>
      <span className="text-xs font-medium text-gray-500">Add Profile</span>
    </button>
  )
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SelectProfileModal({ open, onOpenChange }: Props) {
  const router = useRouter()
  const { activeUser, setLoggedIn } = useAuthContext()
  const [addOpen, setAddOpen] = useState(false)
  const [switchingId, setSwitchingId] = useState<number | null>(null)

  const { data, refetch } = useQueryMe({ enabled: open })
  const profile = data?.data
  const familyProfiles: FamilyProfile[] = profile?.family_profiles ?? []
  const emptySlots = Math.max(0, MAX_FAMILY_MEMBERS - familyProfiles.length)

  const parentName =
    [
      activeUser?.first_name ?? profile?.first_name ?? "",
      activeUser?.last_name ?? profile?.last_name ?? "",
    ]
      .join(" ")
      .trim() || "Me"

  const parentPicture =
    activeUser?.profile_picture || profile?.profile_picture || null

  function handleSelectParent() {
    onOpenChange(false)
    router.push("/dashboard")
  }

  async function handleSelectChild(child: FamilyProfile) {
    setSwitchingId(child.id)
    try {
      const response = await createApiRequest({
        url: `/auth/switch-profile/${child.id}`,
        method: "POST",
      })
      persistAuthSession(parseAuthPayload(response))
      setLoggedIn(true)
      onOpenChange(false)
      router.push("/dashboard")
    } catch {
      setSwitchingId(null)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton
          className="w-full max-w-lg gap-0 overflow-hidden bg-white p-8 text-center"
        >
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/logo.svg"
              alt="Safi"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          <DialogTitle className="mb-1 text-2xl font-extrabold text-gray-900">
            Who&apos;s learning?
          </DialogTitle>
          <p className="mb-8 text-sm font-medium text-gray-500">
            Select your profile to continue
          </p>

          <div className="flex flex-wrap items-start justify-center gap-4">
            {/* Parent — current account, always first */}
            <ProfileCard
              name={parentName}
              picture={parentPicture}
              colorClass={AVATAR_COLORS[0]}
              active
              onClick={handleSelectParent}
            />

            {/* Existing child profiles */}
            {familyProfiles.map((child, idx) => (
              <ProfileCard
                key={child.id}
                name={`${child.first_name} ${child.last_name}`.trim()}
                picture={child.profile_picture || null}
                colorClass={AVATAR_COLORS[(idx + 1) % AVATAR_COLORS.length]}
                loading={switchingId === child.id}
                onClick={() => handleSelectChild(child)}
              />
            ))}

            {/* Empty add-profile slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <AddProfileCard
                key={`empty-${i}`}
                onClick={() => setAddOpen(true)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <AddProfileModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdded={() => refetch()}
      />
    </>
  )
}
