#!/bin/bash
set -e

# Stripe Connect Setup Script
# Usage: ./scripts/setup-stripe.sh <secret_key> <webhook_url>
# Get secret key from: https://dashboard.stripe.com/apikeys

SECRET_KEY="${1}"
WEBHOOK_URL="${2:-https://sn-x.com/api/webhooks/stripe}"

if [ -z "$SECRET_KEY" ]; then
  echo "Usage: $0 <stripe_secret_key> [webhook_url]"
  echo ""
  echo "Steps to get your Stripe secret key:"
  echo "1. Go to https://dashboard.stripe.com/apikeys"
  echo "2. Copy your Secret key (starts with sk_test_ or sk_live_)"
  echo "3. Pass it as the first argument"
  echo ""
  echo "Also ensure Stripe Connect is enabled:"
  echo "1. Go to https://dashboard.stripe.com/connect/onboarding"
  echo "2. Complete the onboarding if not done"
  exit 1
fi

echo "=== Setting up Stripe ==="

# Verify the key works
echo "Verifying API key..."
ACCOUNT=$(curl -s "https://api.stripe.com/v1/account" \
  -u "${SECRET_KEY}:" 2>/dev/null)

ACCOUNT_ID=$(echo "$ACCOUNT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "")

if [ -z "$ACCOUNT_ID" ]; then
  echo "ERROR: Invalid Stripe API key"
  echo "$ACCOUNT" | python3 -m json.tool 2>/dev/null || echo "$ACCOUNT"
  exit 1
fi

echo "Account ID: $ACCOUNT_ID"

# Check if Connect is enabled
if echo "$ACCOUNT" | python3 -c "import sys,json; d=json.load(sys.stdin); exit(0 if d.get('charges_enabled') else 1)" 2>/dev/null; then
  echo "Stripe Connect is enabled"
else
  echo "WARNING: Stripe Connect may not be fully enabled"
  echo "Please complete Connect onboarding at: https://dashboard.stripe.com/connect/onboarding"
fi

# Create webhook endpoint
echo "Creating webhook endpoint..."
WEBHOOK_RESULT=$(curl -s -X POST "https://api.stripe.com/v1/webhook_endpoints" \
  -u "${SECRET_KEY}:" \
  -d "url=${WEBHOOK_URL}" \
  -d "enabled_events[]=payment_intent.succeeded" \
  -d "enabled_events[]=payment_intent.payment_failed" \
  -d "enabled_events[]=checkout.session.completed" \
  -d "enabled_events[]=account.updated" \
  -d "enabled_events[]=account.external_account.created" 2>/dev/null)

WEBHOOK_SECRET=$(echo "$WEBHOOK_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('secret',''))" 2>/dev/null || echo "")

if [ -n "$WEBHOOK_SECRET" ]; then
  echo "Webhook created! Secret: $WEBHOOK_SECRET"
else
  echo "Could not create webhook automatically."
  echo "Create it manually at: https://dashboard.stripe.com/webhooks"
  echo "URL: $WEBHOOK_URL"
  echo "Events: payment_intent.succeeded, checkout.session.completed, account.updated"
  echo "Then copy the signing secret (whsec_...)"
  WEBHOOK_SECRET="REPLACE_WITH_WEBHOOK_SECRET"
fi

# Output results
echo ""
echo "=== Stripe Setup Complete ==="
echo "STRIPE_SECRET_KEY=$SECRET_KEY"
echo "STRIPE_WEBHOOK_SECRET=$WEBHOOK_SECRET"
echo ""

# Write to .env.local
ENV_FILE="$(dirname "$0")/../.env.local"
if [ -f "$ENV_FILE" ]; then
  sed -i "s|^STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=$SECRET_KEY|" "$ENV_FILE"
  sed -i "s|^STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=$WEBHOOK_SECRET|" "$ENV_FILE"
  echo "Updated .env.local with Stripe credentials"
fi
