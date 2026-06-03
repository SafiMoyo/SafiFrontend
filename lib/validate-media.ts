const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif"]
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".heic", ".heif"]
const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB

export type MediaValidationResult =
  | { ok: true }
  | { ok: false; error: string }

export function validateCoverImage(file: File): MediaValidationResult {
  const ext = "." + file.name.split(".").pop()?.toLowerCase()
  const typeOk = ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())
  const extOk = ALLOWED_IMAGE_EXTENSIONS.includes(ext)

  if (!typeOk && !extOk) {
    return { ok: false, error: "Only JPG, JPEG, PNG, or HEIC images are allowed." }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Image must not exceed 10 MB." }
  }
  return { ok: true }
}

export function validateLessonVideo(file: File): MediaValidationResult {
  if (!file.type.startsWith("video/")) {
    return { ok: false, error: "Only video files are allowed." }
  }
  return { ok: true }
}
