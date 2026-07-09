"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof React.JSX.IntrinsicElements
  /** Stagger delay in ms — applied to the `--delay` CSS var consumed by .reveal. */
  delay?: number
  /** Reveal threshold (0–1) for IntersectionObserver. */
  threshold?: number
  /** Disable the in-view animation entirely (rendered visible immediately). */
  disabled?: boolean
  /** Whether to observe the element repeatedly. Defaults to once. */
  repeat?: boolean
}

/**
 * Lightweight reveal-on-scroll primitive.
 *
 * - Uses IntersectionObserver — no framer-motion, no per-route JS weight.
 * - Staggers children with a `--delay` CSS variable (e.g. `style={{ "--delay": "120ms" }}`).
 * - Respects `prefers-reduced-motion: reduce` — element renders visible with no animation.
 * - SSR-safe: the first paint matches the un-revealed state, and the element
 *   transitions in once the observer fires.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  threshold = 0.15,
  disabled = false,
  repeat = false,
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null)
  const [visible, setVisible] = React.useState(disabled)

  React.useEffect(() => {
    if (disabled) return
    if (typeof IntersectionObserver === "undefined") return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (!repeat) io.disconnect()
          } else if (repeat) {
            setVisible(false)
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [disabled, threshold, repeat])

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  const mergedStyle: React.CSSProperties = {
    ...(style as React.CSSProperties),
    ...(delay ? ({ "--delay": `${delay}ms` } as React.CSSProperties) : null),
  }

  const Component = Tag as React.ElementType

  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      data-reveal={visible ? "visible" : "hidden"}
      data-reveal-reduced={prefersReduced ? "true" : undefined}
      className={cn("reveal", className)}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </Component>
  )
}
