"use client"

import Footer from "@/components/footer/footer"
import Navbar from "@/components/navbar/navbar"
import ScrollFadeIn from "@/components/scroll-fade-in"
import { aboutUsData, safiDifferenceData } from "./utils"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#EDE6F0]">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="px-6 py-20 text-center">
        <ScrollFadeIn direction="down">
          <h1 className="text-5xl font-extrabold">
            About <span className="text-purple-600">SAFI</span>
          </h1>
        </ScrollFadeIn>

        <ScrollFadeIn direction="left">
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-purple-600" />
        </ScrollFadeIn>

        <ScrollFadeIn>
          <p className="mx-auto mt-8 max-w-xl text-base font-semibold text-gray-600">
            Empowering the next generation with the tools and literacy to
            navigate the future of artificial intelligence.
          </p>
        </ScrollFadeIn>
      </section>

      {/* MISSION + VISION */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-10 md:grid-cols-2">
          {aboutUsData.map((data, idx) => (
            <ScrollFadeIn key={idx} delay={idx * 0.08}>
              <div className="rounded-2xl border border-gray-100 bg-white/70">
                <div className="space-y-6 p-10 text-center">
                  <h3 className="text-2xl font-bold">{data.title}</h3>

                  <p className="mt-6 leading-relaxed font-medium text-gray-600">
                    {data.description}
                  </p>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* SAFI DIFFERENCE */}
      <section className="px-6 pb-20 text-center">
        <p className="text-lg font-bold text-purple-600">The Safi Difference</p>

        <h2 className="mt-3 text-3xl font-extrabold text-gray-700">
          Premium AI Literacy
        </h2>

        <div className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-3">
          {safiDifferenceData.map((data, idx) => (
            <ScrollFadeIn key={idx} delay={idx * 0.08}>
              <div className="space-y-3">
                <h3 className="text-lg font-bold">{data.title}</h3>

                <p className="text-sm font-medium text-gray-600">
                  {data.description}
                </p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  )
}
