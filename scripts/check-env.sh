#!/bin/bash
# SnippetX Environment Checker
# Sources .env.local, verifies each required var, flags placeholders.
# Exits 1 if any placeholder or missing required var detected.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found."
  echo "Copy .env.example to .env.local and configure it first."
  exit 1
fi

# Source env vars (handle values with spaces/special chars safely)
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

# Required vars to check
# Format: "VAR_NAME|CheckType|Placeholder patterns (pipe-separated)"
# CheckType: required | optional
CHECK_VARS=(
  "DATABASE_URL|required|placeholder|user:pass@ep-something"
  "NEXT_PUBLIC_SUPABASE_URL|required|placeholder|your-project"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY|required|placeholder|your-anon-key"
  "SUPABASE_SERVICE_ROLE_KEY|required|placeholder|your-service-role-key"
  "STRIPE_SECRET_KEY|required|REPLACE_WITH"
  "STRIPE_WEBHOOK_SECRET|required|REPLACE_WITH"
  "CLOUDFLARE_R2_ACCOUNT_ID|required|placeholder|your-account-id"
  "CLOUDFLARE_R2_ACCESS_KEY_ID|required|placeholder|your-access-key|REPLACE_WITH"
  "CLOUDFLARE_R2_SECRET_ACCESS_KEY|required|placeholder|your-secret-key|REPLACE_WITH|CHECK_DASHBOARD"
  "CLOUDFLARE_R2_BUCKET|required|"
  "RESEND_API_KEY|required|placeholder|REPLACE_WITH"
  "NEXT_PUBLIC_APP_URL|optional|"
)

TOTAL=${#CHECK_VARS[@]}
OK_COUNT=0
FAIL_COUNT=0
PLACEHOLDER_COUNT=0
MISSING_COUNT=0
FAILED_VARS=()
PLACEHOLDER_VARS=()
MISSING_VARS=()

is_placeholder() {
  local val="$1"
  local patterns="$2"
  if [ -z "$patterns" ]; then
    return 1
  fi
  # Patterns are pipe-separated within a single string
  IFS='|' read -ra pattern_arr <<< "$patterns"
  for pattern in "${pattern_arr[@]}"; do
    [[ -z "$pattern" ]] && continue
    if [[ "$val" == *"$pattern"* ]]; then
      return 0
    fi
  done
  return 1
}

echo "╔══════════════════════════════════════╗"
echo "║   SnippetX Environment Check         ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Source: $ENV_FILE"
echo ""

for entry in "${CHECK_VARS[@]}"; do
  IFS='|' read -r var_name check_type placeholders <<< "$entry"

  current_val="${!var_name:-}"
  status="?"
  note=""

  if [ -z "$current_val" ]; then
    status="✗"
    note="MISSING"
    MISSING_COUNT=$((MISSING_COUNT + 1))
    MISSING_VARS+=("$var_name")
    FAILED_VARS+=("$var_name")
    FAIL_COUNT=$((FAIL_COUNT + 1))
  else
    if [ -n "$placeholders" ] && is_placeholder "$current_val" "$placeholders"; then
      status="✗"
      note="PLACEHOLDER"
      PLACEHOLDER_COUNT=$((PLACEHOLDER_COUNT + 1))
      PLACEHOLDER_VARS+=("$var_name")
      FAILED_VARS+=("$var_name")
      FAIL_COUNT=$((FAIL_COUNT + 1))
    else
      status="✓"
      note="OK"
      OK_COUNT=$((OK_COUNT + 1))
    fi
  fi

  # Mask value for display (show first 4 and last 4 chars)
  if [ -z "$current_val" ]; then
    display="(empty)"
  elif [ ${#current_val} -le 12 ]; then
    display="***"
  else
    display="${current_val:0:4}...${current_val: -4}"
  fi

  printf "  %s  %-40s [%-12s] %s\n" "$status" "$var_name" "$check_type" "$note"
done

echo ""
echo "────────────────────────────────────────"
echo "  Total:    $TOTAL"
echo "  OK:       $OK_COUNT"
echo "  Missing:  $MISSING_COUNT"
echo "  Placeholder: $PLACEHOLDER_COUNT"
echo "  Failed:   $FAIL_COUNT"
echo "────────────────────────────────────────"

if [ ${#PLACEHOLDER_VARS[@]} -gt 0 ]; then
  echo ""
  echo "Placeholder vars (need real values):"
  for v in "${PLACEHOLDER_VARS[@]}"; do
    echo "  - $v"
  done
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
  echo ""
  echo "Missing vars:"
  for v in "${MISSING_VARS[@]}"; do
    echo "  - $v"
  done
fi

echo ""

if [ $PLACEHOLDER_COUNT -gt 0 ] || [ $MISSING_COUNT -gt 0 ]; then
  echo "✗ FAILED: $((PLACEHOLDER_COUNT + MISSING_COUNT)) var(s) need attention."
  echo ""
  echo "Run the relevant setup script:"
  for v in "${FAILED_VARS[@]}"; do
    case "$v" in
      DATABASE_URL)
        [ " ${MISSING_VARS[*]} " == *" $v "* ] && echo "  - ./scripts/setup-neon.sh"
        ;;
      NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)
        echo "  - ./scripts/setup-supabase.sh"
        ;;
      STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET)
        echo "  - ./scripts/setup-stripe.sh"
        ;;
      CLOUDFLARE_R2_*)
        echo "  - ./scripts/setup-r2.sh"
        ;;
      RESEND_API_KEY)
        echo "  - ./scripts/setup-resend.sh"
        ;;
    esac
  done | sort -u
  exit 1
fi

echo "✓ All required vars configured."
exit 0
