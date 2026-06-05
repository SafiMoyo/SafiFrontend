"use client"

import { useState } from "react"
import { Plus, Check, Pencil, Trash2, X, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useAdminSubscriptionPlans,
  type SubscriptionPlan,
} from "@/services/admin-auth/queries"
import {
  useAdminCreateSubscriptionPlan,
  useAdminUpdateSubscriptionPlan,
  useAdminDeleteSubscriptionPlan,
  type SubscriptionPlanPayload,
} from "@/services/admin-auth/mutations"
import { toast } from "sonner"

const DURATION_OPTIONS = ["MONTHLY", "QUARTERLY", "YEARLY"]
const PLAN_TYPE_OPTIONS = ["INDIVIDUAL", "FAMILY"]
const MAX_BENEFITS = 10

const DURATION_COLOR: Record<string, string> = {
  MONTHLY: "bg-blue-100 text-blue-700",
  QUARTERLY: "bg-purple-100 text-purple-700",
  YEARLY: "bg-emerald-100 text-emerald-700",
}
const TYPE_COLOR: Record<string, string> = {
  INDIVIDUAL: "bg-amber-100 text-amber-700",
  FAMILY: "bg-pink-100 text-pink-700",
}

function formatMoney(val: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(val)
}

// ── Benefit input list ──────────────────────────────────────────────────────

function BenefitInputs({
  benefits,
  onChange,
}: {
  benefits: string[]
  onChange: (b: string[]) => void
}) {
  function update(i: number, val: string) {
    const next = [...benefits]
    next[i] = val
    onChange(next)
  }
  function add() {
    if (benefits.length < MAX_BENEFITS) onChange([...benefits, ""])
  }
  function remove(i: number) {
    onChange(benefits.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-2">
      {benefits.map((b, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
            {i + 1}
          </span>
          <Input
            variant="auth"
            placeholder={`Benefit ${i + 1}`}
            value={b}
            onChange={(e) => update(i, e.target.value)}
            className="flex-1"
          />
          {benefits.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
      {benefits.length < MAX_BENEFITS && (
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <Plus size={13} /> Add benefit
        </button>
      )}
    </div>
  )
}

// ── Plan form (shared for create & edit) ────────────────────────────────────

type PlanForm = {
  amount: string
  duration: string
  discount: string
  plan_type: string
  benefits: string[]
}

const EMPTY_FORM: PlanForm = {
  amount: "",
  duration: "MONTHLY",
  discount: "0",
  plan_type: "INDIVIDUAL",
  benefits: [""],
}

function planToForm(plan: SubscriptionPlan): PlanForm {
  return {
    amount: String(plan.amount),
    duration: plan.duration,
    discount: String(plan.discount),
    plan_type: plan.plan_type,
    benefits: plan.subscription_benefits.map((b) => b.benefit),
  }
}

function formToPayload(form: PlanForm): SubscriptionPlanPayload {
  return {
    amount: parseFloat(form.amount) || 0,
    duration: form.duration,
    discount: parseFloat(form.discount) || 0,
    plan_type: form.plan_type,
    subscription_benefits: form.benefits.filter((b) => b.trim() !== ""),
  }
}

function PlanFormFields({ form, onChange }: { form: PlanForm; onChange: (f: PlanForm) => void }) {
  const set = <K extends keyof PlanForm>(k: K, v: PlanForm[K]) => onChange({ ...form, [k]: v })

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Amount (₦) <span className="text-red-500">*</span></Label>
          <Input variant="auth" type="number" min="0" placeholder="e.g. 10000" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Discount (₦)</Label>
          <Input variant="auth" type="number" min="0" placeholder="0" value={form.discount} onChange={(e) => set("discount", e.target.value)} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Duration <span className="text-red-500">*</span></Label>
          <Select value={form.duration} onValueChange={(v) => set("duration", v)}>
            <SelectTrigger variant="auth" className="h-12!"><SelectValue /></SelectTrigger>
            <SelectContent position="popper">
              {DURATION_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d[0] + d.slice(1).toLowerCase()}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Plan Type <span className="text-red-500">*</span></Label>
          <Select value={form.plan_type} onValueChange={(v) => set("plan_type", v)}>
            <SelectTrigger variant="auth" className="h-12!"><SelectValue /></SelectTrigger>
            <SelectContent position="popper">
              {PLAN_TYPE_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t[0] + t.slice(1).toLowerCase()}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Benefits <span className="text-xs font-normal text-gray-400">(up to {MAX_BENEFITS})</span></Label>
        <BenefitInputs benefits={form.benefits} onChange={(b) => set("benefits", b)} />
      </div>
    </div>
  )
}

// ── Plan card ───────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  onEdit,
  onDelete,
}: {
  plan: SubscriptionPlan
  onEdit: (plan: SubscriptionPlan) => void
  onDelete: (plan: SubscriptionPlan) => void
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${TYPE_COLOR[plan.plan_type] ?? "bg-gray-100 text-gray-600"}`}>
              {plan.plan_type[0] + plan.plan_type.slice(1).toLowerCase()}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${DURATION_COLOR[plan.duration] ?? "bg-gray-100 text-gray-600"}`}>
              {plan.duration[0] + plan.duration.slice(1).toLowerCase()}
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{formatMoney(plan.amount)}</p>
          {plan.discount > 0 && (
            <p className="mt-0.5 text-xs font-semibold text-emerald-600">
              {formatMoney(plan.discount)} discount applied
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onEdit(plan)}
            className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-purple-50 hover:text-primary dark:hover:bg-purple-900/30"
            title="Edit plan"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(plan)}
            className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
            title="Delete plan"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Benefits */}
      <div className="flex flex-1 flex-col gap-2 border-t border-gray-100 px-5 py-4 dark:border-gray-700">
        {plan.subscription_benefits.map((b) => (
          <div key={b.id} className="flex items-start gap-2">
            <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Check size={10} className="text-primary" />
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{b.benefit}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function SubscriptionsPage() {
  const { data, isLoading } = useAdminSubscriptionPlans()
  const plans = data?.data ?? []

  const createPlan = useAdminCreateSubscriptionPlan()
  const updatePlan = useAdminUpdateSubscriptionPlan()
  const deletePlan = useAdminDeleteSubscriptionPlan()

  // Create
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<PlanForm>(EMPTY_FORM)

  // Edit
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null)
  const [editForm, setEditForm] = useState<PlanForm>(EMPTY_FORM)
  const [editConfirmOpen, setEditConfirmOpen] = useState(false)

  // Delete
  const [deletingPlan, setDeletingPlan] = useState<SubscriptionPlan | null>(null)

  function handleCreateSubmit() {
    const payload = formToPayload(createForm)
    if (!payload.amount || payload.subscription_benefits.length === 0) return
    createPlan.mutate(payload, {
      onSuccess: () => {
        toast.success("Subscription plan created!")
        setCreateOpen(false)
        setCreateForm(EMPTY_FORM)
      },
    })
  }

  function openEdit(plan: SubscriptionPlan) {
    setEditPlan(plan)
    setEditForm(planToForm(plan))
  }

  function handleEditConfirm() {
    if (!editPlan) return
    const payload = formToPayload(editForm)
    updatePlan.mutate(
      { planId: editPlan.id, ...payload },
      {
        onSuccess: () => {
          toast.success("Plan updated successfully!")
          setEditConfirmOpen(false)
          setEditPlan(null)
        },
      }
    )
  }

  function handleDeleteConfirm() {
    if (!deletingPlan) return
    deletePlan.mutate(deletingPlan.id, {
      onSuccess: () => {
        toast.success("Plan deleted.")
        setDeletingPlan(null)
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? "Loading..." : `${plans.length} plan${plans.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          type="button"
          className="h-10 rounded-full px-5 text-sm font-bold shadow-[0_6px_20px_rgba(137,0,235,0.25)]"
          onClick={() => { setCreateForm(EMPTY_FORM); setCreateOpen(true) }}
        >
          <Plus size={16} /> New Plan
        </Button>
      </div>

      {/* Plans grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[260px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No subscription plans yet</p>
          <p className="text-xs text-gray-400">Create a plan to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={openEdit}
              onDelete={setDeletingPlan}
            />
          ))}
        </div>
      )}

      {/* ── CREATE MODAL ─────────────────────────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg bg-white p-6 dark:bg-gray-900 sm:max-w-xl" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-base font-black text-gray-900 dark:text-white">Create Subscription Plan</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
            <PlanFormFields form={createForm} onChange={setCreateForm} />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="outline" className="rounded-full" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              type="button"
              className="rounded-full px-6 font-bold"
              loading={createPlan.isPending}
              disabled={!createForm.amount || formToPayload(createForm).subscription_benefits.length === 0}
              onClick={handleCreateSubmit}
            >
              Create Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── EDIT PANEL ───────────────────────────────────────────────────── */}
      <Dialog open={!!editPlan && !editConfirmOpen} onOpenChange={(o) => { if (!o) setEditPlan(null) }}>
        <DialogContent className="max-w-lg bg-white p-6 dark:bg-gray-900 sm:max-w-xl" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-base font-black text-gray-900 dark:text-white">Edit Plan</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
            <PlanFormFields form={editForm} onChange={setEditForm} />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="outline" className="rounded-full" onClick={() => setEditPlan(null)}>Cancel</Button>
            <Button
              type="button"
              className="rounded-full px-6 font-bold"
              disabled={!editForm.amount || formToPayload(editForm).subscription_benefits.length === 0}
              onClick={() => setEditConfirmOpen(true)}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── EDIT CONFIRM ─────────────────────────────────────────────────── */}
      <Dialog open={editConfirmOpen} onOpenChange={setEditConfirmOpen}>
        <DialogContent className="max-w-sm bg-white p-6 dark:bg-gray-900" showCloseButton={false}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle size={26} className="text-amber-500" />
            </div>
            <h3 className="text-base font-black text-gray-900 dark:text-white">Save changes?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">This will update the subscription plan immediately.</p>
          </div>
          <div className="mt-5 space-y-3">
            <Button
              type="button"
              className="h-12 w-full rounded-full font-bold"
              loading={updatePlan.isPending}
              onClick={handleEditConfirm}
            >
              Yes, Save
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full rounded-full font-bold text-gray-500"
              disabled={updatePlan.isPending}
              onClick={() => setEditConfirmOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── DELETE CONFIRM ───────────────────────────────────────────────── */}
      <Dialog open={!!deletingPlan} onOpenChange={(o) => { if (!o) setDeletingPlan(null) }}>
        <DialogContent className="max-w-sm bg-white p-6 dark:bg-gray-900" showCloseButton={false}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-base font-black text-gray-900 dark:text-white">Delete this plan?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-bold text-gray-800 dark:text-gray-200">{deletingPlan?.plan_type} — {deletingPlan?.duration}</span> will be permanently removed.
              This cannot be undone.
            </p>
          </div>
          <div className="mt-5 space-y-3">
            <Button
              type="button"
              variant="destructive"
              className="h-12 w-full rounded-full font-bold"
              loading={deletePlan.isPending}
              onClick={handleDeleteConfirm}
            >
              Delete Plan
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full rounded-full font-bold text-gray-500"
              disabled={deletePlan.isPending}
              onClick={() => setDeletingPlan(null)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
