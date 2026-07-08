"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const reduce = useReducedMotion()

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  )
}
