import { sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/node-postgres"

export async function setupDatabase(url: string) {
  const pool = new (await import("pg")).Pool({ connectionString: url })
  const db = drizzle(pool)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" text PRIMARY KEY,
      "email" text NOT NULL UNIQUE,
      "stripe_account_id" text,
      "created_at" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "snippets" (
      "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      "seller_id" text NOT NULL REFERENCES "users"("id"),
      "title" text NOT NULL,
      "description" text NOT NULL,
      "price" integer NOT NULL,
      "language" text NOT NULL,
      "file_path" text NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "orders" (
      "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      "buyer_id" text NOT NULL REFERENCES "users"("id"),
      "snippet_id" uuid NOT NULL REFERENCES "snippets"("id"),
      "amount" integer NOT NULL,
      "stripe_payment_intent_id" text NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    );
  `)

  await pool.end()
  console.log("Database schema created successfully!")
}
