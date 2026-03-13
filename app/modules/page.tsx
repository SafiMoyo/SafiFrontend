"use client"

import { Lock, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { modules } from "@/lib/data/modules"
import { cn } from "@/lib/utils"
import Footer from "@/components/footer/footer"
import Navbar from "@/components/navbar/navbar"

export default function ModulesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-purple-100/50">
      <Navbar />

      {/* Header bar */}
      <div className="bg-purple-200">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-12 py-3">
          <Video size={22} className="text-primary" />
          <h1 className="text-lg font-bold text-gray-800">Modules</h1>
        </div>
      </div>

      {/* Module list */}
      <div className="flex flex-col gap-4 px-8 py-6">
        {modules.map((module) => (
          <div key={module.id} className="relative">
            {/* Lock icon in left gutter */}
            {module.isLocked && (
              <div className="absolute top-5 right-3 z-10 -translate-y-1/2">
                <Lock size={20} className="text-gray-400" />
              </div>
            )}

            <div
              className={cn(
                "rounded-2xl bg-white p-5 shadow-xs",
                module.isLocked && "opacity-75"
              )}
            >
              <h2
                className={cn(
                  "text-base font-bold",
                  module.isLocked ? "text-gray-400" : "text-gray-900"
                )}
              >
                Module {module.id}: {module.title}
              </h2>
              <p
                className={cn(
                  "mt-1 text-sm",
                  module.isLocked ? "text-gray-400" : "text-gray-600"
                )}
              >
                {module.description}
              </p>
              <p
                className={cn(
                  "mt-3 text-sm font-bold",
                  module.isLocked ? "text-gray-400" : "text-gray-800"
                )}
              >
                {module.completedLessons} of {module.totalLessons} Lessons
                Completed
              </p>
              <div className="mt-4 flex justify-end">
                {!module.isLocked ? (
                  <Button href={`/modules/${module.id}`} className="px-5">
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-primary/30 px-5 text-primary/60"
                    disabled
                  >
                    Complete Previous Module
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
