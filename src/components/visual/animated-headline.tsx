"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedHeadlineProps {
  text: string
  gradientWords?: string[]
  className?: string
}

export function AnimatedHeadline({ text, gradientWords = [], className }: AnimatedHeadlineProps) {
  const reduce = useReducedMotion()
  const words = text.split(" ")

  return (
    <motion.h1
      className={cn(
        "text-balance text-5xl font-semibold tracking-tight sm:text-7xl lg:text-8xl",
        className
      )}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {words.map((word, i) => {
        const isGradient = gradientWords.some(
          (gw) => word.replace(/[.,]/g, "").toLowerCase() === gw.toLowerCase()
        )
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className={cn(
                "inline-block",
                isGradient && "text-gradient"
              )}
              variants={{
                hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.8,
                    delay: 0.08 * i + 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        )
      })}
    </motion.h1>
  )
}
