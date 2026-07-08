"use client"

import { useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlowCardProps {
  children: ReactNode
  className?: string
}

export function GlowCard({ children, className }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`)
    el.style.setProperty("--my", `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        "group/glow relative overflow-hidden rounded-2xl glass glow-border transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-2xl focus-within:-translate-y-1",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/glow:opacity-100 group-focus-within/glow:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), color-mix(in oklch, var(--brand-1), transparent 82%), transparent 60%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
