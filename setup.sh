#!/bin/bash
set -e

echo "=== SnippetX Setup ==="
echo "This script configures all services for sn-x.com"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
  echo "Creating .env.local from template..."
  cp .env.example .env.local
fi

# Prompt for env vars if not set
prompt_env() {
  local var_name=$1
  local current_value=$(grep "^${var_name}=" .env.local 2>/dev/null | cut -d'=' -f2-)
  if [ -z "$current_value" ] || [[ "$current_value" == *"your-*" ]] || [[ "$current_value" == *"sk_test"* ]] || [[ "$current_value" == *"re_"* ]] || [[ "$current_value" == *"whsec_"* ]]; then
    read -p "Enter ${var_name}: " new_value
    if [ -n "$new_value" ]; then
      sed -i "s|^${var_name}=.*|${var_name}=${new_value}|" .env.local
      echo "  Set ${var_name}"
    fi
  else
    echo "  ${var_name} already configured"
  fi
}

echo ""
echo "--- Database (Neon/PostgreSQL) ---"
prompt_env "DATABASE_URL"

echo ""
echo "--- Supabase ---"
prompt_env "NEXT_PUBLIC_SUPABASE_URL"
prompt_env "NEXT_PUBLIC_SUPABASE_ANON_KEY"
prompt_env "SUPABASE_SERVICE_ROLE_KEY"

echo ""
echo "--- Stripe ---"
prompt_env "STRIPE_SECRET_KEY"
prompt_env "STRIPE_WEBHOOK_SECRET"

echo ""
echo "--- Cloudflare R2 ---"
prompt_env "CLOUDFLARE_R2_ACCOUNT_ID"
prompt_env "CLOUDFLARE_R2_ACCESS_KEY_ID"
prompt_env "CLOUDFLARE_R2_SECRET_ACCESS_KEY"
prompt_env "CLOUDFLARE_R2_BUCKET"

echo ""
echo "--- Resend ---"
prompt_env "RESEND_API_KEY"

echo ""
echo "--- App ---"
prompt_env "NEXT_PUBLIC_APP_URL"

echo ""
echo "=== Pushing database schema ==="
npx drizzle-kit push

echo ""
echo "=== Setting Vercel env vars ==="
# Read all env vars from .env.local and set them in Vercel
while IFS='=' read -r key value; do
  # Skip comments and empty lines
  [[ "$key" =~ ^#.*$ ]] && continue
  [ -z "$key" ] && continue
  # Skip client-side vars (they need NEXT_PUBLIC prefix for Vercel)
  echo "Setting $key in Vercel..."
  echo "$value" | vercel env add "$key" production --yes 2>/dev/null || true
done < .env.local

echo ""
echo "=== Redeploying to Vercel ==="
vercel --prod --yes

echo ""
echo "=== Setup complete! ==="
echo "Site will be live at https://sn-x.com after DNS is configured"
