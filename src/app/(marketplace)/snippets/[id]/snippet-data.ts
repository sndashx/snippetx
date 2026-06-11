import "server-only"
import { db } from "@/db"
import { snippets, users, reviews } from "@/db/schema"
import { eq, and, ne, sql, desc } from "drizzle-orm"

export type SnippetDetail = {
  id: string
  title: string
  description: string
  price: number
  language: string
  filePath: string
  author: string | null
  authorId: string
  authorJoined: Date
  createdAt: Date
  updatedAt: Date
  ratingAvg: number
  ratingCount: number
}

export type RelatedSnippet = {
  id: string
  title: string
  price: number
  language: string
  author: string | null
}

/** Fetch a single snippet + aggregated review stats. Returns null if missing. */
export async function getSnippet(id: string): Promise<SnippetDetail | null> {
  try {
    const results = await db
      .select({
        id: snippets.id,
        title: snippets.title,
        description: snippets.description,
        price: snippets.price,
        language: snippets.language,
        filePath: snippets.filePath,
        author: users.displayName,
        authorId: users.id,
        authorJoined: users.createdAt,
        createdAt: snippets.createdAt,
        updatedAt: snippets.updatedAt,
      })
      .from(snippets)
      .innerJoin(users, eq(snippets.sellerId, users.id))
      .where(eq(snippets.id, id))
      .limit(1)

    const row = results[0]
    if (!row) return null

    // Aggregate review rating
    let ratingAvg = 0
    let ratingCount = 0
    try {
      const [agg] = await db
        .select({
          avg: sql<number>`coalesce(avg(${reviews.rating}), 0)`,
          count: sql<number>`count(*)`,
        })
        .from(reviews)
        .where(eq(reviews.snippetId, id))
      ratingAvg = Number(agg?.avg ?? 0)
      ratingCount = Number(agg?.count ?? 0)
    } catch (e) {
      console.error("Failed to aggregate reviews:", e)
    }

    return { ...row, ratingAvg, ratingCount }
  } catch (error) {
    console.error("Failed to fetch snippet:", error)
    return null
  }
}

/** Related snippets: same language first, else most recent from same seller. */
export async function getRelatedSnippets(
  snippetId: string,
  language: string,
  sellerId: string,
): Promise<RelatedSnippet[]> {
  try {
    const sameLang = await db
      .select({
        id: snippets.id,
        title: snippets.title,
        price: snippets.price,
        language: snippets.language,
        author: users.displayName,
      })
      .from(snippets)
      .innerJoin(users, eq(snippets.sellerId, users.id))
      .where(and(eq(snippets.language, language), ne(snippets.id, snippetId)))
      .orderBy(desc(snippets.createdAt))
      .limit(4)

    if (sameLang.length >= 3) return sameLang.slice(0, 4)

    // Backfill with other snippets from the same seller
    const fromSeller = await db
      .select({
        id: snippets.id,
        title: snippets.title,
        price: snippets.price,
        language: snippets.language,
        author: users.displayName,
      })
      .from(snippets)
      .innerJoin(users, eq(snippets.sellerId, users.id))
      .where(and(eq(snippets.sellerId, sellerId), ne(snippets.id, snippetId)))
      .orderBy(desc(snippets.createdAt))
      .limit(4)

    const merged = [...sameLang]
    for (const s of fromSeller) {
      if (merged.length >= 4) break
      if (!merged.find((m) => m.id === s.id)) merged.push(s)
    }
    return merged
  } catch (error) {
    console.error("Failed to fetch related snippets:", error)
    return []
  }
}
