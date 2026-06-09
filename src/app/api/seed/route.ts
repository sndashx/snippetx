import { db } from "@/db"
import { users, profiles, snippets, orders, reviews, wishlists, versions } from "@/db/schema"
import { createAdminClient } from "@/lib/supabase/server"
import { uploadSnippet } from "@/lib/r2"
import { sql } from "drizzle-orm"
import { NextResponse } from "next/server"

const PLATFORM_EMAIL = "site@sn-x.com"
const PLATFORM_PASSWORD = "platform-sn-x-2026"
const PLATFORM_DISPLAY_NAME = "Sn-x.com"

const SEED_SNIPPETS = [
  {
    title: "React Hook Form Validation Kit",
    description: "Reusable form validation schemas and components for React Hook Form + Zod. Includes email, password, credit card, phone number validators.",
    language: "TypeScript",
    price: 1200,
    fileName: "validation-kit.ts",
    content: 'import { z } from "zod"\n\nexport const emailSchema = z.string().min(1, "Email is required").email("Invalid email").transform((v) => v.toLowerCase().trim())\n\nexport const passwordSchema = z.string().min(8, "Must be at least 8 characters").max(128).regex(/[A-Z]/, "Need uppercase").regex(/[a-z]/, "Need lowercase").regex(/[0-9]/, "Need a number")\n\nexport const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Required") })\nexport type LoginInput = z.infer<typeof loginSchema>',
  },
  {
    title: "Auth Middleware Suite",
    description: "Pre-built authentication middleware for Express/Fastify with JWT & OAuth support. Includes rate limiting, refresh token rotation, and RBAC.",
    language: "JavaScript",
    price: 1900,
    fileName: "auth-middleware.js",
    content: 'const jwt = require("jsonwebtoken")\n\nfunction generateTokens(payload, secret, refreshSecret) {\n  const accessToken = jwt.sign(payload, secret, { expiresIn: "15m" })\n  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "7d" })\n  return { accessToken, refreshToken }\n}\n\nfunction authenticate(secret) {\n  return (req, res, next) => {\n    const header = req.headers.authorization\n    if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" })\n    try { req.user = jwt.verify(header.split(" ")[1], secret); next() }\n    catch { return res.status(401).json({ error: "Invalid token" }) }\n  }\n}\n\nmodule.exports = { generateTokens, authenticate }',
  },
  {
    title: "Tailwind Component Library",
    description: "60+ responsive UI components built with Tailwind CSS v4 and shadcn/ui. Fully accessible, dark mode ready, with customizable design tokens.",
    language: "TypeScript",
    price: 2900,
    fileName: "component-library.tsx",
    content: 'import * as React from "react"\nimport { cva, type VariantProps } from "class-variance-authority"\n\nconst buttonVariants = cva("inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", {\n  variants: { variant: { default: "bg-primary text-primary-foreground hover:bg-primary/90", outline: "border border-input bg-background hover:bg-muted" }, size: { default: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" } },\n  defaultVariants: { variant: "default", size: "default" },\n})\n\nexport { buttonVariants }',
  },
  {
    title: "Python Data Pipeline",
    description: "Production-ready ETL pipeline framework with parallel processing, error handling, logging, and integration with S3, PostgreSQL, and REST APIs.",
    language: "Python",
    price: 2400,
    fileName: "data_pipeline.py",
    content: 'import json, logging\nfrom typing import Any, Callable, Generator\nfrom concurrent.futures import ThreadPoolExecutor, as_completed\nfrom dataclasses import dataclass, field\n\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger(__name__)\n\n@dataclass\nclass PipelineContext:\n    config: dict[str, Any] = field(default_factory=dict)\n    metrics: dict[str, int] = field(default_factory=lambda: {"extracted": 0, "transformed": 0, "loaded": 0})\n    errors: list[str] = field(default_factory=list)',
  },
  {
    title: "Go API Starter",
    description: "Clean REST API boilerplate in Go with routing, middleware, PostgreSQL integration, structured logging, graceful shutdown, and Docker support.",
    language: "Go",
    price: 1500,
    fileName: "api-starter.go",
    content: 'package main\n\nimport (\n    "context"\n    "encoding/json"\n    "log"\n    "net/http"\n    "os"\n    "os/signal"\n    "syscall"\n    "time"\n)\n\nfunc main() {\n    mux := http.NewServeMux()\n    mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {\n        json.NewEncoder(w).Encode(map[string]string{"status": "ok"})\n    })\n    srv := &http.Server{Addr: ":8080", Handler: mux}\n    go srv.ListenAndServe()\n    quit := make(chan os.Signal, 1)\n    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)\n    <-quit\n    srv.Shutdown(context.Background())\n}',
  },
  {
    title: "SQL Query Builder",
    description: "Lightweight SQL query builder for Node.js with SELECT, INSERT, UPDATE, DELETE, JOINs, and parameterized queries. Zero dependencies, under 200 lines.",
    language: "JavaScript",
    price: 800,
    fileName: "query-builder.js",
    content: 'class QueryBuilder {\n  constructor(table) { this.table = table; this._select = []; this._where = []; this._params = [] }\n  select(...cols) { this._select = cols.length ? cols : ["*"]; return this }\n  where(col, op, val) { if (val === undefined) { val = op; op = "=" }; this._where.push({ col, op, param: "$" + (this._params.length + 1) }); this._params.push(val); return this }\n  toSelect() {\n    let sql = "SELECT " + (this._select.length ? this._select.join(", ") : "*") + \' FROM "\' + this.table + \'"\'\n    if (this._where.length) sql += " WHERE " + this._where.map(w => \'"\' + this.table + \'"."\' + w.col + \'" \' + w.op + " " + w.param).join(" AND ")\n    return { sql, params: this._params }\n  }\n}\nfunction query(table) { return new QueryBuilder(table) }\nmodule.exports = { query, QueryBuilder }',
  },
]

export const dynamic = "force-dynamic"

export async function GET() {
  // 1. Delete existing data in FK-safe order
  await db.delete(versions)
  await db.delete(reviews)
  await db.delete(wishlists)
  await db.delete(orders)
  await db.delete(snippets)
  await db.delete(profiles)
  await db.delete(users)

  // 2. Create platform user in Supabase Auth
  const adminSupabase = await createAdminClient()
  const { data, error } = await adminSupabase.auth.admin.createUser({
    email: PLATFORM_EMAIL,
    password: PLATFORM_PASSWORD,
    email_confirm: true,
    user_metadata: { display_name: PLATFORM_DISPLAY_NAME },
  })

  if (error) {
    return NextResponse.json({ error: `Failed to create user: ${error.message}` }, { status: 500 })
  }

  // 3. Insert platform user into our DB
  await db.insert(users).values({
    id: data.user.id,
    email: PLATFORM_EMAIL,
    displayName: PLATFORM_DISPLAY_NAME,
  })

  const platformUserId = data.user.id

  // 4. Create snippets
  const created: { title: string; id: string }[] = []

  for (const seed of SEED_SNIPPETS) {
    try {
      const buffer = Buffer.from(seed.content, "utf-8")
      const timestamp = Date.now()
      const key = `snippets/${platformUserId}/${timestamp}-${seed.fileName}`

      await uploadSnippet(key, buffer, "text/plain")

      const [snippet] = await db.insert(snippets).values({
        sellerId: platformUserId,
        title: seed.title,
        description: seed.description,
        language: seed.language,
        price: seed.price,
        filePath: key,
      }).returning()

      created.push({ title: snippet.title, id: snippet.id })
    } catch (err) {
      console.error(`Failed to create "${seed.title}":`, err)
    }
  }

  return NextResponse.json({
    message: `Seed complete — created ${created.length} snippets`,
    platformUser: { id: platformUserId, email: PLATFORM_EMAIL, displayName: PLATFORM_DISPLAY_NAME },
    snippets: created,
  })
}
