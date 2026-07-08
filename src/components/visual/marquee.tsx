"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps {
  children: ReactNode
  className?: string
  duration?: number
  reverse?: boolean
  pauseOnHover?: boolean
}

export function Marquee({
  children,
  className,
  duration = 36,
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden mask-fade-edges",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center",
          "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {children}
        {children}
      </div>
    </div>
  )
}
