import { db } from "@/db"
import { premiumVetting, verifiedBadges, users } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { verificationType, documents } = await req.json()

  if (!verificationType || !documents) {
    return NextResponse.json({ error: "Verification type and documents are required" }, { status: 400 })
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

    // Check if user already has a pending or approved verification
    const existingVetting = await db
      .select()
      .from(premiumVetting)
      .where(eq(premiumVetting.userId, user.id))
      .limit(1)

    if (existingVetting[0] && existingVetting[0].status !== "rejected") {
      return NextResponse.json(
        { error: "You already have a pending or approved verification" },
        { status: 400 }
      )
    }

    const [vetting] = await db
      .insert(premiumVetting)
      .values({
        userId: user.id,
        verificationType,
        documents,
        submissionDate: new Date(),
        status: "pending",
      })
      .returning()

    return NextResponse.json(vetting)
  } catch (error) {
    console.error("Error creating premium vetting submission:", error)
    return NextResponse.json({ error: "Failed to create premium vetting submission" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  try {
    let query = db
      .select({
        id: premiumVetting.id,
        userId: premiumVetting.userId,
        status: premiumVetting.status,
        verificationType: premiumVetting.verificationType,
        submissionDate: premiumVetting.submissionDate,
        reviewDate: premiumVetting.reviewDate,
        notes: premiumVetting.notes,
        completedAt: premiumVetting.completedAt,
      })
      .from(premiumVetting)

    if (status) {
      query = query.where(eq(premiumVetting.status, status))
    }

    const vettings = await query

    return NextResponse.json(vettings)
  } catch (error) {
    console.error("Error fetching premium vettings:", error)
    return NextResponse.json({ error: "Failed to fetch premium vettings" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { vettingId, action, reviewerNotes } = await req.json()

  if (!vettingId || !action) {
    return NextResponse.json({ error: "Vetting ID and action are required" }, { status: 400 })
  }

  try {
    const vetting = await db
      .select()
      .from(premiumVetting)
      .where(eq(premiumVetting.id, vettingId))
      .limit(1)

    if (!vetting[0]) {
      return NextResponse.json({ error: "Vetting not found" }, { status: 404 })
    }

    if (action === "approve") {
      await db
        .update(premiumVetting)
        .set({
          status: "approved",
          reviewDate: new Date(),
          reviewerId: user.id,
          notes: reviewerNotes,
          completedAt: new Date(),
        })\n        .where(eq(premiumVetting.id, vettingId))

      // Create verified badge
      const badgeType = vetting[0].verificationType === "business" ? "verified_seller" : "expert"
      await db.insert(verifiedBadges).values({
        userId: vetting[0].userId,
        badgeType,
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        issuerId: user.id,
        requirements: {
          verificationType: vetting[0].verificationType,
          documents: vetting[0].documents,
        },
      })

      return NextResponse.json({ success: true })
    }

    if (action === "reject") {
      await db
        .update(premiumVetting)
        .set({
          status: "rejected",
          reviewDate: new Date(),
          reviewerId: user.id,
          notes: reviewerNotes,
        })\n        .where(eq(premiumVetting.id, vettingId))

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating premium vetting:", error)
    return NextResponse.json({ error: "Failed to update premium vetting" }, { status: 500 })
  }
}