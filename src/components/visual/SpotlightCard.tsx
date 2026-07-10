"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Element to render as. Defaults to `div`. */
  as?: React.ElementType
  /** Pixel radius of the radial gradient. */
  size?: number
  /** Accent color CSS variable or color string. Defaults to var(--accent). */
  color?: string
  /** Opacity of the spotlight at full intensity (0-100). Defaults to 14. */
  intensity?: number
}

/**
 * <SpotlightCard> — minimal wrapper that adds a pointer-follow accent
 * spotlight layer on hover. The element keeps whatever styling you apply
 * via className/style; the spotlight is purely additive.
 *
 * - Pointer-fine + hover-capable only.
 * - Disabled under prefers-reduced-motion.
 * - CSS custom properties (`--mx`/`--my`) updated via rAF-coalesced
 *   pointermove — no React state per-frame.
 */
export const SpotlightCard = React.forwardRef<
  HTMLDivElement,
  SpotlightCardProps
>(
  (
    {
      className,
      as: Tag = "div",
      size = 360,
      color = "var(--accent)",
      intensity = 14,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const localRef = React.useRef<HTMLDivElement | null>(null)
    const layerRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
      const host = localRef.current
      const layer = layerRef.current
      if (!host || !layer) return

      if (typeof window === "undefined") return
      const mqCoarse = window.matchMedia("(pointer: coarse)")
      const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)")
      const mqHoverNone = window.matchMedia("(hover: none)")
      if (mqCoarse.matches || mqReduce.matches || mqHoverNone.matches) {
        return
      }

      let raf = 0
      let nx = 0
      let ny = 0
      let dirty = false

      const flush = () => {
        raf = 0
        if (!dirty) return
        dirty = false
        layer.style.setProperty("--mx", `${nx}px`)
        layer.style.setProperty("--my", `${ny}px`)
      }
      const schedule = () => {
        dirty = true
        if (!raf) raf = requestAnimationFrame(flush)
      }
      const onMove = (e: PointerEvent) => {
        const rect = host.getBoundingClientRect()
        nx = e.clientX - rect.left
        ny = e.clientY - rect.top
        schedule()
      }
      host.addEventListener("pointermove", onMove, { passive: true })
      return () => {
        cancelAnimationFrame(raf)
        host.removeEventListener("pointermove", onMove)
      }
    }, [])

    return (
      <Tag
        ref={(node: HTMLDivElement | null) => {
          localRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={cn("group relative overflow-hidden", className)}
        style={style}
        {...props}
      >
        <div
          ref={layerRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, ${color} ${intensity}%, transparent), transparent 70%)`,
          }}
        />
        {children}
      </Tag>
    )
  },
)
SpotlightCard.displayName = "SpotlightCard"