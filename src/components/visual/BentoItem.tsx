import * as React from "react"
import { cn } from "@/lib/utils"

export interface BentoItemProps extends React.HTMLAttributes<HTMLElement> {
  colSpan?: 1 | 2 | 3 | 4
  rowSpan?: 1 | 2 | 3
  as?: React.ElementType
}

const colSpanMap: Record<1 | 2 | 3 | 4, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
}

const rowSpanMap: Record<1 | 2 | 3, string> = {
  1: "sm:row-span-1",
  2: "sm:row-span-2",
  3: "sm:row-span-3",
}

export function BentoItem({
  className,
  colSpan = 1,
  rowSpan = 1,
  as: Tag = "div",
  children,
  ...props
}: BentoItemProps) {
  return (
    <Tag
      className={cn(colSpanMap[colSpan], rowSpanMap[rowSpan], "min-h-0 rounded-2xl", className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
