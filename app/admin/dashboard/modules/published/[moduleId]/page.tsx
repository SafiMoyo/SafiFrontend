"use client"

import { use, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, BookOpen, Film, Lock, Unlock, Clock,
  AlertCircle, ListOrdered, Pencil, Trash2, ImageIcon, X, AlertTriangle, Copy, Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  useAdminPublishedModules, useAdminModuleLessons,
  type AdminModule, type AdminLesson, type PublishedModulesResponse,
} from "@/services/admin-auth/queries"
import {
  useAdminEditModule, useAdminEditLesson, useAdminDeleteModule, useAdminDeleteLesson,
} from "@/services/admin-auth/mutations"
import { validateCoverImage, validateLessonVideo } from "@/lib/validate-media"
import { toast } from "sonner"

const SEQ_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1)

const AGE_GROUP_LABEL: Record<string, string> = { EARLY: "Early", MIDDLE: "Middle", ADVANCED: "Advanced" }
const AGE_GROUP_COLOR: Record<string, string> = {
  EARLY: "bg-green-100 text-green-700",
  MIDDLE: "bg-blue-100 text-blue-700",
  ADVANCED: "bg-purple-100 text-purple-700",
}

function findModule(data: PublishedModulesResponse | undefined, moduleId: string): AdminModule | undefined {
  if (!data?.data) return undefined
  if (Array.isArray(data.data)) return (data.data as AdminModule[]).find((m) => m.id === moduleId)
  const grouped = data.data as { early?: AdminModule[]; middle?: AdminModule[]; advanced?: AdminModule[]; unassigned?: AdminModule[] }
  return [...(grouped.early ?? []), ...(grouped.middle ?? []), ...(grouped.advanced ?? []), ...(grouped.unassigned ?? [])].find((m) => m.id === moduleId)
}

// ── Image upload box ─────────────────────────────────────────────────────────

function ImageUploadBox({
  label, previewUrl, onSelect, onRemove, inputRef,
}: {
  label: string; previewUrl: string | null
  onSelect: (f: File) => void; onRemove: () => void; inputRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">{label}</Label>
      <div
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onSelect(f) }}
        onDragOver={(e) => e.preventDefault()}
        className="relative flex min-h-[140px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 hover:border-purple-400 dark:border-purple-800 dark:bg-purple-900/10"
      >
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
            <button type="button" onClick={onRemove} className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"><X size={13} /></button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30"><ImageIcon size={18} className="text-primary" /></div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              <button type="button" className="text-primary underline" onClick={() => inputRef.current?.click()}>Browse</button> or drag & drop
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, HEIC · max 10 MB</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.heic,.heif,image/jpeg,image/png,image/heic" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onSelect(f); e.target.value = "" }} />
      </div>
    </div>
  )
}

// ── Edit Module Modal ────────────────────────────────────────────────────────

type ModuleForm = { module_title: string; module_description: string; no_of_lessons: string; sequence_num: string; module_tier: string; age_group: string }

function EditModuleModal({ mod, open, onClose }: { mod: AdminModule; open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<ModuleForm>({
    module_title: mod.module_title ?? "",
    module_description: (mod as AdminModule & { module_description?: string }).module_description ?? "",
    no_of_lessons: String(mod.no_of_lessons ?? ""),
    sequence_num: String(mod.sequence_num ?? ""),
    module_tier: mod.module_tier ?? "",
    age_group: mod.age_group ?? "",
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(mod.cover_image_url ?? null)
  const coverRef = useRef<HTMLInputElement>(null)
  const editModule = useAdminEditModule()

  const setF = <K extends keyof ModuleForm>(k: K, v: string) => setForm((p) => ({ ...p, [k]: v }))

  function handleCoverSelect(file: File) {
    const r = validateCoverImage(file); if (!r.ok) { toast.error(r.error); return }
    setCoverFile(file); setCoverPreview(URL.createObjectURL(file))
  }
  function handleCoverRemove() {
    if (coverPreview && coverFile) URL.revokeObjectURL(coverPreview)
    setCoverFile(null); setCoverPreview(null)
  }

  function handleSave() {
    editModule.mutate({
      moduleId: mod.id,
      module_title: form.module_title.trim(),
      module_description: form.module_description.trim() || undefined,
      no_of_lessons: Number(form.no_of_lessons),
      sequence_num: Number(form.sequence_num),
      module_tier: form.module_tier || undefined,
      age_group: form.age_group || undefined,
      module_cover_image: coverFile ?? undefined,
    }, {
      onSuccess: () => { toast.success("Module updated!"); onClose() },
    })
  }

  const valid = form.module_title.trim() !== "" && form.no_of_lessons !== "" && form.sequence_num !== ""

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-xl bg-white p-6 dark:bg-gray-900" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-base font-black text-gray-900 dark:text-white">Edit Module</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[65vh] overflow-y-auto space-y-4 pr-1">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Module Title <span className="text-red-500">*</span></Label>
            <Input variant="auth" value={form.module_title} onChange={(e) => setF("module_title", e.target.value)} placeholder="Module title" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Description</Label>
            <textarea value={form.module_description} onChange={(e) => setF("module_description", e.target.value)} rows={3}
              className="w-full resize-none rounded-xl border border-purple-200 bg-purple-50 px-3 py-3 text-sm text-gray-900 placeholder:text-purple-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-purple-500 dark:focus:ring-gray-700" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">No. of Lessons <span className="text-red-500">*</span></Label>
              <Select value={form.no_of_lessons} onValueChange={(v) => setF("no_of_lessons", v)}>
                <SelectTrigger variant="auth" className="h-12!"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent position="popper">{SEQ_OPTIONS.map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Sequence No. <span className="text-red-500">*</span></Label>
              <Select value={form.sequence_num} onValueChange={(v) => setF("sequence_num", v)}>
                <SelectTrigger variant="auth" className="h-12!"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent position="popper">{SEQ_OPTIONS.map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Module Tier</Label>
              <Select value={form.module_tier} onValueChange={(v) => setF("module_tier", v)}>
                <SelectTrigger variant="auth" className="h-12!"><SelectValue placeholder="Select tier" /></SelectTrigger>
                <SelectContent position="popper"><SelectItem value="FREE">Free</SelectItem><SelectItem value="PAID">Paid</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Age Group</Label>
              <Select value={form.age_group} onValueChange={(v) => setF("age_group", v)}>
                <SelectTrigger variant="auth" className="h-12!"><SelectValue placeholder="Select age group" /></SelectTrigger>
                <SelectContent position="popper"><SelectItem value="EARLY">Early</SelectItem><SelectItem value="MIDDLE">Middle</SelectItem><SelectItem value="ADVANCED">Advanced</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <ImageUploadBox label="Cover Image" previewUrl={coverPreview} onSelect={handleCoverSelect} onRemove={handleCoverRemove} inputRef={coverRef} />
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" className="rounded-full" onClick={onClose}>Cancel</Button>
          <Button type="button" className="rounded-full px-6 font-bold" disabled={!valid} loading={editModule.isPending} onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Edit Lesson Modal ────────────────────────────────────────────────────────

type LessonForm = { lesson_title: string; lesson_duration: string; lesson_description: string; serial_number: string }

function EditLessonModal({ lesson, moduleId, open, onClose }: { lesson: AdminLesson; moduleId: string; open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<LessonForm>({
    lesson_title: lesson.lesson_title ?? "",
    lesson_duration: lesson.lesson_duration ?? "",
    lesson_description: lesson.lesson_description ?? "",
    serial_number: String(lesson.serial_number ?? ""),
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(lesson.cover_image_url ?? null)
  const videoRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)
  const editLesson = useAdminEditLesson()

  const setF = <K extends keyof LessonForm>(k: K, v: string) => setForm((p) => ({ ...p, [k]: v }))

  function handleCoverSelect(file: File) {
    const r = validateCoverImage(file); if (!r.ok) { toast.error(r.error); return }
    setCoverFile(file); setCoverPreview(URL.createObjectURL(file))
  }
  function handleCoverRemove() {
    if (coverPreview && coverFile) URL.revokeObjectURL(coverPreview)
    setCoverFile(null); setCoverPreview(null)
  }
  function handleVideoSelect(file: File) {
    const r = validateLessonVideo(file); if (!r.ok) { toast.error(r.error); return }
    setVideoFile(file)
  }

  function handleSave() {
    editLesson.mutate({
      lessonId: lesson.id,
      lesson_title: form.lesson_title.trim(),
      lesson_duration: form.lesson_duration.trim(),
      lesson_description: form.lesson_description.trim(),
      module_id: moduleId,
      serial_number: Number(form.serial_number),
      file: videoFile ?? undefined,
      lesson_cover_image: coverFile ?? undefined,
    }, {
      onSuccess: () => { toast.success("Lesson updated!"); onClose() },
    })
  }

  const valid = form.lesson_title.trim() !== "" && form.lesson_duration.trim() !== "" && form.lesson_description.trim() !== "" && form.serial_number !== ""

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-xl bg-white p-6 dark:bg-gray-900" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-base font-black text-gray-900 dark:text-white">Edit Lesson</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[65vh] overflow-y-auto space-y-4 pr-1">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Lesson Title <span className="text-red-500">*</span></Label>
            <Input variant="auth" value={form.lesson_title} onChange={(e) => setF("lesson_title", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Duration <span className="text-red-500">*</span></Label>
              <Input variant="auth" value={form.lesson_duration} onChange={(e) => setF("lesson_duration", e.target.value)} placeholder="e.g. 5:30" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Serial Number <span className="text-red-500">*</span></Label>
              <Select value={form.serial_number} onValueChange={(v) => setF("serial_number", v)}>
                <SelectTrigger variant="auth" className="h-12!"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent position="popper">{SEQ_OPTIONS.map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Description <span className="text-red-500">*</span></Label>
            <textarea value={form.lesson_description} onChange={(e) => setF("lesson_description", e.target.value)} rows={3}
              className="w-full resize-none rounded-xl border border-purple-200 bg-purple-50 px-3 py-3 text-sm text-gray-900 placeholder:text-purple-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-purple-500 dark:focus:ring-gray-700" />
          </div>
          {/* Video upload */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Replace Video <span className="text-xs font-normal text-gray-400">(optional)</span></Label>
            <div className="flex items-center gap-3 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-800">
              {videoFile ? (
                <>
                  <Film size={15} className="shrink-0 text-primary" />
                  <span className="flex-1 truncate text-sm font-semibold text-gray-700 dark:text-gray-200">{videoFile.name}</span>
                  <button type="button" onClick={() => setVideoFile(null)} className="shrink-0 text-gray-400 hover:text-red-500"><X size={14} /></button>
                </>
              ) : (
                <>
                  <Film size={15} className="shrink-0 text-purple-300 dark:text-gray-500" />
                  <button type="button" className="text-sm text-primary underline underline-offset-2" onClick={() => videoRef.current?.click()}>Choose video file</button>
                </>
              )}
              <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideoSelect(f); e.target.value = "" }} />
            </div>
          </div>
          <ImageUploadBox label="Replace Cover Image (optional)" previewUrl={coverPreview} onSelect={handleCoverSelect} onRemove={handleCoverRemove} inputRef={coverRef} />
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" className="rounded-full" onClick={onClose}>Cancel</Button>
          <Button type="button" className="rounded-full px-6 font-bold" disabled={!valid} loading={editLesson.isPending} onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Lesson card ──────────────────────────────────────────────────────────────

function LessonCard({ lesson, moduleId }: { lesson: AdminLesson; index: number; moduleId: string }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const deleteLesson = useAdminDeleteLesson()

  function handleDeleteLesson() {
    deleteLesson.mutate({ lessonId: lesson.id, moduleId }, {
      onSuccess: () => { toast.success("Lesson deleted."); setDeleteOpen(false) },
    })
  }

  return (
    <>
      <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-sm font-black text-primary">{lesson.serial_number}</span>
        </div>
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-purple-400 to-pink-400">
          {lesson.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lesson.cover_image_url} alt={lesson.lesson_title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center"><Film size={18} className="text-white/70" /></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-extrabold text-gray-900 dark:text-white">{lesson.lesson_title}</p>
          {lesson.lesson_description && <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">{lesson.lesson_description}</p>}
          <div className="mt-1.5 flex items-center gap-3">
            {lesson.lesson_duration && (
              <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} />{lesson.lesson_duration}</span>
            )}
            {lesson.publish_status && (
              <span className={`text-xs font-semibold ${lesson.publish_status === "PUBLISHED" ? "text-green-600" : "text-amber-600"}`}>
                {lesson.publish_status === "PUBLISHED" ? "Published" : "Draft"}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {lesson.video_url && (
            <a href={lesson.video_url} target="_blank" rel="noopener noreferrer"
              className="flex size-8 items-center justify-center rounded-full bg-purple-50 text-primary hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40" title="View video">
              <Film size={15} />
            </a>
          )}
          <button onClick={() => setEditOpen(true)}
            className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-purple-50 hover:text-primary dark:hover:bg-purple-900/20" title="Edit lesson">
            <Pencil size={15} />
          </button>
          <button onClick={() => setDeleteOpen(true)}
            className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20" title="Delete lesson">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {editOpen && (
        <EditLessonModal lesson={lesson} moduleId={moduleId} open={editOpen} onClose={() => setEditOpen(false)} />
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm bg-white p-6 dark:bg-gray-900" showCloseButton={false}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle size={26} className="text-red-500" />
            </div>
            <h3 className="text-base font-black text-gray-900 dark:text-white">Are you sure you want to delete?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-bold text-gray-800 dark:text-gray-200">{lesson.lesson_title}</span> will be permanently removed. This cannot be undone.
            </p>
          </div>
          <div className="mt-5 space-y-3">
            <Button type="button" variant="destructive" className="h-12 w-full rounded-full font-bold"
              loading={deleteLesson.isPending} onClick={handleDeleteLesson}>
              Delete Lesson
            </Button>
            <Button type="button" variant="ghost" className="h-12 w-full rounded-full font-bold text-gray-500 dark:text-gray-400"
              disabled={deleteLesson.isPending} onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ModuleDetailPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = use(params)
  const router = useRouter()

  const { data: modulesData, isLoading: modulesLoading } = useAdminPublishedModules()
  const { data: lessonsData, isLoading: lessonsLoading, isError: lessonsError } = useAdminModuleLessons(moduleId)
  const deleteModule = useAdminDeleteModule()

  const [editModuleOpen, setEditModuleOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [copiedId, setCopiedId] = useState(false)

  function handleCopyModuleId() {
    navigator.clipboard.writeText(moduleId).then(() => {
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    })
  }

  const mod = findModule(modulesData, moduleId)
  const lessons = lessonsData?.data ?? []
  const isLoading = modulesLoading || lessonsLoading

  const ageLabel = mod?.age_group ? AGE_GROUP_LABEL[mod.age_group] : null
  const ageColor = mod?.age_group ? AGE_GROUP_COLOR[mod.age_group] ?? "bg-gray-100 text-gray-600" : ""

  function handleDeleteModule() {
    deleteModule.mutate(moduleId, {
      onSuccess: () => {
        toast.success("Module deleted.")
        router.push("/admin/dashboard/modules/published")
      },
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back */}
      <Link href="/admin/dashboard/modules/published"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white">
        <ArrowLeft size={16} /> Back to Published Modules
      </Link>

      {/* Module header card */}
      {(mod || modulesLoading) && (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
          <div className="relative h-[200px] bg-gradient-to-br from-purple-500 to-pink-500">
            {mod?.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mod.cover_image_url} alt={mod.module_title} className="h-full w-full object-cover" />
            )}
            {modulesLoading && <div className="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-700" />}
          </div>

          <div className="p-6">
            {modulesLoading ? (
              <div className="space-y-2">
                <div className="h-6 w-1/2 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-3/4 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
              </div>
            ) : mod ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h1 className="text-xl font-black text-gray-900 dark:text-white">{mod.module_title}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {ageLabel && <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ageColor}`}>{ageLabel}</span>}
                    {mod.module_tier && (
                      <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${mod.module_tier === "FREE" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {mod.module_tier === "FREE" ? <Unlock size={11} /> : <Lock size={11} />}
                        {mod.module_tier === "FREE" ? "Free" : "Paid"}
                      </span>
                    )}
                    {/* Edit & Delete */}
                    <button onClick={() => setEditModuleOpen(true)}
                      className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary dark:hover:text-primary">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => setDeleteConfirmOpen(true)}
                      className="flex items-center gap-1.5 rounded-full border border-red-100 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
                {mod.module_description && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{mod.module_description}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><ListOrdered size={13} /> Sequence {mod.sequence_num}</span>
                  <span className="flex items-center gap-1"><BookOpen size={13} /> {mod.no_of_lessons} {mod.no_of_lessons === 1 ? "lesson" : "lessons"}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-gray-400">Module ID:</span>
                    <span className="font-mono text-gray-600 dark:text-gray-300">{moduleId}</span>
                    <button
                      onClick={handleCopyModuleId}
                      title="Copy Module ID"
                      className="flex items-center justify-center rounded-md p-0.5 text-gray-400 hover:bg-purple-50 hover:text-primary dark:hover:bg-purple-900/20"
                    >
                      {copiedId ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    </button>
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Module not found.</p>
            )}
          </div>
        </div>
      )}

      {/* Lessons */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-black text-gray-900 dark:text-white">
            Lessons {!isLoading && <span className="ml-2 text-sm font-semibold text-gray-400">({lessons.length})</span>}
          </h2>
          <Link href="/admin/dashboard/create-course"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90">
            + Add Lesson
          </Link>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[80px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
          </div>
        )}

        {lessonsError && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle size={18} /> Failed to load lessons. Please refresh.
          </div>
        )}

        {!isLoading && !lessonsError && lessons.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/30"><Film size={24} className="text-primary" /></div>
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">No lessons yet</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Add lessons from the Create Course page.</p>
            </div>
            <Link href="/admin/dashboard/create-course" className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90">Add Lesson</Link>
          </div>
        )}

        {!isLoading && !lessonsError && lessons.length > 0 && (
          <div className="space-y-3">
            {lessons.map((lesson, i) => (
              <LessonCard key={lesson.id} lesson={lesson} index={i} moduleId={moduleId} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Module Modal */}
      {mod && editModuleOpen && (
        <EditModuleModal mod={mod} open={editModuleOpen} onClose={() => setEditModuleOpen(false)} />
      )}

      {/* Delete Module Confirm */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm bg-white p-6 dark:bg-gray-900" showCloseButton={false}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle size={26} className="text-red-500" />
            </div>
            <h3 className="text-base font-black text-gray-900 dark:text-white">Delete this module?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-bold text-gray-800 dark:text-gray-200">{mod?.module_title}</span> and all its lessons will be permanently removed. This cannot be undone.
            </p>
          </div>
          <div className="mt-5 space-y-3">
            <Button type="button" variant="destructive" className="h-12 w-full rounded-full font-bold"
              loading={deleteModule.isPending} onClick={handleDeleteModule}>
              Delete Module
            </Button>
            <Button type="button" variant="ghost" className="h-12 w-full rounded-full font-bold text-gray-500 dark:text-gray-400"
              disabled={deleteModule.isPending} onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
