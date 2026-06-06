#!/bin/bash
set -e

# SnippetX Master Setup Script
# Runs all setup scripts in sequence
# Usage: ./scripts/setup-all.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/.env.local"

echo "╔══════════════════════════════════════╗"
echo "║     SnippetX Infrastructure Setup    ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "This script will set up all services for sn-x.com"
echo "You'll need API keys from each service."
echo ""

# Create .env.local from template if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
  cp "$PROJECT_DIR/.env.example" "$ENV_FILE"
  echo "Created .env.local from template"
fi

# Set app URL
sed -i "s|^NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://sn-x.com|" "$ENV_FILE"

echo "╔══════════════════════════════════════╗"
echo "║  1/5  Neon Database                  ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Get your API key from: https://console.neon.tech/app/settings/api-keys"
read -p "Neon API key: " NEON_KEY
if [ -n "$NEON_KEY" ]; then
  bash "$SCRIPT_DIR/setup-neon.sh" "$NEON_KEY"
else
  echo "Skipped. Set DATABASE_URL manually in .env.local"
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  2/5  Supabase (Auth + Realtime)     ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Get your access token from: https://supabase.com/account/access-tokens"
read -p "Supabase access token: " SUPA_TOKEN
read -p "DB password (for Supabase): " SUPA_DB_PASS
if [ -n "$SUPA_TOKEN" ] && [ -n "$SUPA_DB_PASS" ]; then
  bash "$SCRIPT_DIR/setup-supabase.sh" "$SUPA_TOKEN" "snippetx" "$SUPA_DB_PASS"
else
  echo "Skipped. Set Supabase vars manually in .env.local"
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  3/5  Stripe (Payments + Connect)    ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Get your secret key from: https://dashboard.stripe.com/apikeys"
echo "(Make sure Stripe Connect is enabled first!)"
read -p "Stripe secret key: " STRIPE_KEY
if [ -n "$STRIPE_KEY" ]; then
  bash "$SCRIPT_DIR/setup-stripe.sh" "$STRIPE_KEY"
else
  echo "Skipped. Set Stripe vars manually in .env.local"
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  4/5  Cloudflare R2 (File Storage)   ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Get your API token from: https://dash.cloudflare.com/profile/api-tokens"
echo "Account ID from: https://dash.cloudflare.com/ (right sidebar)"
echo "(R2 must be enabled first!)"
read -p "Cloudflare API token: " CF_TOKEN
read -p "Cloudflare Account ID: " CF_ACCOUNT
if [ -n "$CF_TOKEN" ] && [ -n "$CF_ACCOUNT" ]; then
  bash "$SCRIPT_DIR/setup-r2.sh" "$CF_TOKEN" "$CF_ACCOUNT"
else
  echo "Skipped. Set R2 vars manually in .env.local"
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  5/5  Resend (Email)                 ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Get your API key from: https://resend.com/api-keys"
read -p "Resend API key: " RESEND_KEY
if [ -n "$RESEND_KEY" ]; then
  bash "$SCRIPT_DIR/setup-resend.sh" "$RESEND_KEY"
else
  echo "Skipped. Set RESEND_API_KEY manually in .env.local"
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  Pushing DB Schema                   ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Source env vars
set -a
source "$ENV_FILE"
set +a

if [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "postgresql://user:pass@ep-something.us-east-2.aws.neon.tech/snippetx" ]; then
  echo "Pushing schema to database..."
  cd "$PROJECT_DIR"
  npx drizzle-kit push 2>&1 || echo "Schema push failed. Run manually: npx drizzle-kit push"
else
  echo "DATABASE_URL not configured. Skipping schema push."
fi

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  Setting Vercel Environment Vars     ║"
echo "╚══════════════════════════════════════╝"
echo ""

cd "$PROJECT_DIR"
while IFS='=' read -r key value; do
  [[ "$key" =~ ^#.*$ ]] && continue
  [ -z "$key" ] && continue
  [ -z "$value" ] && continue
  echo "Setting $key..."
  echo "$value" | vercel env add "$key" production --yes 2>/dev/null || true
done < "$ENV_FILE"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  Deploying to Production             ║"
echo "╚══════════════════════════════════════╝"
echo ""

vercel --prod --yes 2>&1

echo ""
echo "╔══════════════════════════════════════╗"
echo "║         Setup Complete!              ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Site: https://sn-x.com"
echo "GitHub: https://github.com/sndashx/snippetx"
echo ""
echo "Next steps:"
echo "1. Verify the site works at https://sn-x.com"
echo "2. Test login/register flow"
echo "3. Create a test snippet"
echo "4. Test Stripe checkout"
