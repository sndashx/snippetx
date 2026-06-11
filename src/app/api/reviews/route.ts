import { db } from "@/db"
import { reviews, users, snippets, orders } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { NextResponse } from "next/server"
import { APP_URL } from "@/lib/constants"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${APP_URL}/login`)
  }

  const { snippetId, rating, comment } = await req.json()

  if (!snippetId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid input. Snippet ID and rating (1-5) are required." }, { status: 400 })
  }

  // Check if the user has purchased the snippet
  const existingOrder = await db
    .select()
    .from(orders) 
    .where(and(eq(orders.buyerId, user.id), eq(orders.snippetId, snippetId), eq(orders.status, "completed")))
    .limit(1)

  if (!existingOrder.length) {
    return NextResponse.json({ error: "You must purchase the snippet before reviewing it." }, { status: 403 })
  }

  try {
    const newReview = await db.insert(reviews).values({
      userId: user.id,
      snippetId: snippetId,
      rating: Number(rating),
      comment: comment || null,
    }).returning()

    // Optionally, update the snippet's average rating here or via a trigger/background job
    // await db.update(snippets).set() ...

    return NextResponse.json(newReview[0], { status: 201 })
  } catch (error: unknown) {
    console.error("Failed to create review:", error)
    if (error instanceof Error && "code" in error && (error as any).code === "23505") { 
      return NextResponse.json({ error: "You have already reviewed this snippet." }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const snippetId = searchParams.get("snippetId")

  if (!snippetId) {
    return NextResponse.json({ error: "Missing snippetId parameter" }, { status: 400 })
  }

  try {
    const dbReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          displayName: users.displayName,
          email: users.email,
          avatarUrl: users.avatarUrl,
        },
        snippet: {
          id: snippets.id,
          title: snippets.title,
        }
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .innerJoin(snippets, eq(reviews.snippetId, snippets.id))
      .where(eq(reviews.snippetId, snippetId))
      .orderBy(desc(reviews.createdAt)) // Show newest reviews first

    return NextResponse.json(dbReviews)
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${APP_URL}/login`)
  }

  const { searchParams } = new URL(req.url)
  const reviewId = searchParams.get("reviewId")

  if (!reviewId) {
    return NextResponse.json({ error: "Missing reviewId parameter" }, { status: 400 })
  }

  try {
    const result = await db
      .delete(reviews)
      .where(and(eq(reviews.id, reviewId), eq(reviews.userId, user.id))) // Basic check: user can only delete their own review
      .returning()

    if (result.length === 0) {
      // Check if the review exists but the user doesn't own it
      const existingReview = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);
      if (existingReview.length > 0 && existingReview[0].userId !== user.id) {
        return NextResponse.json({ error: "Not authorized to delete this review." }, { status: 403 });
      }
      return NextResponse.json({ error: "Review not found." }, { status: 404 })
    }

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}