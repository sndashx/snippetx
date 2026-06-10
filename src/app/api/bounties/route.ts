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
    const bountyList = await db
      .select()
      .from(bounties)
      .where(whereClause)
      .orderBy(desc(bounties.createdAt))

    // Get creator info for each bounty
    const bountiesWithCreators = await Promise.all(
      bountyList.map(async (bounty) => {
        const [creator] = await db
          .select({ displayName: users.displayName, email: users.email })
          .from(users)
          .where(eq(users.id, bounty.creatorId))
          .limit(1)

        return {
          ...bounty,
          creator: creator?.displayName || creator?.email.split("@")[0] || "Unknown",
          budget: bounty.budget / 100, // Convert to dollars
        }
      })
    )

    return NextResponse.json(bountiesWithCreators)
  } catch (error) {
    console.error("Error fetching bounties:", error)
    return NextResponse.json({ error: "Failed to fetch bounties" }, { status: 500 })
  }
}