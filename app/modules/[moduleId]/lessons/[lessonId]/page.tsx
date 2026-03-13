"use client"

import { Clock, LibraryBig } from "lucide-react"
import { Button } from "@/components/ui/button"
import { modules } from "@/lib/data/modules"
import { notFound } from "next/navigation"
import { use } from "react"
import Navbar from "@/components/navbar/navbar"

export default function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>
}) {
  const { moduleId, lessonId } = use(params)
  const module = modules.find((m) => m.id === Number(moduleId))

  if (!module) return notFound()

  const lessonIndex = module.lessons.findIndex((l) => l.id === Number(lessonId))

  if (lessonIndex === -1) return notFound()

  const lesson = module.lessons[lessonIndex]
  const prevLesson = lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null
  const nextLesson =
    lessonIndex < module.lessons.length - 1
      ? module.lessons[lessonIndex + 1]
      : null

  return (
    <div className="flex min-h-screen flex-col bg-[#EDE6F0]">
      <Navbar />

      {/* Lesson header */}
      <div className="flex flex-col gap-4 px-3 py-4 sm:flex-row sm:items-start sm:px-5 sm:py-5">
        {/* Left: Lesson info */}
        <div className="flex-1">
          <p className="text-xs font-semibold text-primary">
            Module {module.id} – {module.shortTitle}
          </p>
          <h1 className="mt-1 text-xl font-bold text-gray-900">
            {lessonIndex + 1}. {lesson.title}
          </h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <LibraryBig size={14} />
              Lesson {lessonIndex + 1} of {module.totalLessons}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {lesson.duration}
            </span>
          </div>
        </div>

        {/* Right: About this lesson card */}
        <div className="rounded-xl bg-white px-4 py-3.5 shadow-xs sm:w-56">
          <h2 className="mb-1.5 text-sm font-bold text-gray-800">
            About this Lesson
          </h2>
          <p className="text-xs leading-relaxed text-gray-600">
            {lesson.description}
          </p>
        </div>
      </div>

      {/* Main content area (video placeholder) */}
      <div
        className="mx-3 flex-1 rounded-2xl bg-[#F5F0FA] shadow-inner sm:mx-5"
        style={{ minHeight: 260 }}
      />

      {/* Bottom navigation */}
      <div className="flex items-center justify-between px-3 py-4 sm:px-5 sm:py-5">
        <Button
          variant="outline"
          href={
            prevLesson
              ? `/modules/${module.id}/lessons/${prevLesson.id}`
              : `/modules/${module.id}`
          }
          className="rounded-full border-gray-300 px-5 text-sm font-semibold text-gray-700"
        >
          Previous Lesson
        </Button>

        <Button
          href={
            nextLesson
              ? `/modules/${module.id}/lessons/${nextLesson.id}`
              : `/modules/${module.id}`
          }
          className="rounded-full px-5 text-sm font-semibold"
          variant={nextLesson ? "default" : "outline"}
        >
          {nextLesson ? "Next lesson" : "Back to Module"}
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-[#E4D6B3] py-4 text-center">
        <p className="text-xs tracking-wider text-gray-600">
          © 2026 SAFI. ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  )
}
