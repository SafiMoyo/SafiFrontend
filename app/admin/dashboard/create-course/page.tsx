"use client"

import { useRef, useState } from "react"
import { Upload, X, Film, ImageIcon, Copy, Check, AlertTriangle } from "lucide-react"
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
  useAdminCreateModule,
  useAdminCreateModuleDraft,
  useAdminCreateLesson,
  useAdminCreateLessonDraft,
} from "@/services/admin-auth/mutations"
import { validateCoverImage, validateLessonVideo } from "@/lib/validate-media"
import { toast } from "sonner"

const SEQ_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1)

const INITIAL_MODULE = {
  module_title: "",
  module_description: "",
  no_of_lessons: "",
  sequence_num: "",
  module_tier: "",
  age_group: "",
}

const INITIAL_LESSON = {
  lesson_title: "",
  lesson_duration: "",
  lesson_description: "",
  module_id: "",
  serial_number: "",
}

function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </Label>
      {children}
    </div>
  )
}

function ImageUploadBox({
  file,
  previewUrl,
  onSelect,
  onRemove,
  label,
  inputRef,
}: {
  file: File | null
  previewUrl: string | null
  onSelect: (f: File) => void
  onRemove: () => void
  label: string
  inputRef: React.RefObject<HTMLInputElement | null>
}) {
  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) onSelect(f)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">{label}</Label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 transition-colors hover:border-purple-400 dark:border-purple-800 dark:bg-purple-900/10"
      >
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="cover preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <ImageIcon size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Drag & drop or{" "}
                <button
                  type="button"
                  className="text-primary underline underline-offset-2"
                  onClick={() => inputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className="mt-1 text-xs text-gray-400">JPG, JPEG, PNG, HEIC · max 10 MB</p>
            </div>
            {file && (
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{file.name}</p>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.heic,.heif,image/jpeg,image/jpg,image/png,image/heic,image/heif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onSelect(f)
            e.target.value = ""
          }}
        />
      </div>
    </div>
  )
}

function VideoUploadBox({
  file,
  onSelect,
  onRemove,
  inputRef,
}: {
  file: File | null
  onSelect: (f: File) => void
  onRemove: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
}) {
  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) onSelect(f)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-bold text-gray-900 dark:text-gray-200">Lesson Video</Label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative flex min-h-[140px] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 transition-colors hover:border-purple-400 dark:border-purple-800 dark:bg-purple-900/10"
      >
        {file ? (
          <div className="flex w-full items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Film size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="ml-3 flex size-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Film size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Drag & drop or{" "}
                <button
                  type="button"
                  className="text-primary underline underline-offset-2"
                  onClick={() => inputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className="mt-1 text-xs text-gray-400">Any video format · no size limit</p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onSelect(f)
            e.target.value = ""
          }}
        />
      </div>
    </div>
  )
}

function ModuleIdBanner({ moduleId }: { moduleId: string }) {
  const [copied, setCopied] = useState(false)

  function copyId() {
    navigator.clipboard.writeText(moduleId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-100">
        <Check size={16} className="text-green-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-green-800">Module created successfully!</p>
        <p className="mt-0.5 text-xs text-green-600">
          Save this Module ID — you&apos;ll need it to add lessons.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <code className="rounded-lg bg-white px-3 py-1.5 text-sm font-mono font-semibold text-gray-800 ring-1 ring-green-200 truncate max-w-[260px]">
            {moduleId}
          </code>
          <button
            type="button"
            onClick={copyId}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 ring-1 ring-green-200 hover:bg-green-50 transition-colors"
          >
            {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CreateCoursePage() {
  // ── Module form state ───────────────────────────────────────────────────────
  const [mod, setMod] = useState(INITIAL_MODULE)
  const [modCoverFile, setModCoverFile] = useState<File | null>(null)
  const [modCoverPreview, setModCoverPreview] = useState<string | null>(null)
  const modCoverRef = useRef<HTMLInputElement>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [createdModuleId, setCreatedModuleId] = useState<string | null>(null)

  // ── Lesson form state ───────────────────────────────────────────────────────
  const [lesson, setLesson] = useState(INITIAL_LESSON)
  const [lessonVideoFile, setLessonVideoFile] = useState<File | null>(null)
  const [lessonCoverFile, setLessonCoverFile] = useState<File | null>(null)
  const [lessonCoverPreview, setLessonCoverPreview] = useState<string | null>(null)
  const lessonVideoRef = useRef<HTMLInputElement>(null)
  const lessonCoverRef = useRef<HTMLInputElement>(null)
  const [lessonConfirmOpen, setLessonConfirmOpen] = useState(false)

  const createModule = useAdminCreateModule()
  const createModuleDraft = useAdminCreateModuleDraft()
  const createLesson = useAdminCreateLesson()
  const createLessonDraft = useAdminCreateLessonDraft()

  // ── Module helpers ──────────────────────────────────────────────────────────
  const setM = <K extends keyof typeof INITIAL_MODULE>(k: K, v: string) =>
    setMod((p) => ({ ...p, [k]: v }))

  function handleModCoverSelect(file: File) {
    const result = validateCoverImage(file)
    if (!result.ok) { toast.error(result.error); return }
    setModCoverFile(file)
    setModCoverPreview(URL.createObjectURL(file))
  }

  function handleModCoverRemove() {
    if (modCoverPreview) URL.revokeObjectURL(modCoverPreview)
    setModCoverFile(null)
    setModCoverPreview(null)
  }

  function clearModuleForm() {
    setMod(INITIAL_MODULE)
    handleModCoverRemove()
  }

  const modValid =
    mod.module_title.trim() !== "" &&
    mod.no_of_lessons !== "" &&
    mod.sequence_num !== ""

  function buildModulePayload() {
    return {
      module_title: mod.module_title.trim(),
      module_description: mod.module_description.trim() || undefined,
      no_of_lessons: Number(mod.no_of_lessons),
      sequence_num: Number(mod.sequence_num),
      module_tier: mod.module_tier || undefined,
      age_group: mod.age_group || undefined,
      module_cover_image: modCoverFile ?? undefined,
    }
  }

  function handleCreateModule() {
    createModule.mutate(buildModulePayload(), {
      onSuccess: (data) => {
        setConfirmOpen(false)
        setCreatedModuleId(data.data.module_id)
        setLesson((p) => ({ ...p, module_id: data.data.module_id }))
        clearModuleForm()
        toast.success(data.message || "Module created successfully!")
      },
      onError: () => setConfirmOpen(false),
    })
  }

  function handleSaveModuleDraft() {
    createModuleDraft.mutate(buildModulePayload(), {
      onSuccess: (data) => {
        setConfirmOpen(false)
        clearModuleForm()
        toast.success(data.message || "Module saved as draft!")
      },
      onError: () => setConfirmOpen(false),
    })
  }

  // ── Lesson helpers ──────────────────────────────────────────────────────────
  const setL = <K extends keyof typeof INITIAL_LESSON>(k: K, v: string) =>
    setLesson((p) => ({ ...p, [k]: v }))

  function handleLessonVideoSelect(file: File) {
    const result = validateLessonVideo(file)
    if (!result.ok) { toast.error(result.error); return }
    setLessonVideoFile(file)
  }

  function handleLessonCoverSelect(file: File) {
    const result = validateCoverImage(file)
    if (!result.ok) { toast.error(result.error); return }
    setLessonCoverFile(file)
    setLessonCoverPreview(URL.createObjectURL(file))
  }

  function handleLessonCoverRemove() {
    if (lessonCoverPreview) URL.revokeObjectURL(lessonCoverPreview)
    setLessonCoverFile(null)
    setLessonCoverPreview(null)
  }

  const lessonValid =
    lesson.lesson_title.trim() !== "" &&
    lesson.lesson_duration.trim() !== "" &&
    lesson.lesson_description.trim() !== "" &&
    lesson.module_id.trim() !== "" &&
    lesson.serial_number !== ""

  function buildLessonPayload() {
    return {
      lesson_title: lesson.lesson_title.trim(),
      lesson_duration: lesson.lesson_duration.trim(),
      lesson_description: lesson.lesson_description.trim(),
      module_id: lesson.module_id.trim(),
      serial_number: Number(lesson.serial_number),
      file: lessonVideoFile ?? undefined,
      lesson_cover_image: lessonCoverFile ?? undefined,
    }
  }

  function clearLessonForm(keepModuleId = true) {
    setLesson((p) => ({ ...INITIAL_LESSON, module_id: keepModuleId ? p.module_id : "" }))
    setLessonVideoFile(null)
    handleLessonCoverRemove()
  }

  function handleCreateLesson(e: React.FormEvent) {
    e.preventDefault()
    setLessonConfirmOpen(true)
  }

  function submitCreateLesson() {
    createLesson.mutate(buildLessonPayload(), {
      onSuccess: (data) => {
        setLessonConfirmOpen(false)
        toast.success((data as { message?: string }).message || "Lesson created successfully!")
        clearLessonForm()
      },
      onError: () => setLessonConfirmOpen(false),
    })
  }

  function submitSaveLessonDraft() {
    createLessonDraft.mutate(buildLessonPayload(), {
      onSuccess: (data) => {
        setLessonConfirmOpen(false)
        toast.success((data as { message?: string }).message || "Lesson saved as draft!")
        clearLessonForm()
      },
      onError: () => setLessonConfirmOpen(false),
    })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Create Course</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          First create a module, then add lessons to it.
        </p>
      </div>

      {/* ── MODULE SECTION ─────────────────────────────────────────────────── */}
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-sm font-black text-primary">1</span>
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900 dark:text-white">Create Module</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Fill in the module details below</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-5">
            <FieldRow label="Module Title" required>
              <Input
                variant="auth"
                placeholder="e.g. Introduction to Savings"
                value={mod.module_title}
                onChange={(e) => setM("module_title", e.target.value)}
              />
            </FieldRow>

            <FieldRow label="Module Description">
              <textarea
                placeholder="Describe what this module covers..."
                value={mod.module_description}
                onChange={(e) => setM("module_description", e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-purple-200 bg-purple-50 px-3 py-3 text-sm text-gray-900 placeholder:text-purple-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-purple-500 dark:focus:ring-gray-700"
              />
            </FieldRow>

            <ImageUploadBox
              label="Cover Image"
              file={modCoverFile}
              previewUrl={modCoverPreview}
              onSelect={handleModCoverSelect}
              onRemove={handleModCoverRemove}
              inputRef={modCoverRef}
            />
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <FieldRow label="Number of Lessons" required>
              <Select value={mod.no_of_lessons} onValueChange={(v) => setM("no_of_lessons", v)}>
                <SelectTrigger variant="auth" className="h-12!">
                  <SelectValue placeholder="Select number of lessons" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {SEQ_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldRow>

            <FieldRow label="Sequence Number" required>
              <Select value={mod.sequence_num} onValueChange={(v) => setM("sequence_num", v)}>
                <SelectTrigger variant="auth" className="h-12!">
                  <SelectValue placeholder="Select sequence number" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {SEQ_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldRow>

            <FieldRow label="Module Tier">
              <Select value={mod.module_tier} onValueChange={(v) => setM("module_tier", v)}>
                <SelectTrigger variant="auth" className="h-12!">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                </SelectContent>
              </Select>
            </FieldRow>

            <FieldRow label="Age Group">
              <Select value={mod.age_group} onValueChange={(v) => setM("age_group", v)}>
                <SelectTrigger variant="auth" className="h-12!">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="EARLY">Early</SelectItem>
                  <SelectItem value="MIDDLE">Middle</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </FieldRow>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            className="h-12 rounded-full px-8 text-sm font-bold"
            disabled={!modValid}
            onClick={() => setConfirmOpen(true)}
          >
            <Upload size={16} />
            Create Module
          </Button>
        </div>
      </section>

      {/* ── MODULE SUCCESS BANNER ─────────────────────────────────────────── */}
      {createdModuleId && <ModuleIdBanner moduleId={createdModuleId} />}

      {/* ── LESSON SECTION ─────────────────────────────────────────────────── */}
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-sm font-black text-primary">2</span>
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900 dark:text-white">Add Lesson to Module</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter the Module ID from step 1, or paste a previously created one
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateLesson}>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left column */}
            <div className="space-y-5">
              <FieldRow label="Module ID" required>
                <Input
                  variant="auth"
                  placeholder="Paste module ID here"
                  value={lesson.module_id}
                  onChange={(e) => setL("module_id", e.target.value)}
                />
              </FieldRow>

              <FieldRow label="Lesson Title" required>
                <Input
                  variant="auth"
                  placeholder="e.g. What is Budgeting?"
                  value={lesson.lesson_title}
                  onChange={(e) => setL("lesson_title", e.target.value)}
                />
              </FieldRow>

              <FieldRow label="Lesson Duration" required>
                <Input
                  variant="auth"
                  placeholder="e.g. 5:30 or 5 minutes"
                  value={lesson.lesson_duration}
                  onChange={(e) => setL("lesson_duration", e.target.value)}
                />
              </FieldRow>

              <FieldRow label="Lesson Description" required>
                <textarea
                  placeholder="What will learners get from this lesson?"
                  value={lesson.lesson_description}
                  onChange={(e) => setL("lesson_description", e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-purple-200 bg-purple-50 px-3 py-3 text-sm text-gray-900 placeholder:text-purple-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-purple-500 dark:focus:ring-gray-700"
                />
              </FieldRow>

              <FieldRow label="Serial Number" required>
                <Select value={lesson.serial_number} onValueChange={(v) => setL("serial_number", v)}>
                  <SelectTrigger variant="auth" className="h-12!">
                    <SelectValue placeholder="Select lesson serial number" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {SEQ_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              <VideoUploadBox
                file={lessonVideoFile}
                onSelect={handleLessonVideoSelect}
                onRemove={() => setLessonVideoFile(null)}
                inputRef={lessonVideoRef}
              />

              <ImageUploadBox
                label="Lesson Cover Image"
                file={lessonCoverFile}
                previewUrl={lessonCoverPreview}
                onSelect={handleLessonCoverSelect}
                onRemove={handleLessonCoverRemove}
                inputRef={lessonCoverRef}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              className="h-12 rounded-full px-8 text-sm font-bold"
              disabled={!lessonValid}
              loading={createLesson.isPending}
            >
              <Upload size={16} />
              Add Lesson
            </Button>
          </div>
        </form>
      </section>

      {/* ── PUBLISH CONFIRMATION MODAL ────────────────────────────────────── */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm bg-white p-6 dark:bg-gray-900" showCloseButton={false}>
          <DialogHeader>
            <div className="mb-3 flex justify-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle size={26} className="text-amber-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-base font-black text-gray-900 dark:text-white">
              Publish this module?
            </DialogTitle>
            <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
              This will make the module available in the system. You can add lessons to it afterwards.
            </p>
          </DialogHeader>

          <div className="mt-5 space-y-3">
            <Button
              type="button"
              className="h-12 w-full rounded-full text-sm font-bold"
              loading={createModule.isPending}
              disabled={createModuleDraft.isPending}
              onClick={handleCreateModule}
            >
              Create
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-full border-gray-200 text-sm font-bold text-gray-600 dark:border-gray-700 dark:text-gray-300"
              loading={createModuleDraft.isPending}
              disabled={createModule.isPending}
              onClick={handleSaveModuleDraft}
            >
              Save as Draft
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full rounded-full text-sm font-bold text-gray-500"
              disabled={createModule.isPending || createModuleDraft.isPending}
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── LESSON CONFIRMATION MODAL ─────────────────────────────────────── */}
      <Dialog open={lessonConfirmOpen} onOpenChange={setLessonConfirmOpen}>
        <DialogContent className="max-w-sm bg-white p-6 dark:bg-gray-900" showCloseButton={false}>
          <DialogHeader>
            <div className="mb-3 flex justify-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle size={26} className="text-amber-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-base font-black text-gray-900 dark:text-white">
              Add this lesson?
            </DialogTitle>
            <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
              Choose to publish immediately or save as a draft for later.
            </p>
          </DialogHeader>

          <div className="mt-5 space-y-3">
            <Button
              type="button"
              className="h-12 w-full rounded-full text-sm font-bold"
              loading={createLesson.isPending}
              disabled={createLessonDraft.isPending}
              onClick={submitCreateLesson}
            >
              Add Lesson
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-full border-gray-200 text-sm font-bold text-gray-600 dark:border-gray-700 dark:text-gray-300"
              loading={createLessonDraft.isPending}
              disabled={createLesson.isPending}
              onClick={submitSaveLessonDraft}
            >
              Save as Draft
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full rounded-full text-sm font-bold text-gray-500"
              disabled={createLesson.isPending || createLessonDraft.isPending}
              onClick={() => setLessonConfirmOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
