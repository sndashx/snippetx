import { db } from "@/db"
import { users, passwordResets } from "@/db/schema"
import { eq, and, sql, isNull } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/server"

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = schema.parse(body)

    // Find valid token
    const [reset] = await db
      .select()
      .from(passwordResets)
      .where(
        and(
          eq(passwordResets.token, token),
          eq(passwordResets.used, false),
          sql`${passwordResets.expiresAt} > now()`,
        ),
      )
      .limit(1)

    if (!reset) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 })
    }

    // Find the user in our DB
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, reset.email))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update password via Supabase admin API
    const adminSupabase = await createAdminClient()
    const { error } = await adminSupabase.auth.admin.updateUserById(user.id, {
      password,
    })

    if (error) {
      console.error("Supabase update password error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Mark token as used
    await db
      .update(passwordResets)
      .set({ used: true })
      .where(eq(passwordResets.id, reset.id))

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }
    console.error("Reset password error:", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
