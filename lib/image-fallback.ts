// Curated Unsplash photo IDs — education & learning themed
const UNSPLASH_PHOTO_IDS = [
  "1503676260728-1c00da094a0b", // books / studying
  "1522202176988-66273c2fd55f", // students learning
  "1434030216411-0b793f4b4173", // study desk
  "1456513080510-7bf3a84b82f8", // open book
  "1488190211105-8b0e65b80b4e", // notebook + pencil
  "1519389950473-47ba0277781c", // digital devices / tech
  "1516321497487-e288fb19713f", // modern classroom
  "1571260899304-425eee4c7efc", // classroom setting
  "1581291518633-83b4ebd1d83e", // e-learning laptop
  "1524178232363-1fb2b075b655", // education concept
]

/**
 * Generate a deterministic Unsplash image URL based on a seed/ID
 */
export const getUnsplashImageUrl = (
  seed: string | number,
  width = 800,
  height = 400
): string => {
  const seedHash = String(seed)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const photoId = UNSPLASH_PHOTO_IDS[seedHash % UNSPLASH_PHOTO_IDS.length]
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&q=80&auto=format`
}

/**
 * Get a valid image URL — uses the real URL if present, otherwise falls back to Unsplash
 */
export const getImageUrl = (
  imageUrl: string | null | undefined,
  fallbackSeed: string | number = "default",
  width = 800,
  height = 400
): string => {
  if (imageUrl && imageUrl.trim()) {
    return imageUrl
  }
  return getUnsplashImageUrl(fallbackSeed, width, height)
}
