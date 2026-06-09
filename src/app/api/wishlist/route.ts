import { db } from "@/db"
import { wishlists, snippets } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { snippetId, price } = await req.json()

  if (!snippetId || typeof price !== "number" || price < 0) {
    return NextResponse.json({ error: "Invalid input. snippetId and price are required." }, { status: 400 })
  }

  try {
    const [existing] = await db
      .select()
      .from(wishlists)
      .where(and(eq(wishlists.userId, user.id), eq(wishlists.snippetId, snippetId)))
      .limit(1)

    if (existing) {
      return NextResponse.json({ message: "Already in wishlist" }, { status: 200 })
    }

    await db.insert(wishlists).values({
      userId: user.id,
      snippetId,
      wishedPrice: price,
    })

    return NextResponse.json({ message: "Added to wishlist" }, { status: 201 })
  } catch (error) {
    console.error("Failed to add to wishlist:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const snippetId = searchParams.get("snippetId")

  if (!snippetId) {
    return NextResponse.json({ error: "Missing snippetId parameter" }, { status: 400 })
  }

  try {
    await db
      .delete(wishlists)
      .where(and(eq(wishlists.userId, user.id), eq(wishlists.snippetId, snippetId)))

    return NextResponse.json({ message: "Removed from wishlist" }, { status: 200 })
  } catch (error) {
    console.error("Failed to remove from wishlist:", error)
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const snippetId = searchParams.get("snippetId")

  if (snippetId) {
    const [entry] = await db
      .select()
      .from(wishlists)
      .where(and(eq(wishlists.userId, user.id), eq(wishlists.snippetId, snippetId)))
      .limit(1)

    return NextResponse.json({ inWishlist: !!entry, entry: entry || null })
  }

  const items = await db
    .select({
      id: wishlists.snippetId,
      wishedPrice: wishlists.wishedPrice,
      createdAt: wishlists.createdAt,
      snippet: {
        title: snippets.title,
        price: snippets.price,
        language: snippets.language,
      },
    })
    .from(wishlists)
    .innerJoin(snippets, eq(wishlists.snippetId, snippets.id))
    .where(eq(wishlists.userId, user.id))
    .orderBy(desc(wishlists.createdAt))

  return NextResponse.json(items)
}
