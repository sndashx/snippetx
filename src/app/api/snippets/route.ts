import { db } from "@/db"
import { snippets, users } from "@/db/schema"
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

  const { title, description, price, language } = await req.json()

  if (!title || !description || !price || !language) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Ensure user exists in our DB
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1)

  if (!existingUser) {
    await db.insert(users).values({
      id: user.id,
      email: user.email!,
    })
  }

  const [snippet] = await db
    .insert(snippets)
    .values({
      sellerId: user.id,
      title,
      description,
      price,
      language,
      filePath: `snippets/${user.id}/${Date.now()}-${title.toLowerCase().replace(/\s+/g, "-")}`,
    })
    .returning()

  return NextResponse.json({ id: snippet.id })
}
