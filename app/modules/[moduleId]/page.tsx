"use client"

import { CheckCircle2, Clock, Lock, CircleDashed } from "lucide-react"
import { Button } from "@/components/ui/button"

import { modules } from "@/lib/data/modules"
import { cn } from "@/lib/utils"
import { notFound } from "next/navigation"
import { use } from "react"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"

export default function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>
}) {
  const { moduleId } = use(params)
  const lessonModule = modules.find((m) => m.id === Number(moduleId))

  if (!lessonModule) return notFound()

  const nextLesson = lessonModule.lessons.find((l) => l.status === "available")

  return (
    <div className="flex min-h-screen flex-col bg-purple-100/50">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-5 sm:py-5">
        {/* Module header card */}
        <div className="rounded-2xl bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-lg font-bold text-gray-900">
              Module {lessonModule.id}: {lessonModule.shortTitle}
            </h1>
            <span className="shrink-0 text-xs font-semibold text-gray-500">
              {lessonModule.completedLessons} of {lessonModule.totalLessons}{" "}
              Lessons Completed
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {lessonModule.description}
          </p>
          {nextLesson && (
            <Button
              href={`/modules/${lessonModule.id}/lessons/${nextLesson.id}`}
              className="mt-4 px-5"
            >
              Continue Learning
            </Button>
          )}
        </div>

        {/* Lessons timeline */}
        <div className="relative mt-6 pl-8">
          {/* Vertical connector line */}
          <div className="absolute top-5 bottom-5 left-3.5 w-[0.1px] bg-gray-300" />

          <div className="flex flex-col gap-3">
            {lessonModule.lessons.map((lesson, index) => (
              <div key={lesson.id} className="relative flex items-center gap-4">
                {/* Icon */}
                <div className="absolute -left-8 z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-purple-100/60 backdrop-blur-sm">
                  {lesson.status === "completed" && (
                    <CheckCircle2 size={26} className="text-green-500" />
                  )}

                  {lesson.status === "available" && (
                    <CircleDashed size={26} className="text-gray-400" />
                  )}

                  {lesson.status === "locked" && (
                    <Lock size={18} className="text-gray-300" />
                  )}
                </div>

                {/* Lesson card */}
                <div
                  className={cn(
                    "w-full rounded-xl bg-white px-4 py-3.5 shadow-xs",
                    lesson.status === "locked" && "opacity-60"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          lesson.status === "locked"
                            ? "text-gray-400"
                            : "text-gray-800"
                        )}
                      >
                        {index + 1}. {lesson.title}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-gray-400">
                        <Clock size={12} />
                        <span className="text-xs">{lesson.duration}</span>
                      </div>
                    </div>

                    {lesson.status === "completed" && (
                      <span className="shrink-0 text-xs font-semibold text-green-500">
                        Completed
                      </span>
                    )}
                    {lesson.status === "available" && (
                      <Button
                        href={`/modules/${lessonModule.id}/lessons/${lesson.id}`}
                        variant="outline"
                        size="sm"
                        className="shrink-0 border-primary/40 px-4 text-primary"
                      >
                        Continue
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
