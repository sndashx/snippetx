import type { MetadataRoute } from "next"
import { db } from "@/db"
import { snippets } from "@/db/schema"
import { desc } from "drizzle-orm"
import { APP_URL } from "@/lib/constants"
import { snippetPath } from "@/lib/seo"

// Regenerate the sitemap at most hourly.
export const revalidate = 3600

const LANGUAGES = [
  "typescript",
  "javascript",
  "python",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
]

/** Static lab-site routes. Update when adding/removing marketing routes. */
type RouteSpec = {
  path: string
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never"
  priority: number
}

const LAB_ROUTES: RouteSpec[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/model", changeFrequency: "weekly", priority: 0.9 },
  { path: "/research", changeFrequency: "weekly", priority: 0.9 },
  { path: "/playground", changeFrequency: "monthly", priority: 0.8 },
]

/** Marketplace routes that should be discoverable by search engines. */
const MARKETPLACE_ROUTES: RouteSpec[] = [
  { path: "/browse", changeFrequency: "hourly", priority: 0.9 },
]

const STATIC_ROUTES: RouteSpec[] = [
  { path: "/contact", changeFrequency: "monthly", priority: 0.4 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const labRoutes: MetadataRoute.Sitemap = LAB_ROUTES.map((r) => ({
    url: `${APP_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const marketplaceRoutes: MetadataRoute.Sitemap = MARKETPLACE_ROUTES.map(
    (r) => ({
      url: `${APP_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    }),
  )

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${APP_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const languageRoutes: MetadataRoute.Sitemap = LANGUAGES.map((lang) => ({
    url: `${APP_URL}/snippets/lang/${lang}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }))

  let snippetRoutes: MetadataRoute.Sitemap = []
  try {
    const rows = await db
      .select({
        id: snippets.id,
        title: snippets.title,
        updatedAt: snippets.updatedAt,
      })
      .from(snippets)
      .orderBy(desc(snippets.updatedAt))
      .limit(5000)

    snippetRoutes = rows.map((s) => ({
      url: `${APP_URL}${snippetPath(s.id, s.title)}`,
      lastModified: s.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.8,
    }))
  } catch (error) {
    console.error("sitemap: failed to load snippets:", error)
  }

  return [
    ...labRoutes,
    ...marketplaceRoutes,
    ...staticRoutes,
    ...languageRoutes,
    ...snippetRoutes,
  ]
}