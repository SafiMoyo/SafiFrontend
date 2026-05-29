import Image from "next/image"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 text-center">
      <Image src="/images/logo.svg" alt="Safi" width={100} height={36} className="h-9 w-auto" />
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">You&apos;re offline</h1>
        <p className="mt-2 text-sm font-semibold text-gray-500">
          Check your internet connection and try again.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-purple-800"
      >
        Try again
      </Link>
    </div>
  )
}
