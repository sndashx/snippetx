"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  spotlight?: boolean
}

export const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, as: Tag = "div", spotlight = true, children, ...props }, ref) => {
    const localRef = React.useRef<HTMLDivElement | null>(null)
    const [style, setStyle] = React.useState<React.CSSProperties>({})

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!spotlight || !localRef.current) return
      const rect = localRef.current.getBoundingClientRect()
      setStyle({
        "--mx": `${e.clientX - rect.left}px`,
        "--my": `${e.clientY - rect.top}px`,
      } as React.CSSProperties)
    }

    return (
      <Tag
        ref={ref as never}
        onMouseMove={handleMove}
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition-all duration-300 hover:border-brand-2/40 hover:shadow-2xl hover:shadow-brand-2/10 glow-border",
          className,
        )}
        {...props}
      >
        {spotlight && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--brand-2) 16%, transparent), transparent 70%)",
              ...style,
            }}
          />
        )}
        <div className="relative">{children}</div>
      </Tag>
    )
  },
)
GlowCard.displayName = "GlowCard"
