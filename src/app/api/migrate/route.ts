import { NextResponse } from "next/server"
import { Pool } from "pg"

export const dynamic = "force-dynamic"

const migrationSql = `
CREATE TABLE IF NOT EXISTS "password_resets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "token" text NOT NULL,
  "used" boolean DEFAULT false NOT NULL,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "password_resets_token_unique" UNIQUE("token")
);

CREATE TABLE IF NOT EXISTS "profiles" (
  "user_id" uuid PRIMARY KEY NOT NULL,
  "bio" text,
  "website" text,
  "github" text,
  "twitter" text,
  "total_sales" integer DEFAULT 0 NOT NULL,
  "rating" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "snippet_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "rating" integer NOT NULL,
  "comment" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "versions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "snippet_id" uuid NOT NULL,
  "version_number" integer NOT NULL,
  "changelog" text,
  "file_path" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "wishlists" (
  "user_id" uuid NOT NULL,
  "snippet_id" uuid NOT NULL,
  "wished_price" integer NOT NULL,
  "last_notified_price" integer,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "wishlists_user_id_snippet_id_pk" PRIMARY KEY("user_id","snippet_id")
);
`

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 })
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const results: string[] = []

  try {
    // Run each statement separately
    const statements = migrationSql.split(";").filter(s => s.trim())

    for (const stmt of statements) {
      try {
        await pool.query(stmt + ";")
        const label = stmt.trim().split("\n")[0].replace('CREATE TABLE IF NOT EXISTS "', "").replace('"', "")
        results.push(`${label}: OK`)
      } catch (e) {
        results.push(`ERROR: ${e instanceof Error ? e.message.slice(0, 100) : e}`)
      }
    }

    // Add FKs
    const fkStatements = [
      `ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;`,
      `ALTER TABLE "reviews" ADD CONSTRAINT "reviews_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE no action ON UPDATE no action;`,
      `ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;`,
      `ALTER TABLE "versions" ADD CONSTRAINT "versions_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE no action ON UPDATE no action;`,
      `ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;`,
      `ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE no action ON UPDATE no action;`,
    ]

    for (const stmt of fkStatements) {
      try {
        await pool.query(stmt)
        const label = stmt.match(/CONSTRAINT "(\w+)"/)?.[1] || "fk"
        results.push(`${label}: OK`)
      } catch (e) {
        // FKs may already exist
        results.push(`${stmt.match(/CONSTRAINT "(\w+)"/)?.[1] || "fk"}: ${e instanceof Error ? e.message.slice(0, 100) : e}`)
      }
    }

    return NextResponse.json({ results })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  } finally {
    await pool.end()
  }
}
