#!/bin/bash
# =============================================================================
# Configure Keycloak: realm, client, and users for StarRocks JWT auth
# =============================================================================

set -e

KC_URL="http://keycloak:8080"

echo "=== Waiting for Keycloak ==="
until curl -sf "${KC_URL}/realms/master" > /dev/null 2>&1; do
  echo "  Keycloak not ready, retrying in 5s..."
  sleep 5
done
echo "  Keycloak is up."

# ---------------------------------------------------------------------------
# Get admin token
# ---------------------------------------------------------------------------
echo ""
echo "=== Getting admin token ==="
ADMIN_TOKEN=$(curl -s -X POST "${KC_URL}/realms/master/protocol/openid-connect/token" \
  -d "client_id=admin-cli" \
  -d "username=admin" \
  -d "password=admin" \
  -d "grant_type=password" | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
echo "  Got admin token."

AUTH="Authorization: Bearer ${ADMIN_TOKEN}"

# ---------------------------------------------------------------------------
# Create realm "starrocks"
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating realm 'starrocks' ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${KC_URL}/admin/realms" \
  -H "${AUTH}" -H "Content-Type: application/json" \
  -d '{
    "realm": "starrocks",
    "enabled": true,
    "sslRequired": "none",
    "registrationAllowed": false,
    "requiredActions": [],
    "defaultDefaultClientScopes": [],
    "verifyEmail": false
  }')
echo "  Response: HTTP ${HTTP_CODE}"

# ---------------------------------------------------------------------------
# Create client "starrocks" (public, direct access grants for ROPC flow)
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating client 'starrocks' ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${KC_URL}/admin/realms/starrocks/clients" \
  -H "${AUTH}" -H "Content-Type: application/json" \
  -d '{
    "clientId": "starrocks",
    "enabled": true,
    "publicClient": true,
    "directAccessGrantsEnabled": true,
    "standardFlowEnabled": true,
    "redirectUris": ["http://localhost:3001/*", "http://localhost:8180/*"],
    "webOrigins": ["http://localhost:3001", "http://localhost:8180"],
    "protocol": "openid-connect",
    "protocolMappers": [{
      "name": "starrocks-audience",
      "protocol": "openid-connect",
      "protocolMapper": "oidc-audience-mapper",
      "config": {
        "included.custom.audience": "starrocks",
        "id.token.claim": "false",
        "access.token.claim": "true"
      }
    }]
  }')
echo "  Response: HTTP ${HTTP_CODE}"

# ---------------------------------------------------------------------------
# Create users: jane, alice, bob, carol, dan
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating users ==="

create_user() {
  local username=$1
  local password=$2

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${KC_URL}/admin/realms/starrocks/users" \
    -H "${AUTH}" -H "Content-Type: application/json" \
    -d "{
      \"username\": \"${username}\",
      \"enabled\": true,
      \"emailVerified\": true,
      \"requiredActions\": [],
      \"credentials\": [{
        \"type\": \"password\",
        \"value\": \"${password}\",
        \"temporary\": false
      }]
    }")
  echo "  ${username}: HTTP ${HTTP_CODE}"
}

create_user "jane"  "janepass"
create_user "alice" "alicepass"
create_user "bob"   "bobpass"
create_user "carol" "carolpass"
create_user "dan"    "danpass"
create_user "admin1" "admin1pass"

# ---------------------------------------------------------------------------
# Verify: get a token for jane
# ---------------------------------------------------------------------------
echo ""
echo "=== Verifying token generation for jane ==="
TOKEN_RESPONSE=$(curl -s -X POST "${KC_URL}/realms/starrocks/protocol/openid-connect/token" \
  -d "client_id=starrocks" \
  -d "username=jane" \
  -d "password=janepass" \
  -d "grant_type=password")

ACCESS_TOKEN=$(echo "${TOKEN_RESPONSE}" | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token','FAILED'))" 2>/dev/null || echo "FAILED")
if [ "${ACCESS_TOKEN}" = "FAILED" ] || [ -z "${ACCESS_TOKEN}" ]; then
  echo "  ERROR: Failed to get token for jane"
  echo "  Response: ${TOKEN_RESPONSE}"
  exit 1
fi

# Decode JWT payload (base64url → base64 → json)
PAYLOAD=$(echo "${ACCESS_TOKEN}" | cut -d'.' -f2 | python3 -c "
import sys, base64, json
b64 = sys.stdin.read().strip()
b64 += '=' * (4 - len(b64) % 4)
payload = json.loads(base64.urlsafe_b64decode(b64))
print(json.dumps({'preferred_username': payload.get('preferred_username'), 'iss': payload.get('iss'), 'aud': payload.get('aud')}, indent=2))
")
echo "  Token claims: ${PAYLOAD}"
echo "  Keycloak configuration complete."
