"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MagneticProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Maximum pixel translation in either axis at the strongest pull.
   * Smaller = more restrained. Defaults to 10px.
   */
  strength?: number
  /**
   * Radius around the element (in CSS px) within which the magnetic pull
   * is non-zero. Falls off linearly to zero at the edge.
   */
  radius?: number
  /**
   * If true, disables the effect entirely. Useful for SSR + reduced motion.
   */
  disabled?: boolean
  /**
   * Element rendered as the wrapper. Use a non-interactive wrapper like a
   * span/div so focus and click hit-targets stay on the inner button/link.
   */
  as?: React.ElementType
}

/**
 * <Magnetic> — gently pulls its single child toward the pointer within a
 * radius, then springs back on leave. Pure transform-only animation.
 *
 * - Pointer-fine only (skipped on coarse/touch pointers).
 * - Disabled under prefers-reduced-motion.
 * - No React state per-frame; uses CSS variables updated via pointermove.
 * - Does NOT capture focus or clicks — wrap, don't replace, the child.
 */
export const Magnetic = React.forwardRef<HTMLSpanElement, MagneticProps>(
  (
    {
      className,
      strength = 10,
      radius = 110,
      disabled = false,
      as: Tag = "span",
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const localRef = React.useRef<HTMLSpanElement | null>(null)
    const [enabled, setEnabled] = React.useState(false)

    React.useEffect(() => {
      if (disabled) return
      if (typeof window === "undefined") return

      const mqCoarse = window.matchMedia("(pointer: coarse)")
      const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)")
      const mqHoverNone = window.matchMedia("(hover: none)")

      const update = () => {
        setEnabled(
          !mqCoarse.matches && !mqReduce.matches && !mqHoverNone.matches,
        )
      }
      update()
      mqCoarse.addEventListener("change", update)
      mqReduce.addEventListener("change", update)
      mqHoverNone.addEventListener("change", update)
      return () => {
        mqCoarse.removeEventListener("change", update)
        mqReduce.removeEventListener("change", update)
        mqHoverNone.removeEventListener("change", update)
      }
    }, [disabled])

    React.useEffect(() => {
      const el = localRef.current
      if (!el || !enabled) return

      let raf = 0
      let pendingX = 0
      let pendingY = 0
      let lastX = 0
      let lastY = 0
      let x = 0
      let y = 0
      let velocityX = 0
      let velocityY = 0
      let active = false

      const tick = () => {
        raf = 0
        // Critically-damped spring back toward (pendingX, pendingY).
        // When not active (pointer left), pending is (0, 0).
        const k = 0.18
        const d = 0.78
        const dx = pendingX - x
        const dy = pendingY - y
        velocityX = velocityX * d + dx * k
        velocityY = velocityY * d + dy * k
        x += velocityX
        y += velocityY
        el.style.setProperty("--mx", `${x.toFixed(2)}px`)
        el.style.setProperty("--my", `${y.toFixed(2)}px`)
        // Keep ticking until we're close to rest.
        if (
          active ||
          Math.abs(velocityX) > 0.05 ||
          Math.abs(velocityY) > 0.05 ||
          Math.abs(x - pendingX) > 0.05 ||
          Math.abs(y - pendingY) > 0.05
        ) {
          raf = requestAnimationFrame(tick)
        } else {
          x = pendingX
          y = pendingY
          el.style.setProperty("--mx", `${x.toFixed(2)}px`)
          el.style.setProperty("--my", `${y.toFixed(2)}px`)
        }
      }

      const ensureRaf = () => {
        if (!raf) raf = requestAnimationFrame(tick)
      }

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.hypot(dx, dy)
        if (dist > radius) {
          // Outside radius: zero pull, spring back.
          pendingX = 0
          pendingY = 0
          if (active) {
            active = false
            ensureRaf()
          }
          return
        }
        active = true
        const falloff = 1 - dist / radius
        // Clamp so we never pull more than `strength`.
        const max = strength * falloff
        pendingX = Math.max(-max, Math.min(max, dx * 0.35 * falloff))
        pendingY = Math.max(-max, Math.min(max, dy * 0.35 * falloff))
        lastX = e.clientX
        lastY = e.clientY
        ensureRaf()
      }

      const onLeave = () => {
        active = false
        pendingX = 0
        pendingY = 0
        velocityX = 0
        velocityY = 0
        ensureRaf()
      }

      // Use window pointermove so the magnetic pull keeps working even when
      // the cursor leaves the small child button (feels much smoother).
      window.addEventListener("pointermove", onMove, { passive: true })
      window.addEventListener("pointerout", onLeave, { passive: true })
      window.addEventListener("blur", onLeave, { passive: true })

      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerout", onLeave)
        window.removeEventListener("blur", onLeave)
      }
    }, [enabled, strength, radius])

    return (
      <Tag
        ref={localRef as never}
        data-magnetic=""
        data-magnetic-enabled={enabled ? "true" : "false"}
        className={cn(
          "inline-block will-change-transform",
          enabled &&
            "[transform:translate3d(var(--mx,0px),var(--my,0px),0)] transition-transform duration-200 ease-out-expo",
          className,
        )}
        style={style}
        {...props}
      >
        {children}
      </Tag>
    )
  },
)
Magnetic.displayName = "Magnetic"