"use client"

import { useEffect, useRef, useState } from "react"

export default function AnimatedCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    // Only activate on fine-pointer devices (mouse/trackpad), not touch screens
    const mq = window.matchMedia("(pointer: fine)")
    if (!mq.matches) return

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
      setVisible(true)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)
    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    // Track hover over interactive elements
    const onOverInteractive = (e: MouseEvent) => {
      const target = e.target as Element
      setHovering(
        !!target.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]')
      )
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("mouseup", onUp)
    document.addEventListener("mouseover", onOverInteractive)

    const animate = () => {
      const ease = 0.12
      ring.current.x += (mouse.current.x - ring.current.x) * ease
      ring.current.y += (mouse.current.y - ring.current.y) * ease

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      }
      rafId.current = requestAnimationFrame(animate)
    }
    rafId.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("mouseup", onUp)
      document.removeEventListener("mouseover", onOverInteractive)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      {/* Dot — snaps instantly to cursor */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        <div
          className="rounded-full bg-primary transition-all duration-150"
          style={{
            width: clicking ? 6 : hovering ? 10 : 8,
            height: clicking ? 6 : hovering ? 10 : 8,
          }}
        />
      </div>

      {/* Ring — lags behind for trail effect */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        <div
          className="rounded-full border border-primary transition-all duration-200"
          style={{
            width: clicking ? 24 : hovering ? 44 : 32,
            height: clicking ? 24 : hovering ? 44 : 32,
            opacity: clicking ? 0.5 : hovering ? 0.6 : 0.4,
          }}
        />
      </div>
    </>
  )
}
