import { db } from "@/db"
import { sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const results: string[] = []

  try {
    await db.execute(sql.raw(`CREATE TABLE IF NOT EXISTS "password_resets" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "email" text NOT NULL, "token" text NOT NULL UNIQUE, "used" boolean DEFAULT false NOT NULL, "expires_at" timestamp NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL)`))
    results.push("password_resets OK")
  } catch (e) {
    results.push(`password_resets ERROR: ${e instanceof Error ? e.message.slice(0,200) : e}`)
  }

  try {
    await db.execute(sql.raw(`CREATE TABLE IF NOT EXISTS "profiles" ("user_id" uuid PRIMARY KEY NOT NULL, "bio" text, "website" text, "github" text, "twitter" text, "total_sales" integer DEFAULT 0 NOT NULL, "rating" integer DEFAULT 0 NOT NULL, "updated_at" timestamp DEFAULT now() NOT NULL)`))
    results.push("profiles OK")
  } catch (e) {
    results.push(`profiles ERROR: ${e instanceof Error ? e.message.slice(0,200) : e}`)
  }

  try {
    await db.execute(sql.raw(`CREATE TABLE IF NOT EXISTS "reviews" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "snippet_id" uuid NOT NULL, "user_id" uuid NOT NULL, "rating" integer NOT NULL, "comment" text, "created_at" timestamp DEFAULT now() NOT NULL)`))
    results.push("reviews OK")
  } catch (e) {
    results.push(`reviews ERROR: ${e instanceof Error ? e.message.slice(0,200) : e}`)
  }

  try {
    await db.execute(sql.raw(`CREATE TABLE IF NOT EXISTS "versions" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "snippet_id" uuid NOT NULL, "version_number" integer NOT NULL, "changelog" text, "file_path" text NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL)`))
    results.push("versions OK")
  } catch (e) {
    results.push(`versions ERROR: ${e instanceof Error ? e.message.slice(0,200) : e}`)
  }

  try {
    await db.execute(sql.raw(`CREATE TABLE IF NOT EXISTS "wishlists" ("user_id" uuid NOT NULL, "snippet_id" uuid NOT NULL, "wished_price" integer NOT NULL, "last_notified_price" integer, "created_at" timestamp DEFAULT now() NOT NULL, "updated_at" timestamp DEFAULT now() NOT NULL, PRIMARY KEY("user_id","snippet_id"))`))
    results.push("wishlists OK")
  } catch (e) {
    results.push(`wishlists ERROR: ${e instanceof Error ? e.message.slice(0,200) : e}`)
  }

  return NextResponse.json({ results })
}
