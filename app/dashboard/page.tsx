"use client"

import { LibraryBig, Clock, Users } from "lucide-react"
import Link from "next/link"
import { modules, featuredLesson, quickLessons } from "@/lib/data/modules"

const currentModule = modules[0]
const progressPercent =
  (currentModule.completedLessons / currentModule.totalLessons) * 100

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EDE6F0]">
      {/* Greeting */}
      <div className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-primary">Hello, Oserime!</h1>
        <p className="mt-0.5 text-sm text-gray-500">Ready to explore?</p>
      </div>

      {/* Module 1 card */}
      <div className="mx-5 rounded-2xl bg-white p-5 shadow-xs">
        <h2 className="text-lg font-bold text-gray-900">Module 1</h2>
        <p className="mt-1 text-sm text-gray-600">
          This is your First step to Greatness.
        </p>
        {/* Progress bar */}
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Start learning */}
      <div className="mt-6 px-5">
        <h3 className="mb-3 font-bold text-gray-800">Start learning</h3>

        {/* Featured card */}
        <Link
          href={`/modules/${featuredLesson.moduleId}/lessons/${featuredLesson.lessonId}`}
          className="block overflow-hidden rounded-2xl"
        >
          {/* Image placeholder – deep-night Pyramids palette */}
          <div className="relative h-48 w-full bg-gradient-to-b from-[#050520] via-[#1a1060] to-[#2d1045]">
            {/* Stars */}
            <div className="absolute inset-0 opacity-40">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute size-0.5 rounded-full bg-white"
                  style={{
                    left: `${(i * 37 + 11) % 100}%`,
                    top: `${(i * 53 + 7) % 60}%`,
                    opacity: 0.6 + (i % 3) * 0.2,
                  }}
                />
              ))}
            </div>
            {/* Pyramid silhouettes */}
            <svg
              viewBox="0 0 400 180"
              className="absolute bottom-0 left-0 w-full"
              preserveAspectRatio="none"
            >
              <polygon points="60,180 180,80 300,180" fill="#c07820" />
              <polygon points="160,180 250,100 340,180" fill="#a06010" />
              {/* Golden glow line */}
              <line
                x1="0"
                y1="145"
                x2="400"
                y2="145"
                stroke="#f59e0b"
                strokeWidth="2"
                opacity="0.4"
              />
            </svg>
          </div>
          {/* Card footer */}
          <div className="flex items-center justify-between bg-[#c4a0e0] px-4 py-3">
            <span className="font-semibold text-white">
              {featuredLesson.title}
            </span>
            <span className="text-sm text-white/90">
              {featuredLesson.duration}
            </span>
          </div>
        </Link>

        {/* View all lessons */}
        <Link
          href="/modules/1"
          className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <LibraryBig size={18} />
          View all lessons
        </Link>

        {/* 3 small lesson cards */}
        <div className="mt-3 grid grid-cols-3 gap-2 pb-24">
          {quickLessons.map((lesson) => (
            <Link
              key={lesson.title}
              href={`/modules/${lesson.moduleId}/lessons/${lesson.lessonId}`}
              className="overflow-hidden rounded-xl"
            >
              {/* Image placeholder */}
              <div className={`h-24 w-full ${lesson.colorClass}`} />
              {/* Footer */}
              <div className="bg-[#E4D6B3] px-2 py-2">
                <p className="truncate text-xs font-bold text-gray-800">
                  {lesson.title}
                </p>
                <p className="text-[10px] text-gray-500">{lesson.duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Parent Menu button */}
      <div className="fixed right-5 bottom-6">
        <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-lg">
          <Users size={18} className="text-gray-600" />
          Parent Menu
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-[#E4D6B3] py-4 text-center">
        <p className="text-xs tracking-wider text-gray-600">
          © 2026 SAFI. ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  )
}
