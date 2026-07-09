# minimax — Frontier Agentic Intelligence

**minimax** is a small AI research lab building agentic language models.
Our flagship model is **minimax M3** — a frontier agentic system with
deliberative reasoning, native tool-use, and a one-million-token context
window.

This repository hosts the public lab website (marketing, research, model
documentation, playground) and the legacy SnippetX marketplace + CLI/API
runtime that funds the lab.

> If you only came for the model — start at
> <https://minimax.dev/model>. If you came for the marketplace or CLI,
> jump to **CLI Tool (snippetx)** below.

## Repository Layout

```
src/
  app/
    page.tsx                # Lab homepage — hero, capabilities, research
    model/                  # /model — flagship model page
    research/               # /research — papers, posts, releases
    playground/             # /playground — streaming chat UI
    (marketplace)/          # Legacy marketplace (browse, sell, snippets)
    api/                    # API routes (checkout, webhooks, auth, playground)
  components/
    marketing/              # Lab-site sections + reveal-on-scroll primitive
    visual/                 # Shared visual primitives (aurora, glow, marquee)
  lib/
    brand.ts                # Single source of truth for lab copy + tokens
    metadata.ts             # buildMetadata() helper for every route
    seo.ts                  # Snippet slugs, JSON-LD, canonical helpers
  content/                  # Lab research artifacts (papers, posts)
```

## Lab Website

The public-facing site at `/`, `/model`, `/research`, and `/playground`
is built around a strict component contract:

- **Brand tokens** (`src/lib/brand.ts`) — single source of truth for
  lab name, model family, color tokens, fonts, and Open Graph metadata.
- **Metadata** (`src/lib/metadata.ts`) — every route uses the
  `buildMetadata()` factory so title, description, OpenGraph, Twitter
  card, and canonical URL stay consistent.
- **Motion** (`src/components/marketing/reveal.tsx`) — IntersectionObserver
  reveal-on-scroll primitive with `--delay` CSS variable for staggered
  children. Respects `prefers-reduced-motion`.
- **Discovery** — `src/app/sitemap.ts` enumerates lab + marketplace
  routes; `src/app/robots.ts` allows the lab site and disallows admin,
  auth, and API paths.

### Adding a route

1. Create `src/app/<route>/page.tsx`.
2. Add `export const metadata: Metadata = buildMetadata({ title, description, path })`.
3. Register the route in `src/app/sitemap.ts` (`LAB_ROUTES`).
4. If the page needs entrance motion, wrap headings/cards in
   `<Reveal delay={n}>` from `@/components/marketing/reveal` — staggered
   children just pass `delay={i * 80}`.

## Marketplace (Legacy)

The SnippetX marketplace — auth, snippet listings, Stripe Connect
checkout, R2 storage, Resend email — still ships under
`src/app/(marketplace)` and `src/app/api`. It is the commercial side
of the lab: every purchase funds compute for the next model release.

## Features

### CLI Tool (snippetx)

The CLI tool provides instant snippet installation from the marketplace:

#### Installation
```bash
npm install -g snippetx-cli
```

#### Commands

**Install a snippet:**
```bash
snippetx install <snippet-id>
```

**List available snippets:**
```bash
snippetx list
```

**Login to marketplace:**
```bash
snippetx login
```

#### Usage Examples

```bash
# Install a specific snippet
snippetx install react-hooks-useState

# List all available snippets
snippetx list

# Login with API token
snippetx login
```

### Team-Based Subscriptions (B2B SaaS)

### CLI Tool (snippetx)

The CLI tool provides instant snippet installation from the marketplace:

#### Installation
```bash
npm install -g snippetx-cli
```

#### Commands

**Install a snippet:**
```bash
snippetx install <snippet-id>
```

**List available snippets:**
```bash
snippetx list
```

**Login to marketplace:**
```bash
snippetx login
```

#### Usage Examples

```bash
# Install a specific snippet
snippetx install react-hooks-useState

# List all available snippets
snippetx list

# Login with API token
snippetx login
```

### Team-Based Subscriptions (B2B SaaS)

The team subscription system allows organizations to collaborate on snippet purchases and management:

#### Team Features

- **Multi-member teams** with role-based access (Owner, Admin, Member)
- **Subscription plans** with different limits:
  - **Free**: 5 members, 50 snippets, 10GB storage
  - **Pro**: 10 members, 100 snippets, 20GB storage ($29/month)
  - **Enterprise**: 50 members, 500 snippets, 100GB storage ($99/month)

#### Team Management API

```bash
# Create a new team
curl -X POST /api/teams \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Team", "description": "Development team"}'

# Add members to team
curl -X PATCH /api/teams \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"teamId": "team_123", "action": "add_member", "memberId": "user_456"}'

# Upgrade team plan
curl -X PATCH /api/teams \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"teamId": "team_123", "action": "upgrade", "plan": "enterprise"}'
```

### Bounty System

The bounty system allows users to offer custom development projects:

#### Bounty Features

- **Custom project requests** with specific requirements
- **Budget-based bounties** with platform fee (10%)
- **Status tracking** (Open, In Progress, Completed, Canceled)
- **Language filtering** for targeted projects

#### Bounty API

```bash
# Create a new bounty
curl -X POST /api/bounties \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "React Component Library", "description": "Build a reusable React component library", "language": "typescript", "budget": 1000, "deadline": "2024-12-31", "requirements": ["TypeScript", "Tailwind CSS"]}'

# Get all open bounties
curl -X GET "/api/bounties?status=open&language=typescript"
```

### Premium Vetting System

The premium vetting system allows users to verify their identity and unlock premium features:

#### Verification Types

- **Identity Verification**: Personal identity verification
- **Business Verification**: Business credential verification
- **Portfolio Verification**: Work and expertise showcase

#### Premium Features

Verified users get:
- Higher visibility in search results
- Priority customer support
- Premium analytics access
- Access to enterprise features

#### Premium Vetting API

```bash
# Submit verification
curl -X POST /api/premium-vetting \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"verificationType": "business", "documents": ["https://example.com/doc1.pdf"]}'

# Get verification status
curl -X GET "/api/premium-vetting?status=pending"

# Approve/reject verification (admin only)
curl -X PATCH /api/premium-vetting \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"vettingId": "vetting_123", "action": "approve", "reviewerNotes": "All documents verified"}'
```

## API Reference

### Authentication

```bash
# Login
curl -X POST /api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Register
curl -X POST /api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password", "displayName": "User Name"}'
```

### Snippets

```bash
# Get all snippets
curl -X GET /api/snippets

# Get snippet by ID
curl -X GET /api/snippets/snippet_123

# Create snippet (authenticated)
curl -X POST /api/snippets \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Snippet", "description": "Description", "language": "typescript", "price": 999}'
```

### Checkout

```bash
# Create checkout session
curl -X POST /api/checkout \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"snippetId": "snippet_123"}'
```

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account
- Cloudflare R2 account
- Resend API key

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET=your_bucket_name
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=https://sn-x.com
```

### Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Project Structure

```
src/
  app/
    (auth)/
      login/page.tsx
      register/page.tsx
    (marketplace)/
      browse/page.tsx
      snippets/[id]/page.tsx
      sell/page.tsx
      sell/new/page.tsx
    api/
      auth/login/route.ts
      auth/register/route.ts
      checkout/route.ts
      snippets/route.ts
      teams/route.ts
      bounties/route.ts
      premium-vetting/route.ts
    layout.tsx
    page.tsx
  components/
    ui/                    # shadcn/ui components
    browse-client.tsx      # Client component for browsing snippets
    bounty-client.tsx      # Client component for bounty system
    premium-vetting-client.tsx # Client component for premium vetting
  db/
    schema.ts            # Database schema
    index.ts              # Database connection
  lib/
    constants.ts         # Application constants
    r2.ts                # Cloudflare R2 client
    resend.ts            # Resend email client
    stripe.ts            # Stripe client
    supabase/            # Supabase clients
    utils.ts             # Utility functions
  hooks/                # Custom React hooks
  proxy.ts              # Security headers
```

## Testing

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Running Tests

```bash
# Install test dependencies
npm install

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

The project uses Jest for testing with the following test patterns:

```typescript
// Unit tests for components
test("renders button correctly", () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole("button")).toBeInTheDocument()
})

// Integration tests for API routes
test("GET /api/snippets returns snippets", async () => {
  const response = await request(app, "GET", "/api/snippets")
  expect(response.status).toBe(200)
  expect(Array.isArray(response.body)).toBe(true)
})
```

### Test Categories

The tests are organized as follows:

#### API Tests

- `tests/teams.test.ts` - Tests for the Teams API endpoints
- `tests/bounties.test.ts` - Tests for the Bounties API endpoints  
- `tests/premium-vetting.test.ts` - Tests for the Premium Vetting API endpoints

#### Test Framework

The tests use:
- **Jest** - JavaScript testing framework
- **Supertest** - HTTP assertion library for testing API endpoints
- **Drizzle ORM** - Database testing utilities

### Running Tests

```bash
# Install test dependencies
npm install

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Environment

The tests use a test database that is automatically created and destroyed for each test run. This ensures that tests don't interfere with the production database.

### Test Examples

#### Teams API Test

```typescript
import request from 'supertest';
import { app } from '../src/app';
import { db } from '../src/db';
import { teams, teamMembers, users, snippets, orders } from '../src/db/schema';

describe('Teams API', () => {
  describe('POST /api/teams', () => {
    it('should create a new team', async () => {
      const user = await db.insert(users).values({
        id: 'user_123',
        email: 'test@example.com',
        displayName: 'Test User',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const response = await request(app)
        .post('/api/teams')
        .set('Authorization', `Bearer ${user[0].id}`)
        .send({
          name: 'Test Team',
          description: 'A test team',
          subscriptionPlan: 'pro',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Team');
      expect(response.body.description).toBe('A test team');
      expect(response.body.subscriptionPlan).toBe('pro');
      expect(response.body.subscriptionStatus).toBe('trial');
    });
  });
});
```

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

### Environment Variables for Production

Set the following environment variables in your Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLOUDFLARE_R2_ACCOUNT_ID`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Troubleshooting

### Common Issues

**Database Connection Error**

If you encounter database connection errors:

1. Verify your `DATABASE_URL` environment variable
2. Ensure your PostgreSQL server is running
3. Check if the database exists

**Stripe Payment Errors**

If you encounter Stripe payment errors:

1. Verify your `STRIPE_SECRET_KEY` environment variable
2. Ensure your Stripe account is configured for payments
3. Check webhook configuration

**Cloudflare R2 Errors**

If you encounter Cloudflare R2 errors:

1. Verify all R2 environment variables
2. Ensure your R2 bucket exists
3. Check access permissions

### Getting Help

For additional help:

- Check the [GitHub repository](https://github.com/your-repo/snippetx)
- Join the [Discord community](https://discord.gg/snippetx)
- Visit the [documentation website](https://docs.snippetx.com)

## License

This project is licensed under the MIT License.
