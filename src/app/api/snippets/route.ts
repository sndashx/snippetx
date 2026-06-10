import { db } from "@/db"
import { snippets, users } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { uploadSnippet } from "@/lib/r2"
import { and, desc, eq, sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lang = searchParams.get("lang")
  const featured = searchParams.get("featured")
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)

  const conditions = []
  if (lang) {
    conditions.push(eq(snippets.language, lang))
  }
  if (featured === "true") {
    conditions.push(eq(snippets.featured, true))
  }

  try {
    const allSnippets = await db
      .select({
        id: snippets.id,
        title: snippets.title,
        description: snippets.description,
        price: snippets.price,
        language: snippets.language,
        author: users.displayName,
        featured: snippets.featured,
        createdAt: snippets.createdAt,
      })
      .from(snippets)
      .innerJoin(users, eq(snippets.sellerId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(snippets.createdAt))
      .limit(limit)

    return NextResponse.json(allSnippets)
  } catch (error) {
    console.error("Failed to fetch snippets:", error)
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let title: string
  let description: string
  let price: number
  let language: string
  let filePath: string | undefined

  const contentType = req.headers.get("content-type") || ""

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData()
    title = form.get("title") as string
    description = form.get("description") as string
    price = Number(form.get("price"))
    language = form.get("language") as string

    const file = form.get("file") as File | null
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
      const key = `snippets/${user.id}/${timestamp}-${safeName}`
      await uploadSnippet(key, buffer, file.type || "application/octet-stream")
      filePath = key
    }
  } else {
    const body = await req.json()
    title = body.title
    description = body.description
    price = body.price
    language = body.language

    // Accept raw file content in body
    if (body.fileContent && body.fileName) {
      const buffer = Buffer.from(body.fileContent, "base64")
      const timestamp = Date.now()
      const safeName = body.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
      const key = `snippets/${user.id}/${timestamp}-${safeName}`
      await uploadSnippet(key, buffer, body.fileType || "application/octet-stream")
      filePath = key
    }
  }

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

  // Use provided filePath or generate a placeholder
  const snippetFilePath = filePath || `snippets/${user.id}/${Date.now()}-${title.toLowerCase().replace(/\s+/g, "-")}`

  const [snippet] = await db
    .insert(snippets)
    .values({
      sellerId: user.id,
      title,
      description,
      price,
      language,
      filePath: snippetFilePath,
    })
    .returning()

  return NextResponse.json({ id: snippet.id })
}
