"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  spotlight?: boolean
  /**
   * Pointer-follow spotlight. Reads pointermove on the element and updates
   * `--mx`/`--my` CSS custom props on the spotlight layer at most once per
   * animation frame. No React state per-frame.
   * Defaults to the value of `spotlight`.
   */
  followSpotlight?: boolean
  /**
   * Pixel radius of the radial-gradient spotlight. Defaults to 380.
   */
  spotlightSize?: number
  /**
   * Optional accent color override (CSS color). Defaults to var(--brand-2).
   */
  spotlightColor?: string
}

/**
 * GlowCard — soft-edge card with an optional pointer-follow spotlight.
 *
 * The spotlight is positioned by writing `--mx` / `--my` to the element's
 * style on each frame (via rAF coalescing of pointermove events). This
 * avoids React re-renders and keeps the effect GPU-cheap.
 */
export const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  (
    {
      className,
      as: Tag = "div",
      spotlight = true,
      followSpotlight = spotlight,
      spotlightSize = 380,
      spotlightColor = "var(--brand-2)",
      children,
      ...props
    },
    ref,
  ) => {
    const localRef = React.useRef<HTMLDivElement | null>(null)
    const layerRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
      const host = localRef.current
      const layer = layerRef.current
      if (!followSpotlight || !host || !layer) return

      if (typeof window === "undefined") return
      const mqCoarse = window.matchMedia("(pointer: coarse)")
      const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)")
      const mqHoverNone = window.matchMedia("(hover: none)")
      if (
        mqCoarse.matches ||
        mqReduce.matches ||
        mqHoverNone.matches
      ) {
        return
      }

      let raf = 0
      let nextX = 0
      let nextY = 0
      let dirty = false

      const flush = () => {
        raf = 0
        if (!dirty) return
        dirty = false
        layer.style.setProperty("--mx", `${nextX}px`)
        layer.style.setProperty("--my", `${nextY}px`)
      }

      const schedule = () => {
        dirty = true
        if (!raf) raf = requestAnimationFrame(flush)
      }

      const onMove = (e: PointerEvent) => {
        const rect = host.getBoundingClientRect()
        nextX = e.clientX - rect.left
        nextY = e.clientY - rect.top
        schedule()
      }

      host.addEventListener("pointermove", onMove, { passive: true })
      return () => {
        cancelAnimationFrame(raf)
        host.removeEventListener("pointermove", onMove)
      }
    }, [followSpotlight])

    return (
      <Tag
        ref={localRef as never}
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition-all duration-300 hover:border-brand-2/40 hover:shadow-elevated-3 glow-border",
          className,
        )}
        {...props}
      >
        {spotlight && (
          <div
            ref={layerRef as never}
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(${spotlightSize}px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, ${spotlightColor} 16%, transparent), transparent 70%)`,
            }}
          />
        )}
        <div className="relative">{children}</div>
      </Tag>
    )
  },
)
GlowCard.displayName = "GlowCard"
