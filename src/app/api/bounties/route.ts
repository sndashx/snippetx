import { db } from "@/db"
import { snippets, users, orders, reviews } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { eq, and, or, like, desc } from "drizzle-orm"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { APP_URL } from "@/lib/constants"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const {
    title,
    description,
    language,
    budget,
    deadline,
    requirements,
    tags,
    snippetFile,
    previewImage,
  } = await req.json()

  if (!title || !description || !language || !budget || !deadline || !requirements) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)

    if (!userRecord[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const bountyId = `bounty_${Date.now()}`

    const [bounty] = await db
      .insert(orders)
      .values({
        buyerId: user.id,
        sellerId: user.id, // Bounty creator is also the seller for their own bounty
        snippetId: null, // Will be set after snippet is uploaded
        amount: budget,
        platformFee: Math.round(budget * 0.1), // 10% platform fee for bounties
        status: "open",
        stripeSessionId: null,
        stripePaymentIntentId: null,
        downloadUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json({
      id: bounty.id,
      title,
      description,
      language,
      budget,
      deadline,
      requirements,
      tags,
      status: "open",
      createdAt: bounty.createdAt,
    })
  } catch (error) {
    console.error("Error creating bounty:", error)
    return NextResponse.json({ error: "Failed to create bounty" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") || "open"
  const language = searchParams.get("language")
  const minBudget = searchParams.get("minBudget")
  const maxBudget = searchParams.get("maxBudget")

  try {
    let query = db
      .select({
        id: orders.id,
        title: snippets.title,
        description: snippets.description,
        language: snippets.language,
        budget: orders.amount,
        deadline: orders.createdAt,
        requirements: snippets.tags,
        status: orders.status,
        buyerId: orders.buyerId,
        sellerId: orders.sellerId,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .innerJoin(snippets, eq(orders.snippetId, snippets.id))
      .where(eq(orders.status, status))

    if (language) {
      query = query.where(eq(snippets.language, language))
    }

    if (minBudget) {
      query = query.where(eq(orders.amount, parseInt(minBudget)))
    }

    if (maxBudget) {
      query = query.where(eq(orders.amount, parseInt(maxBudget)))
    }

    const bounties = await query.orderBy(desc(orders.createdAt))

    return NextResponse.json(bounties)
  } catch (error) {
    console.error("Error fetching bounties:", error)
    return NextResponse.json({ error: "Failed to fetch bounties" }, { status: 500 })
  }
}