import { NextResponse } from "next/server"
import { Pool } from "pg"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 })
  }

  // Use a Pool with the same DATABASE_URL that drizzle uses
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Force IPv4 to avoid DNS resolution issues
    ssl: false,
  })

  const results: string[] = []

  try {
    // Test connection first
    const testResult = await pool.query("SELECT 1 as test")
    results.push(`db connected: ${JSON.stringify(testResult.rows)}`)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    results.push(`connection test failed: ${message}`)
    await pool.end()
    return NextResponse.json({ results })
  }

  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS "password_resets" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "email" text NOT NULL, "token" text NOT NULL, "used" boolean DEFAULT false NOT NULL, "expires_at" timestamp NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL)`)
    results.push("password_resets table created")
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    results.push(`password_resets error: ${message}`)
  }

  try {
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS "password_resets_token_idx" ON "password_resets" ("token")`)
    results.push("token index created")
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    results.push(`token index: ${message}`)
  }

  await pool.end()
  return NextResponse.json({ results })
}
