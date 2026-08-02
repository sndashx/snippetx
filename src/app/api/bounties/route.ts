import { db } from "@/db"
import { bounties, users } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { eq, and, or, like, desc } from "drizzle-orm"
import { NextResponse } from "next/server"

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
  } = await req.json()

  // Validate required fields
  if (!title || !description || !language || !budget) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    // Create bounty
    const [bounty] = await db
      .insert(bounties)
      .values({
        creatorId: user.id,
        title,
        description,
        language,
        budget: Math.round(budget * 100), // Convert to cents
        deadline: deadline ? new Date(deadline) : null,
        status: "open",
      })
      .returning()

    return NextResponse.json({
      id: bounty.id,
      title: bounty.title,
      description: bounty.description,
      language: bounty.language,
      budget: bounty.budget / 100, // Convert back to dollars
      status: bounty.status,
      deadline: bounty.deadline,
      createdAt: bounty.createdAt,
    })
  } catch (error) {
    console.error("Error creating bounty:", error)
    return NextResponse.json({ error: "Failed to create bounty" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const language = searchParams.get("language")
  const status = searchParams.get("status") || "open"
  const search = searchParams.get("search")

  try {
    // Build query with filters
    const conditions = []
    if (language) {
      conditions.push(eq(bounties.language, language))
    }
    if (status) {
      conditions.push(eq(bounties.status, status))
    }
    if (search) {
      conditions.push(
        or(
          like(bounties.title, `%${search}%`),
          like(bounties.description, `%${search}%`)
        )
      )
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Single query with join to avoid N+1
    const bountyList = await db
      .select({
        id: bounties.id,
        title: bounties.title,
        description: bounties.description,
        language: bounties.language,
        budget: bounties.budget,
        status: bounties.status,
        deadline: bounties.deadline,
        createdAt: bounties.createdAt,
        creatorDisplayName: users.displayName,
        creatorEmail: users.email,
      })
      .from(bounties)
      .leftJoin(users, eq(bounties.creatorId, users.id))
      .where(whereClause)
      .orderBy(desc(bounties.createdAt))

    const bountiesWithCreators = bountyList.map((bounty) => ({
      id: bounty.id,
      title: bounty.title,
      description: bounty.description,
      language: bounty.language,
      budget: bounty.budget / 100, // Convert to dollars
      status: bounty.status,
      deadline: bounty.deadline,
      createdAt: bounty.createdAt,
      creator: bounty.creatorDisplayName || bounty.creatorEmail?.split("@")[0] || "Unknown",
    }))

    return NextResponse.json(bountiesWithCreators)
  } catch (error) {
    console.error("Error fetching bounties:", error)
    return NextResponse.json({ error: "Failed to fetch bounties" }, { status: 500 })
  }
}