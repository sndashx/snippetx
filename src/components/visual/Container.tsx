import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Centered, max-width content wrapper that respects the design system's
 * horizontal gutter. Use inside <Section> to keep page rhythm consistent.
 */
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  size?: "default" | "narrow" | "wide"
}

const containerWidth: Record<NonNullable<ContainerProps["size"]>, string> = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
}

export function Container({
  className,
  as: Tag = "div",
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-6 sm:px-8",
        containerWidth[size],
        className,
      )}
      {...props}
    />
  )
}

/**
 * Vertical section rhythm primitive. Provides consistent top/bottom spacing
 * and an optional fade-in reveal that respects prefers-reduced-motion.
 */
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  spacing?: "sm" | "md" | "lg"
}

const sectionSpacing: Record<NonNullable<SectionProps["spacing"]>, string> = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-24 sm:py-32",
}

export function Section({
  className,
  as: Tag = "section",
  spacing = "md",
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn("relative w-full scroll-mt-24", sectionSpacing[spacing], className)}
      {...props}
    />
  )
}
