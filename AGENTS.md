# SnippetX — AGENTS.md

## Project

Code snippet marketplace (SnippetX / sn-x.com). Next.js 16 App Router, TypeScript, Tailwind CSS 4, Supabase, Drizzle ORM, Stripe Connect, Cloudflare R2, Resend.

**Before writing any Next.js code, read the bundled docs** at `node_modules/next/dist/docs/` for the exact version used (16.2.7). Training data may be stale.

## Next.js 16 Breaking Changes (from bundled docs)

- **Turbopack** is default for both `next dev` and `next build`. Do not pass `--turbopack` flag. No `webpack` config allowed unless you pass `--webpack`.
- **All Request APIs are fully async** — no sync fallback. `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` must be `await`ed.
  ```tsx
  // page.tsx — params and searchParams are Promises
  export default async function Page(props: PageProps<'/foo/[slug]'>) {
    const { slug } = await props.params
  }
  ```
- **`middleware` renamed to `proxy`** — file name and export. Runtime is Node.js only (edge not supported in proxy). If edge needed, keep using `middleware`.
- **`cacheLife` and `cacheTag` are stable** — import directly from `next/cache`, no `unstable_` prefix.
- **`revalidateTag` requires second argument** (a `cacheLife` profile like `'max'`). For immediate refresh use `updateTag` from `next/cache`.
- **`next/image` defaults changed** — `minimumCacheTTL` now 14400s (4h), `imageSizes` no longer includes `16`, `qualities` defaults to `[75]` only.

## Commands

```bash
npm run dev      # Next.js dev server (Turbopack)
npm run build    # Production build (Turbopack)
npm run lint     # ESLint (flat config)
```

## Project Layout

```
src/
  app/
    (auth)/
      login/page.tsx        # Email/password login
      register/page.tsx     # Email/password register
    (marketplace)/
      browse/page.tsx       # Browse all snippets (dynamic, force-dynamic)
      sell/page.tsx         # Seller dashboard (auth required)
      sell/new/page.tsx     # Upload new snippet form
      snippets/[id]/page.tsx # Snippet detail + purchase
    api/
      auth/login/route.ts   # POST login
      auth/register/route.ts # POST register
      checkout/route.ts     # POST create Stripe checkout session
      snippets/route.ts     # POST create snippet (auth required)
      webhooks/stripe/route.ts # Stripe webhook handler
    auth/callback/route.ts  # Supabase OAuth callback
    layout.tsx              # Root layout (Geist fonts, metadata for sn-x.com)
    page.tsx                # Landing page
    globals.css             # Tailwind v4 + shadcn theme
  components/ui/            # shadcn components (button, card, badge, etc.)
  db/
    schema.ts               # Drizzle schema: users, snippets, orders
    index.ts                # DB connection (lazy, throws if DATABASE_URL missing)
  lib/
    constants.ts            # APP_URL, PLATFORM_FEE_PERCENT
    r2.ts                   # Cloudflare R2 client (lazy)
    resend.ts               # Resend email client (lazy)
    stripe.ts               # Stripe client (lazy)
    supabase/
      client.ts             # Browser Supabase client
      server.ts             # Server Supabase client (reads cookies)
    utils.ts                # cn() helper from shadcn
  hooks/                    # Custom React hooks (empty, for future)
  proxy.ts                  # Security headers (Next.js 16 proxy)
```

## Key Patterns

### Lazy Service Initialization
All external service clients (Stripe, R2, Resend) use lazy Proxy initialization so the build doesn't fail when env vars are missing. Pattern:
```ts
let _client: Client | null = null
function getClient() {
  if (!_client) {
    if (!process.env.X) throw new Error("X is missing")
    _client = new Client({ ... })
  }
  return _client
}
export const client = new Proxy({} as Client, {
  get(_, prop) { return Reflect.get(getClient(), prop) },
})
```

### Dynamic Pages
Pages that query the DB or read cookies must export `dynamic = "force-dynamic"` to prevent static pre-rendering.

### shadcn/ui (Base UI variant)
This project uses shadcn v4 with the `base-nova` style (Base UI primitives). **No `asChild` prop on Button** — use `render` prop or wrap in Link styled as button instead.

### Stripe Connect Marketplace Flow
```
Buyer checkout → POST /api/checkout → Stripe Checkout Session
  → 25% application_fee_amount → platform Stripe account
  → 75% transfer_data.destination → seller's connected Stripe account
  → Webhook POST /api/webhooks/stripe → update order in DB → Resend email
  → Generate R2 presigned URL for download
```

## Dependencies

- **Auth**: Supabase Auth (email/password + OAuth) — `@supabase/ssr`
- **DB**: Drizzle ORM + PostgreSQL (`pg` + `drizzle-orm/node-postgres`)
- **UI**: shadcn/ui (Base UI variant) + Tailwind v4 + lucide-react icons
- **Payments**: Stripe Connect (Standard accounts) — `stripe`
- **Storage**: Cloudflare R2 (S3-compatible, zero egress) — `@aws-sdk/client-s3`
- **Email**: Resend — `resend`
- **Forms**: react-hook-form + zod
- **Data fetching**: TanStack React Query + Server Components

## Env Variables

Copy `.env.example` to `.env.local`. Required:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` (PostgreSQL/Neon connection string)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `CLOUDFLARE_R2_ACCOUNT_ID`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_BUCKET`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL` (https://sn-x.com)
