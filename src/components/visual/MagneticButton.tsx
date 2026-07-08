"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface MagneticButtonProps extends HTMLMotionProps<"div"> {
  /** How strongly the element follows the cursor (0–1). */
  strength?: number
  children: React.ReactNode
}

export const MagneticButton = React.forwardRef<HTMLDivElement, MagneticButtonProps>(
  ({ className, children, strength = 0.35, ...props }, ref) => {
    const reduce = useReducedMotion()
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springCfg = { stiffness: 250, damping: 18, mass: 0.4 }
    const sx = useSpring(x, springCfg)
    const sy = useSpring(y, springCfg)

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce) return
      const rect = e.currentTarget.getBoundingClientRect()
      x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
      y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
    }

    const reset = () => {
      x.set(0)
      y.set(0)
    }

    return (
      <motion.div
        ref={ref}
        className={cn("inline-block", className)}
        style={{ x: sx, y: sy }}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)
MagneticButton.displayName = "MagneticButton"
