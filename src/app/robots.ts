import type { MetadataRoute } from "next"
import { APP_URL } from "@/lib/constants"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/dashboard",
          "/purchases",
          "/sell/new",
          "/auth/",
          "/auth/callback",
          "/reset-password",
          "/forgot-password",
          "/enterprise/",
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  }
}