#!/usr/bin/env bash
# Reserve or release the test account of a Cypress run: one S3 object per account, written with a condition.
# Usage: cypress-account.sh reserve <run key>   prints the first free account, waiting up to WAIT_LIMIT_SECONDS
#        cypress-account.sh release <run key>   frees the accounts that the run holds
# Env: LOCK_BUCKET, LOCK_PREFIX, ECS_CLUSTER, and for reserve SLACK_WEBHOOK and SLACK_TITLE.
set -euo pipefail

ACTION=$1
RUN_KEY=$2
ACCOUNTS=(cypress@email.me cypress2@email.me cypress3@email.me cypress4@email.me)
WAIT_LIMIT_SECONDS=${WAIT_LIMIT_SECONDS:-3600}
RETRY_SECONDS=${RETRY_SECONDS:-60}
# Covers the time between a reservation and the start of its tasks
GRACE_SECONDS=${GRACE_SECONDS:-300}

lock_key() { echo "${LOCK_PREFIX}$1"; }

# The object holds "<run key> <reservation time>"
holder() { aws s3 cp "s3://$LOCK_BUCKET/$(lock_key "$1")" - 2>/dev/null || true; }

etag() { aws s3api head-object --bucket "$LOCK_BUCKET" --key "$(lock_key "$1")" --query ETag --output text 2>/dev/null || true; }

# Creates the reservation, or replaces the one with the given ETag. Of two concurrent writes, only one succeeds.
try_lock() {
  local body err condition=(--if-none-match '*')
  if [ -n "${2:-}" ]; then
    condition=(--if-match "$2")
  fi
  body=$(mktemp)
  printf '%s %s' "$RUN_KEY" "$(date +%s)" > "$body"
  if err=$(aws s3api put-object --bucket "$LOCK_BUCKET" --key "$(lock_key "$1")" --body "$body" "${condition[@]}" 2>&1 > /dev/null); then
    return 0
  fi
  case "$err" in
    *PreconditionFailed* | *ConditionalRequestConflict* | *NoSuchKey* | *"Not Found"*) return 1 ;;
    *) echo "$err" >&2 && exit 1 ;;
  esac
}

running() {
  local key arns
  for key in "$1" "$1/aggregator"; do
    arns=$(aws ecs list-tasks --cluster "$ECS_CLUSTER" --started-by "$key" --query 'taskArns' --output text)
    if [ -n "$arns" ] && [ "$arns" != "None" ]; then
      return 0
    fi
  done
  return 1
}

slack() {
  local payload
  payload=$(jq -cn --arg title "$SLACK_TITLE" --arg text "$1" --arg color "$2" '{attachments: [{title: $title, text: $text, color: $color}]}')
  curl -sf -X POST "$SLACK_WEBHOOK" -H 'Content-Type: application/json' -d "$payload" > /dev/null || echo "Slack post failed" >&2
}

reserve() {
  local account tag held_by since deadline waiting=""
  deadline=$(($(date +%s) + WAIT_LIMIT_SECONDS))
  while true; do
    for account in "${ACCOUNTS[@]}"; do
      if try_lock "$account"; then
        echo "Reserved $account for $RUN_KEY" >&2
        echo "$account"
        return 0
      fi
      tag=$(etag "$account")
      read -r held_by since <<< "$(holder "$account")"
      if [ -n "$tag" ] && [ -n "$held_by" ] && [ $(($(date +%s) - ${since:-0})) -ge "$GRACE_SECONDS" ] && ! running "$held_by" && try_lock "$account" "$tag"; then
        echo "Took over $account from $held_by, whose run no longer runs" >&2
        echo "$account"
        return 0
      fi
    done
    if [ "$(date +%s)" -ge "$deadline" ]; then
      slack "No test account was freed in $((WAIT_LIMIT_SECONDS / 60)) minutes: the Cypress run does not start." danger
      return 1
    fi
    if [ -z "$waiting" ]; then
      slack "The ${#ACCOUNTS[@]} test accounts are taken: the Cypress run waits for the next free account." warning
      waiting=1
    fi
    sleep "$RETRY_SECONDS"
  done
}

release() {
  local account held_by
  for account in "${ACCOUNTS[@]}"; do
    read -r held_by _ <<< "$(holder "$account")"
    if [ "$held_by" = "$RUN_KEY" ]; then
      aws s3 rm "s3://$LOCK_BUCKET/$(lock_key "$account")" > /dev/null
      echo "Released $account"
    fi
  done
}

case "$ACTION" in
  reserve) reserve ;;
  release) release ;;
  *) echo "Unknown action $ACTION" >&2 && exit 1 ;;
esac
