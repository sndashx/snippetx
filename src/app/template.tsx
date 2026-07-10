"use client"

import { usePathname } from "next/navigation"

const MARKETING_PREFIXES = ["/", "/model", "/research", "/playground"]
const ADMIN_OR_APP = ["/admin", "/sell", "/browse", "/login", "/register", "/api", "/enterprise", "/privacy", "/terms", "/auth"]

function isMarketingPath(pathname: string): boolean {
  if (pathname.startsWith("/research/")) return true
  if (ADMIN_OR_APP.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return false
  }
  if (pathname === "/") return true
  return MARKETING_PREFIXES.includes(pathname)
}

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (!isMarketingPath(pathname)) return <>{children}</>
  return <div className="route-enter">{children}</div>
}
