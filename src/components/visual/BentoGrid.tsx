import * as React from "react"
import { cn } from "@/lib/utils"

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4
  gap?: string
}

const colClasses: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
}

export function BentoGrid({
  className,
  columns = 3,
  gap = "1rem",
  children,
  ...props
}: BentoGridProps) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-4", colClasses[columns], className)}
      style={{ gap }}
      {...props}
    >
      {children}
    </div>
  )
}
