#!/bin/bash
set -e

# Supabase Setup Script
# Usage: ./scripts/setup-supabase.sh <access_token> <project_name> <db_password>
# Get access token from: https://supabase.com/account/access-tokens

ACCESS_TOKEN="${1}"
PROJECT_NAME="${2:-snippetx}"
DB_PASSWORD="${3}"

if [ -z "$ACCESS_TOKEN" ] || [ -z "$DB_PASSWORD" ]; then
  echo "Usage: $0 <supabase_access_token> [project_name] <db_password>"
  echo ""
  echo "Steps to get your Supabase access token:"
  echo "1. Go to https://supabase.com/account/access-tokens"
  echo "2. Generate a new token"
  echo "3. Copy the token and pass it as the first argument"
  exit 1
fi

echo "=== Setting up Supabase ==="

# Set the access token
export SUPABASE_ACCESS_TOKEN="$ACCESS_TOKEN"

# Check if project already exists
echo "Checking for existing project..."
EXISTING=$(supabase projects list --experimental 2>/dev/null | grep "$PROJECT_NAME" || true)

if [ -n "$EXISTING" ]; then
  echo "Project '$PROJECT_NAME' already exists. Using existing project."
  PROJECT_REF=$(echo "$EXISTING" | awk '{print $1}')
else
  echo "Creating new project: $PROJECT_NAME"
  # Create project in most free region
  PROJECT_REF=$(supabase projects create "$PROJECT_NAME" \
    --db-password "$DB_PASSWORD" \
    --region us-east-1 \
    --experimental 2>/dev/null | grep -oP 'Project ref: \K\S+' || echo "")
  
  if [ -z "$PROJECT_REF" ]; then
    echo "Failed to create project. Trying alternative method..."
    # Try with JSON output
    RESULT=$(supabase projects create "$PROJECT_NAME" \
      --db-password "$DB_PASSWORD" \
      --region us-east-1 \
      --experimental 2>&1)
    echo "$RESULT"
    PROJECT_REF=$(echo "$RESULT" | grep -oP '[a-z]{20}' | head -1)
  fi
fi

if [ -z "$PROJECT_REF" ]; then
  echo "ERROR: Could not determine project ref. Check Supabase dashboard."
  exit 1
fi

echo "Project ref: $PROJECT_REF"

# Get project details
echo "Fetching project details..."
PROJECT_URL="https://${PROJECT_REF}.supabase.co"

# Get API keys
echo "Fetching API keys..."
API_KEYS=$(supabase projects api-keys --project-ref "$PROJECT_REF" --experimental 2>/dev/null || true)

if [ -z "$API_KEYS" ]; then
  echo "Could not auto-fetch API keys. Please check your Supabase dashboard."
  echo "Project URL: $PROJECT_URL"
  echo ""
  echo "You can find your keys at: https://supabase.com/dashboard/project/${PROJECT_REF}/settings/api"
  ANON_KEY="REPLACE_WITH_ANON_KEY"
  SERVICE_ROLE_KEY="REPLACE_WITH_SERVICE_ROLE_KEY"
else
  ANON_KEY=$(echo "$API_KEYS" | grep -oP 'anon\s+\K\S+' | head -1)
  SERVICE_ROLE_KEY=$(echo "$API_KEYS" | grep -oP 'service_role\s+\K\S+' | head -1)
fi

# Output results
echo ""
echo "=== Supabase Setup Complete ==="
echo "PROJECT_REF=$PROJECT_REF"
echo "SUPABASE_URL=$PROJECT_URL"
echo "SUPABASE_ANON_KEY=$ANON_KEY"
echo "SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY"
echo ""

# Write to .env.local
ENV_FILE="$(dirname "$0")/../.env.local"
if [ -f "$ENV_FILE" ]; then
  sed -i "s|^NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$PROJECT_URL|" "$ENV_FILE"
  sed -i "s|^NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY|" "$ENV_FILE"
  sed -i "s|^SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY|" "$ENV_FILE"
  echo "Updated .env.local with Supabase credentials"
fi
