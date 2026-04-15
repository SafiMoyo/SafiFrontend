"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import Image from "next/image"
import { whyCards, difference, steps } from "./utils"
import ScrollFadeIn from "@/components/scroll-fade-in"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"
import { useRouter } from "next/navigation"
import { ENUM_AUTH } from "@/lib/enum"
import { AuthModal } from "@/components/modals/auth"
import { SelectProfileModal } from "@/components/modals/select-profile-modal"
import { useAuthContext } from "@/context"

const heroSlides = [
  "/images/hero-1.png",
  "/images/hero-5.png",
  "/images/hero-4.png",
]

export default function SafiLandingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthContext()
  const [authOpen, setAuthOpen] = useState(false)
  const [selectProfileOpen, setSelectProfileOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goToSlide = (index: number) => {
    setActiveSlide(index)
  }

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
  }

  useEffect(() => {
    startAutoPlay()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleStartTrial = () => {
    if (isAuthenticated) {
      router.push("/dashboard")
      return
    }
    setAuthOpen(true)
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="mt-6 px-5 lg:px-10">
        <div className="relative overflow-hidden rounded-2xl shadow-md">
          {/* Slides */}
          <div
            className="flex h-[600px] transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {heroSlides.map((src, i) => (
              <div key={i} className="relative h-[600px] w-full shrink-0">
                <Image
                  alt={`Hero slide ${i + 1}`}
                  src={src}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Overlay content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <ScrollFadeIn direction="down">
              <h1 className="mb-4 text-4xl text-black font-extrabold md:text-5xl">
                AI literacy starts here
              </h1>
            </ScrollFadeIn>
            <ScrollFadeIn direction="left">
              <p className="mb-6 max-w-2xl text-lg text-black font-extrabold">
                Safi teaches students how artificial intelligence works and how
                to use it productively through real-world, practical learning.
              </p>
            </ScrollFadeIn>

            <ScrollFadeIn>
              <Button
                className="mt-10 px-8 py-7 text-lg"
                onClick={handleStartTrial}
              >
                Start your free Trial
              </Button>
            </ScrollFadeIn>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  goToSlide(i)
                  startAutoPlay()
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === activeSlide ? "w-6 bg-white" : "w-2 bg-white/50"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHY AI */}
      <section className="px-5 lg:px-10 py-16">
        <ScrollFadeIn direction="down">
          <h2 className="mb-10 text-center text-xl font-extrabold text-gray-700">
            Why Should Students Learn Artificial Intelligence?
          </h2>
        </ScrollFadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {whyCards.map((card, i) => (
            <ScrollFadeIn delay={i * 0.1} key={i}>
              <div className="h-full rounded-xl bg-[#e6d6b6] shadow-xs">
                <div className="p-6">
                  <h3 className="font-bold">{card.title}</h3>
                  <p className="mt-3 text-base text-gray-700">{card.desc}</p>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* HOW SAFI BUILDS AI SKILLS */}
      <section id="how-it-works" className="px-5 lg:px-10 py-12">
        <ScrollFadeIn direction="down">
          <h2 className="mb-12 text-center text-xl font-extrabold">
            How Safi Builds AI Skills
          </h2>
        </ScrollFadeIn>

        <div className="space-y-10">
          {steps.map((step, i) => (
            <ScrollFadeIn
              key={i}
              direction="left"
              delay={i * 0.1}
              className="flex gap-6"
            >
              <div
                className={cn("flex flex-col items-center")}
                style={{ marginLeft: i * 40 }}
              >
                <ScrollFadeIn delay={i * 0.15}>
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white shadow">
                    {i + 1}
                  </div>
                </ScrollFadeIn>
                <div className="mt-2 h-full w-[2px] border-l-2 border-dotted border-primary/60" />
              </div>

              <div className="flex-1 rounded-xl bg-gradient-to-r from-purple-800 to-purple-400 p-6 text-white shadow">
                <h3 className="mb-1 font-bold">{step.title}</h3>
                <p className="text-sm opacity-90">{step.desc}</p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* WHAT MAKES SAFI DIFFERENT */}
      <section className="px-5 lg:px-10 py-16">
        <ScrollFadeIn direction="down">
          <h2 className="mb-10 text-center text-xl font-extrabold">
            What Makes Safi Different
          </h2>
        </ScrollFadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {difference.map((item, i) => (
            <ScrollFadeIn delay={i * 0.15} key={i} direction="right">
              <div className="h-full rounded-xl border-none bg-[#e6d6b6] shadow-xs">
                <div className="p-6">
                  <h3 className="mb-3 font-bold">{item.title}</h3>
                  <p className="mt-3 text-base text-gray-700">{item.desc}</p>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* SAMPLE VIDEOS */}
      <section className="px-5 lg:px-10 py-10 text-center">
        <ScrollFadeIn direction="down">
          <h2 className="mb-8 text-lg font-extrabold">SAMPLE VIDEOS</h2>
        </ScrollFadeIn>

        <div className="grid gap-8 md:grid-cols-3">
          {["/images/banner1.png", "/images/banner2.png", "/images/banner3.png"].map((src, i) => (
            <ScrollFadeIn
              delay={i * 0.15}
              key={i}
              direction="down"
              className="overflow-hidden rounded-xl shadow-md"
            >
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="block w-full cursor-pointer"
              >
                <img src={src} alt={`Banner ${i + 1}`} className="h-48 w-full object-cover" />
              </button>
            </ScrollFadeIn>
          ))}
        </div>

        <div className="mt-10">
          <ScrollFadeIn>
            <Button className="px-10 py-6 font-bold" onClick={handleStartTrial}>
              Start Your Free Trial
            </Button>
          </ScrollFadeIn>
        </div>
      </section>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        authTab={ENUM_AUTH.SIGNUP}
        onFamilyAuth={() => {
          setAuthOpen(false)
          setSelectProfileOpen(true)
        }}
      />

      <SelectProfileModal
        open={selectProfileOpen}
        onOpenChange={setSelectProfileOpen}
      />
      <Footer />
    </main>
  )
}
