import { cn } from "@/lib/utils"

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)} aria-hidden>
      <div className="absolute inset-0 bg-background" />
      <div className="absolute left-1/2 top-[-10%] size-[120%] -translate-x-1/2">
        <div className="aurora h-full w-full opacity-70" />
      </div>
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 grain opacity-[0.18] mix-blend-soft-light" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/10 to-background" />
    </div>
  )
}
