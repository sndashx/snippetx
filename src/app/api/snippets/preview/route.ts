import { db } from "@/db"
import { snippets } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
    }

    const [snippet] = await db
      .select()
      .from(snippets)
      .where(eq(snippets.id, id))
      .limit(1)

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: snippet.filePath,
    })

    const response = await s3.send(command)
    const body = await response.Body?.transformToString()

    if (!body) {
      return NextResponse.json({ error: "Could not read file" }, { status: 500 })
    }

    return NextResponse.json({ code: body })
  } catch (err) {
    console.error("Preview error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
