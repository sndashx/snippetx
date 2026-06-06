#!/bin/bash
set -e

# Cloudflare R2 Setup Script
# Usage: ./scripts/setup-r2.sh <api_token> <account_id> [bucket_name]
# Get API token from: https://dash.cloudflare.com/profile/api-tokens
# Account ID from: https://dash.cloudflare.com/ (right sidebar)

CF_TOKEN="${1}"
ACCOUNT_ID="${2}"
BUCKET_NAME="${3:-snippetx-snippets}"

if [ -z "$CF_TOKEN" ] || [ -z "$ACCOUNT_ID" ]; then
  echo "Usage: $0 <cloudflare_api_token> <account_id> [bucket_name]"
  echo ""
  echo "Steps to get your Cloudflare credentials:"
  echo "1. Go to https://dash.cloudflare.com/profile/api-tokens"
  echo "2. Create a token with R2:Edit permission"
  echo "3. Your Account ID is at https://dash.cloudflare.com/ (right sidebar)"
  echo ""
  echo "NOTE: R2 must be enabled in Cloudflare Dashboard first!"
  echo "1. Go to https://dash.cloudflare.com/"
  echo "2. Click 'R2' in the sidebar"
  echo "3. Click 'Enable R2'"
  exit 1
fi

echo "=== Setting up Cloudflare R2 ==="

# Create R2 bucket
echo "Creating R2 bucket: $BUCKET_NAME"
BUCKET_RESULT=$(curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$BUCKET_NAME\", \"location\": \"auto\"}")

BUCKET_SUCCESS=$(echo "$BUCKET_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null || echo "False")

if [ "$BUCKET_SUCCESS" = "True" ]; then
  echo "Bucket created successfully!"
else
  echo "Bucket creation response:"
  echo "$BUCKET_RESULT" | python3 -m json.tool 2>/dev/null || echo "$BUCKET_RESULT"
  
  # Check if bucket already exists
  if echo "$BUCKET_RESULT" | grep -q "already exists"; then
    echo "Bucket already exists, continuing..."
  else
    echo "ERROR: Could not create bucket. Ensure R2 is enabled in Cloudflare Dashboard."
    exit 1
  fi
fi

# Create API token for R2 access
echo "Creating R2 API token..."
# First, get the account ID from the token we already have
R2_TOKEN_RESULT=$(curl -s -X POST "https://api.cloudflare.com/client/v4/user/tokens" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"snippetx-r2-access\",
    \"policies\": [{
      \"effect\": \"allow\",
      \"resources\": {
        \"com.cloudflare.api.account.zone.*\": \"*\",
        \"com.cloudflare.api.account.r2.buckets.*\": \"*\",
        \"com.cloudflare.api.account.r2.object.*\": \"*\"
      },
      \"permission_groups\": [{
        \"id\": \"7b268c8e5c404b1986546e7c4b5820b0\",
        \"name\": \"R2 Read Write\"
      }]
    }]
  }")

R2_TOKEN=$(echo "$R2_TOKEN_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('result',{}).get('value',''))" 2>/dev/null || echo "")

if [ -z "$R2_TOKEN" ]; then
  echo "Could not create API token automatically."
  echo "Create one manually at: https://dash.cloudflare.com/profile/api-tokens"
  echo "Permissions needed: R2: Read and Write"
  R2_TOKEN="REPLACE_WITH_R2_API_TOKEN"
  R2_SECRET="REPLACE_WITH_R2_SECRET_KEY"
else
  echo "API token created!"
  
  # The token value is only shown once - we need to extract the secret
  # Unfortunately the API doesn't return the secret separately
  echo "IMPORTANT: The token value shown above is your access key."
  echo "You'll also need the secret key from the token details."
  R2_SECRET="CHECK_DASHBOARD_FOR_SECRET"
fi

# Output results
echo ""
echo "=== R2 Setup Complete ==="
echo "R2_ACCOUNT_ID=$ACCOUNT_ID"
echo "R2_ACCESS_KEY=$R2_TOKEN"
echo "R2_SECRET_KEY=$R2_SECRET"
echo "R2_BUCKET=$BUCKET_NAME"
echo ""

# Write to .env.local
ENV_FILE="$(dirname "$0")/../.env.local"
if [ -f "$ENV_FILE" ]; then
  sed -i "s|^CLOUDFLARE_R2_ACCOUNT_ID=.*|CLOUDFLARE_R2_ACCOUNT_ID=$ACCOUNT_ID|" "$ENV_FILE"
  sed -i "s|^CLOUDFLARE_R2_ACCESS_KEY_ID=.*|CLOUDFLARE_R2_ACCESS_KEY_ID=$R2_TOKEN|" "$ENV_FILE"
  sed -i "s|^CLOUDFLARE_R2_SECRET_ACCESS_KEY=.*|CLOUDFLARE_R2_SECRET_ACCESS_KEY=$R2_SECRET|" "$ENV_FILE"
  sed -i "s|^CLOUDFLARE_R2_BUCKET=.*|CLOUDFLARE_R2_BUCKET=$BUCKET_NAME|" "$ENV_FILE"
  echo "Updated .env.local with R2 credentials"
fi
