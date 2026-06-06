#!/bin/bash
set -e

# Resend Setup Script
# Usage: ./scripts/setup-resend.sh <api_key> [domain]
# Get API key from: https://resend.com/api-keys

API_KEY="${1}"
DOMAIN="${2:-sn-x.com}"

if [ -z "$API_KEY" ]; then
  echo "Usage: $0 <resend_api_key> [domain]"
  echo ""
  echo "Steps to get your Resend API key:"
  echo "1. Go to https://resend.com/api-keys"
  echo "2. Create a new API key"
  echo "3. Copy the key and pass it as the first argument"
  exit 1
fi

echo "=== Setting up Resend ==="

# Verify API key works
echo "Verifying API key..."
DOMAINS_RESULT=$(curl -s "https://api.resend.com/domains" \
  -H "Authorization: Bearer $API_KEY")

DOMAINS_SUCCESS=$(echo "$DOMAINS_RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print('data' in d or 'error' not in d)" 2>/dev/null || echo "False")

if [ "$DOMAINS_SUCCESS" = "False" ]; then
  echo "ERROR: Invalid Resend API key"
  echo "$DOMAINS_RESULT" | python3 -m json.tool 2>/dev/null || echo "$DOMAINS_RESULT"
  exit 1
fi

echo "API key verified!"

# Check if domain already exists
echo "Checking domain: $DOMAIN"
DOMAIN_ID=$(echo "$DOMAINS_RESULT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
domains = data.get('data', [])
for d in domains:
    if d.get('name') == '$DOMAIN':
        print(d.get('id', ''))
        break
" 2>/dev/null || echo "")

if [ -z "$DOMAIN_ID" ]; then
  echo "Domain not found. Creating domain: $DOMAIN"
  DOMAIN_RESULT=$(curl -s -X POST "https://api.resend.com/domains" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$DOMAIN\"}")
  
  DOMAIN_ID=$(echo "$DOMAIN_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('data',{}).get('id',''))" 2>/dev/null || echo "")
  
  if [ -n "$DOMAIN_ID" ]; then
    echo "Domain created! ID: $DOMAIN_ID"
    echo ""
    echo "IMPORTANT: You need to verify your domain. Add these DNS records:"
    echo ""
    echo "$DOMAIN_RESULT" | python3 -c "
import sys, json
data = json.load(sys.stdin).get('data', {})
records = data.get('records', [])
for r in records:
    print(f\"  Type: {r.get('record_type')}, Name: {r.get('name')}, Value: {r.get('value')}\")
" 2>/dev/null
    echo ""
    echo "After adding DNS records, verify with:"
    echo "  curl -s -X PUT 'https://api.resend.com/domains/$DOMAIN_ID/verify' -H 'Authorization: Bearer $API_KEY'"
  else
    echo "Could not create domain automatically."
    echo "Create it at: https://resend.com/domains"
    echo "Or the domain may already exist - check your Resend dashboard."
  fi
else
  echo "Domain already exists! ID: $DOMAIN_ID"
fi

# Output results
echo ""
echo "=== Resend Setup Complete ==="
echo "RESEND_API_KEY=$API_KEY"
echo ""

# Write to .env.local
ENV_FILE="$(dirname "$0")/../.env.local"
if [ -f "$ENV_FILE" ]; then
  sed -i "s|^RESEND_API_KEY=.*|RESEND_API_KEY=$API_KEY|" "$ENV_FILE"
  echo "Updated .env.local with Resend API key"
fi
