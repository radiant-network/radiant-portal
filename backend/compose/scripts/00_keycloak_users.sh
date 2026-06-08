#!/bin/bash
# =============================================================================
# 00_keycloak_users.sh — create the demo users (alice, bob, wendy) in the CQDG
# Keycloak realm so they can obtain a JWT for StarRocks login.
#
#     ./00_keycloak_users.sh
#
# Idempotent: an existing user (HTTP 409) is treated as success. All three users
# share the password radiant123! (matches 02_starrocks_users.sql / connect.sh).
# Uses python3 (stdlib) to parse JSON — no jq dependency, matching the other
# scripts here.
# =============================================================================

set -euo pipefail

KC_URL="${KC_URL:-http://localhost:8080}"
KC_ADMIN_USER="${KC_ADMIN_USER:-admin}"
KC_ADMIN_PASS="${KC_ADMIN_PASS:-admin}"
REALM="${REALM:-CQDG}"
USER_PASSWORD="${USER_PASSWORD:-radiant123!}"

echo "=== Waiting for Keycloak at ${KC_URL} ==="
until curl -sf "${KC_URL}/realms/master" >/dev/null 2>&1; do
  echo "  not ready, retrying in 5s..."
  sleep 5
done
echo "  Keycloak is up."

echo ""
echo "=== Getting admin token ==="
ADMIN_TOKEN=$(curl -s -X POST "${KC_URL}/realms/master/protocol/openid-connect/token" \
  -d "client_id=admin-cli" \
  -d "username=${KC_ADMIN_USER}" \
  -d "password=${KC_ADMIN_PASS}" \
  -d "grant_type=password" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
echo "  Got admin token."

AUTH="Authorization: Bearer ${ADMIN_TOKEN}"

echo ""
echo "=== Upserting users in realm '${REALM}' (password ${USER_PASSWORD}) ==="
# Upsert (not just create): if the user already exists we PUT the full profile and
# reset the password, so a re-run converges. firstName/lastName are REQUIRED — the
# Keycloak user-profile feature otherwise injects a VERIFY_PROFILE required action
# and ROPC fails with "Account is not fully set up".
upsert_user() {
  local username=$1
  local first=$2
  # Capitalize-free: pass an explicit first name; last name is "Demo".
  local payload="{
      \"username\": \"${username}\",
      \"email\": \"${username}@demo.org\",
      \"firstName\": \"${first}\",
      \"lastName\": \"Demo\",
      \"enabled\": true,
      \"emailVerified\": true,
      \"requiredActions\": []
    }"

  # Does the user already exist? (exact match on username)
  local uid
  uid=$(curl -s "${KC_URL}/admin/realms/${REALM}/users?username=${username}&exact=true" \
    -H "${AUTH}" | python3 -c "import sys,json; u=json.load(sys.stdin); print(u[0]['id'] if u else '')")

  if [ -z "${uid}" ]; then
    curl -s -o /dev/null -w "  ${username}: created (HTTP %{http_code})\n" -X POST \
      "${KC_URL}/admin/realms/${REALM}/users" \
      -H "${AUTH}" -H "Content-Type: application/json" -d "${payload}"
    uid=$(curl -s "${KC_URL}/admin/realms/${REALM}/users?username=${username}&exact=true" \
      -H "${AUTH}" | python3 -c "import sys,json; u=json.load(sys.stdin); print(u[0]['id'] if u else '')")
  else
    curl -s -o /dev/null -w "  ${username}: updated (HTTP %{http_code})\n" -X PUT \
      "${KC_URL}/admin/realms/${REALM}/users/${uid}" \
      -H "${AUTH}" -H "Content-Type: application/json" -d "${payload}"
  fi

  # (Re)set a permanent password.
  curl -s -o /dev/null -X PUT \
    "${KC_URL}/admin/realms/${REALM}/users/${uid}/reset-password" \
    -H "${AUTH}" -H "Content-Type: application/json" \
    -d "{\"type\": \"password\", \"value\": \"${USER_PASSWORD}\", \"temporary\": false}"
}

upsert_user alice Alice
upsert_user bob   Bob
upsert_user wendy Wendy

echo ""
echo "=== Verifying token issuance for alice (client 'radiant') ==="
CLAIMS=$(curl -s -X POST "${KC_URL}/realms/${REALM}/protocol/openid-connect/token" \
  -d "client_id=radiant" \
  -d "client_secret=ShutThisIsASecret!" \
  -d "username=alice" \
  -d "password=${USER_PASSWORD}" \
  -d "grant_type=password" \
  | python3 -c "
import sys, json, base64
tok = json.load(sys.stdin).get('access_token')
if not tok:
    print('FAILED: no access_token'); sys.exit(1)
p = tok.split('.')[1]; p += '=' * (4 - len(p) % 4)
c = json.loads(base64.urlsafe_b64decode(p))
print(json.dumps({'preferred_username': c.get('preferred_username'), 'iss': c.get('iss'), 'aud': c.get('aud')}))
")
echo "  ${CLAIMS}"
echo "  Done."
