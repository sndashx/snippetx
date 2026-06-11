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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${APP_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${APP_URL}/browse`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${APP_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${APP_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${APP_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ]

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

  return [...staticRoutes, ...languageRoutes, ...snippetRoutes]
}
