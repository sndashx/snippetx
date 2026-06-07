import { createClient, createAdminClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 })
  }

  const supabase = await createClient()
  const adminSupabase = await createAdminClient()

  const { data, error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    console.error("Supabase signup error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (data.user) {
    // Create user in our DB
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, data.user.id))
      .limit(1)

    if (!existingUser) {
      await db.insert(users).values({
        id: data.user.id,
        email: data.user.email!,
      })
    }
  }

  return NextResponse.json({ user: data.user })
}
