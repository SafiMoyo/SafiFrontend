"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import Image from "next/image"
import { whyCards, difference, steps, videos } from "./utils"
import ScrollFadeIn from "@/components/scroll-fade-in"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"

export default function SafiLandingPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="mx-auto mt-1 max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl shadow-md">
          <Image
            alt="Logo"
            src={"/images/hero-1.png"}
            width={300}
            height={100}
            className="h-[500px] w-full object-cover"
          />

          <div className="absolute inset-0 bg-white/20" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <ScrollFadeIn direction="down">
              <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
                AI literacy starts here
              </h1>
            </ScrollFadeIn>
            <ScrollFadeIn direction="left">
              <p className="mb-6 max-w-2xl text-gray-700">
                Safi teaches students how artificial intelligence works and how
                to use it productively through real-world, practical learning.
              </p>
            </ScrollFadeIn>

            <ScrollFadeIn>
              <Button className="mt-10 px-8 py-7 text-lg">
                Start your free Trial
              </Button>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* WHY AI */}
      <section className="mx-auto max-w-7xl px-6 py-16">
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
                  <p className="mt-3 text-sm text-gray-700">{card.desc}</p>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* HOW SAFI BUILDS AI SKILLS */}
      <section className="mx-auto max-w-5xl px-6 py-12">
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
      <section className="mx-auto max-w-7xl px-6 py-16">
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
                  <p className="text-sm text-gray-700">{item.desc}</p>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* SAMPLE VIDEOS */}
      <section className="mx-auto max-w-7xl px-6 py-10 text-center">
        <ScrollFadeIn direction="down">
          <h2 className="mb-8 text-lg font-extrabold">SAMPLE VIDEOS</h2>
        </ScrollFadeIn>

        <div className="grid gap-8 md:grid-cols-3">
          {videos.map((v, i) => (
            <ScrollFadeIn
              delay={i * 0.15}
              key={i}
              direction="down"
              className="overflow-hidden rounded-xl shadow-md"
            >
              <img src={v} alt="videos" className="h-48 w-full object-cover" />
            </ScrollFadeIn>
          ))}
        </div>

        <div className="mt-10">
          <ScrollFadeIn>
            <Button className="px-10 py-6 font-bold">
              Start Your Free Trial
            </Button>
          </ScrollFadeIn>
        </div>
      </section>
      <Footer />
    </main>
  )
}
