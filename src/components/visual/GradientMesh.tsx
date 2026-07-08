import { cn } from "@/lib/utils"

export function GradientMesh({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)} aria-hidden>
      <div className="absolute -left-1/4 top-1/4 size-[40rem] rounded-full bg-brand-1/20 blur-[120px]" />
      <div className="absolute right-0 top-0 size-[36rem] rounded-full bg-brand-3/20 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 size-[32rem] rounded-full bg-brand-2/20 blur-[120px]" />
    </div>
  )
}
