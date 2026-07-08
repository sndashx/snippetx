import { cn } from "@/lib/utils"

interface BrandMarkProps {
  className?: string
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-7", className)}
      aria-hidden
      role="img"
    >
      <defs>
        <linearGradient id="numina-mark" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand-1)" />
          <stop offset="0.5" stopColor="var(--brand-2)" />
          <stop offset="1" stopColor="var(--brand-3)" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" stroke="url(#numina-mark)" strokeWidth="1.5" opacity="0.5" />
      <path
        d="M9 23V9l14 14V9"
        stroke="url(#numina-mark)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23" cy="9" r="2.1" fill="var(--brand-3)" />
    </svg>
  )
}
