// Standalone seed script that bypasses Next.js API routes
// Seeds the DB with platform user and snippets
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import pkg from "pg";
const { Client } = pkg;
import * as schema from "../src/db/schema.ts";
import { createServerClient } from "@supabase/ssr";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://snippetx:local-dev-2024@localhost:5432/snippetx";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://evqulhegalbwezzrkbxp.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Platform user
const PLATFORM_EMAIL = "site@sn-x.com";
const PLATFORM_PASSWORD = "platform-sn-x-2026";
const PLATFORM_DISPLAY_NAME = "Sn-x.com";

// Seed snippets data
const SEED_CONTENTS = [
  {
    title: "React Hook Form Validation Kit",
    description: "Reusable form validation schemas and components for React Hook Form + Zod.",
    language: "TypeScript", price: 1200,
    content: `import { z } from "zod"\n\nexport const emailSchema = z.string().min(1, "Email is required").email("Invalid email")\nexport const passwordSchema = z.string().min(8, "Must be at least 8 characters").max(128)\nexport const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Required") })`,
  },
  {
    title: "Auth Middleware Suite",
    description: "Pre-built authentication middleware for Express/Fastify with JWT & OAuth support.",
    language: "JavaScript", price: 1900,
    content: `function generateTokens(payload, secret, refreshSecret) {\n  const accessToken = jwt.sign(payload, secret, { expiresIn: "15m" })\n  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "7d" })\n  return { accessToken, refreshToken }\n}`,
  },
  {
    title: "Tailwind Component Library",
    description: "60+ responsive UI components built with Tailwind CSS v4 and shadcn/ui.",
    language: "TypeScript", price: 2900,
    content: `export function Button({ variant = "default", size = "default", ...props }) {\n  return <button className={buttonVariants({ variant, size })} {...props} />\n}`,
  },
  {
    title: "Python Data Pipeline",
    description: "Production-ready ETL pipeline framework with parallel processing.",
    language: "Python", price: 2400,
    content: `@dataclass\nclass PipelineContext:\n    config: dict[str, Any] = field(default_factory=dict)\n    metrics: dict[str, int] = field(default_factory=lambda: {"extracted": 0, "transformed": 0, "loaded": 0})`,
  },
  {
    title: "Go API Starter",
    description: "Clean REST API boilerplate in Go with routing, middleware, PostgreSQL integration.",
    language: "Go", price: 1500,
    content: `package main\n\nimport (\n    "encoding/json"\n    "net/http"\n)\n\nfunc main() {\n    mux := http.NewServeMux()\n    mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {\n        json.NewEncoder(w).Encode(map[string]string{"status": "ok"})\n    })\n    http.ListenAndServe(":8080", mux)\n}`,
  },
];

async function main() {
  console.log("Connecting to DB...");
  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool, { schema });

  // Delete existing data
  console.log("Clearing existing data...");
  await db.delete(schema.versions);
  await db.delete(schema.reviews);
  await db.delete(schema.wishlists);
  await db.delete(schema.orders);
  await db.delete(schema.snippets);
  await db.delete(schema.profiles);
  await db.delete(schema.users);

  // Create platform user via Supabase Auth
  console.log("Creating platform user in Supabase Auth...");
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });

  const { data, error } = await supabase.auth.admin.createUser({
    email: PLATFORM_EMAIL,
    password: PLATFORM_PASSWORD,
    email_confirm: true,
    user_metadata: { display_name: PLATFORM_DISPLAY_NAME },
  });

  if (error) {
    // User might already exist - try to find them
    console.log("Create user failed:", error.message);
    console.log("Trying to find existing user...");
    const { data: users_data, error: list_err } = await supabase.auth.admin.listUsers();
    if (list_err) throw list_err;
    const existing = users_data.users.find(u => u.email === PLATFORM_EMAIL);
    if (!existing) throw new Error("Platform user doesn't exist and can't be created");
    data.user = existing;
    console.log("Found existing platform user:", existing.id);
  }

  const platformUserId = data.user.id;
  console.log("Platform user ID:", platformUserId);

  // Insert into public users table
  await db.insert(schema.users).values({
    id: platformUserId,
    email: PLATFORM_EMAIL,
    displayName: PLATFORM_DISPLAY_NAME,
  });

  // Create snippets (without R2 - just use local file paths for seeded data)
  const created = [];
  for (const seed of SEED_CONTENTS) {
    const key = `snippets/${platformUserId}/seed-${Date.now()}-${seed.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    
    const [snippet] = await db.insert(schema.snippets).values({
      sellerId: platformUserId,
      title: seed.title,
      description: seed.description,
      language: seed.language,
      price: seed.price,
      filePath: key,
      fileSize: Buffer.byteLength(seed.content, "utf-8"),
    }).returning();

    created.push({ title: snippet.title, id: snippet.id });
    console.log(`  Created snippet: ${snippet.title} ($${(seed.price / 100).toFixed(2)})`);
  }

  await pool.end();
  console.log(`\n✅ Seed complete! Created ${created.length} snippets.`);
  console.log(`\nPlatform credentials:`);
  console.log(`  Email:    ${PLATFORM_EMAIL}`);
  console.log(`  Password: ${PLATFORM_PASSWORD}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
