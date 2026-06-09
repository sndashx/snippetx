import { getDb } from "@/db"
import { sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const results: string[] = []

  // Access the underlying pg pool from drizzle through raw query
  try {
    const r = await getDb().execute(
      sql.raw(`CREATE TABLE IF NOT EXISTS "password_resets" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "email" text NOT NULL, "token" text NOT NULL, "used" boolean DEFAULT false NOT NULL, "expires_at" timestamp NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL)`)
    )
    results.push("password_resets OK: " + JSON.stringify(r))
  } catch (e: any) {
    results.push(`password_resets: ${e?.message || e}`)
  }

  try {
    await getDb().execute(
      sql.raw(`CREATE UNIQUE INDEX IF NOT EXISTS "password_resets_token_idx" ON "password_resets" ("token")`)
    )
    results.push("password_resets index OK")
  } catch (e: any) {
    results.push(`password_resets index: ${e?.message || e}`)
  }

  // test: try a simple query to verify DB works
  try {
    const r = await getDb().execute(sql`SELECT 1 as ok`)
    results.push("db test: " + JSON.stringify(r))
  } catch (e: any) {
    results.push(`db test: ${e?.message || e}`)
  }

  return NextResponse.json({ results })
}
