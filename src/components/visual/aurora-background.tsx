"use client"

import { cn } from "@/lib/utils"

interface AuroraBackgroundProps {
  className?: string
  grid?: boolean
  grain?: boolean
}

export function AuroraBackground({ className, grid = true, grain = true }: AuroraBackgroundProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-background" />
      {grid && (
        <div className="absolute inset-0 bg-grid opacity-[0.55] mask-fade-b" />
      )}
      <div
        className="aurora-blob absolute -top-[20%] left-[8%] size-[55vw] rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklch, var(--brand-1), transparent 30%), transparent 65%)",
        }}
      />
      <div
        className="aurora-blob absolute top-[10%] right-[2%] size-[50vw] rounded-full blur-[110px]"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklch, var(--brand-2), transparent 35%), transparent 65%)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="aurora-blob absolute bottom-[-15%] left-[28%] size-[48vw] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklch, var(--brand-3), transparent 40%), transparent 65%)",
          animationDelay: "-12s",
        }}
      />
      {grain && (
        <div className="absolute inset-0 grain opacity-[0.06] mix-blend-overlay" />
      )}
    </div>
  )
}
