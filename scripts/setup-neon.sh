#!/bin/bash
set -e

# Neon Setup Script
# Usage: ./scripts/setup-neon.sh <api_key> [project_name]
# Get API key from: https://console.neon.tech/app/settings/api-keys

API_KEY="${1}"
PROJECT_NAME="${2:-snippetx}"

if [ -z "$API_KEY" ]; then
  echo "Usage: $0 <neon_api_key> [project_name]"
  echo ""
  echo "Steps to get your Neon API key:"
  echo "1. Go to https://console.neon.tech/app/settings/api-keys"
  echo "2. Create a new API key"
  echo "3. Copy the key and pass it as the first argument"
  exit 1
fi

echo "=== Setting up Neon Database ==="

# Create project
echo "Creating Neon project: $PROJECT_NAME"
RESULT=$(curl -s -X POST "https://console.neon.tech/api/v2/projects" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"project\": {
      \"name\": \"$PROJECT_NAME\",
      \"region_id\": \"aws-us-east-1\"
    }
  }")

PROJECT_ID=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['project']['id'])" 2>/dev/null || echo "")

if [ -z "$PROJECT_ID" ]; then
  echo "Failed to create project. Response:"
  echo "$RESULT" | python3 -m json.tool 2>/dev/null || echo "$RESULT"
  exit 1
fi

echo "Project ID: $PROJECT_ID"

# Wait for project to be ready
echo "Waiting for project to be ready..."
sleep 5

# Get connection string
echo "Fetching connection string..."
CONN_RESULT=$(curl -s "https://console.neon.tech/api/v2/projects/${PROJECT_ID}/connection_uri" \
  -H "Authorization: Bearer $API_KEY")

DATABASE_URL=$(echo "$CONN_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['connection_uri']['connection_string'])" 2>/dev/null || echo "")

if [ -z "$DATABASE_URL" ]; then
  echo "Could not fetch connection string. Checking project details..."
  PROJECT_DETAILS=$(curl -s "https://console.neon.tech/api/v2/projects/${PROJECT_ID}" \
    -H "Authorization: Bearer $API_KEY")
  echo "$PROJECT_DETAILS" | python3 -m json.tool 2>/dev/null || echo "$PROJECT_DETAILS"
  echo ""
  echo "You can find the connection string in the Neon dashboard."
  DATABASE_URL="REPLACE_WITH_DATABASE_URL"
fi

# Output results
echo ""
echo "=== Neon Setup Complete ==="
echo "PROJECT_ID=$PROJECT_ID"
echo "DATABASE_URL=$DATABASE_URL"
echo ""

# Write to .env.local
ENV_FILE="$(dirname "$0")/../.env.local"
if [ -f "$ENV_FILE" ]; then
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" "$ENV_FILE"
  echo "Updated .env.local with DATABASE_URL"
fi
