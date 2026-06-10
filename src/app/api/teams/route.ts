import { db } from "@/db"
import { teams, teamMembers, teamSubscriptions, users } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { eq, and } from "drizzle-orm"
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

  const { name, description, subscriptionPlan = "pro" } = await req.json()

  if (!name) {
    return NextResponse.json({ error: "Team name is required" }, { status: 400 })
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/--+/g, "-")

  try {
    const [newTeam] = await db
      .insert(teams)
      .values({
        name,
        slug,
        description,
        ownerId: user.id,
        subscriptionPlan,
        subscriptionStatus: "trial",
        subscriptionExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        maxMembers: subscriptionPlan === "enterprise" ? 50 : subscriptionPlan === "pro" ? 10 : 5,
        maxSnippets: subscriptionPlan === "enterprise" ? 500 : subscriptionPlan === "pro" ? 100 : 50,
        maxStorage: subscriptionPlan === "enterprise" ? 102400 : subscriptionPlan === "pro" ? 20480 : 10240,
        monthlyPrice: subscriptionPlan === "enterprise" ? 9999 : subscriptionPlan === "pro" ? 2999 : 999,
      })
      .returning()

    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      userId: user.id,
      role: "owner",
    })

    return NextResponse.json(newTeam)
  } catch (error) {
    console.error("Error creating team:", error)
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
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

  try {
    const userTeams = await db
      .select({ team: teams })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(teamMembers.userId, user.id))

    return NextResponse.json(userTeams.map((ut) => ut.team))
  } catch (error) {
    console.error("Error fetching teams:", error)
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
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

  const { teamId, action, memberId } = await req.json()

  if (!teamId || !action) {
    return NextResponse.json({ error: "Team ID and action are required" }, { status: 400 })
  }

  try {
    const team = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1)

    if (!team[0]) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    if (team[0].ownerId !== user.id) {
      return NextResponse.json({ error: "Only team owners can manage team settings" }, { status: 403 })
    }

    if (action === "upgrade") {
      const { plan } = await req.json()
      await db
        .update(teams)
        .set({
          subscriptionPlan: plan,
          subscriptionStatus: "active",
          subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          maxMembers: plan === "enterprise" ? 50 : plan === "pro" ? 10 : 5,
          maxSnippets: plan === "enterprise" ? 500 : plan === "pro" ? 100 : 50,
          maxStorage: plan === "enterprise" ? 102400 : plan === "pro" ? 20480 : 10240,
          monthlyPrice: plan === "enterprise" ? 9999 : plan === "pro" ? 2999 : 999,
          updatedAt: new Date(),
        })
        .where(eq(teams.id, teamId))

      return NextResponse.json({ success: true })
    }

    if (action === "add_member" && memberId) {
      const member = await db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.id, memberId))
        .limit(1)

      if (!member[0]) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 })
      }

      await db.insert(teamMembers).values({
        teamId,
        userId: member[0].userId,
        role: "member",
      })

      return NextResponse.json({ success: true })
    }

    if (action === "remove_member" && memberId) {
      await db
        .delete(teamMembers)
        .where(and(eq(teamMembers.id, memberId), eq(teamMembers.teamId, teamId)))

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating team:", error)
    return NextResponse.json({ error: "Failed to update team" }, { status: 500 })
  }
}