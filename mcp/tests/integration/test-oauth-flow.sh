#!/usr/bin/env bash
#
# End-to-end integration test for the OAuth 2.1 + JWT flow:
#   Keycloak (IdP) → radiant-mcp (resource server, forwards the JWT) → StarRocks (JWT auth)
#
# Run from host:   KEYCLOAK_URL=http://localhost:8080 MCP_URL=http://localhost:8000 ./test-oauth-flow.sh
# Run via compose:  docker compose --profile test run --rm test-runner
#
set -euo pipefail

KEYCLOAK_URL="${KEYCLOAK_URL:-http://localhost:8080}"
MCP_URL="${MCP_URL:-http://localhost:8000}"
REALM="radiant"
CLIENT_ID="radiant-mcp-server"
CLIENT_SECRET="test-client-secret"
USERNAME="testuser"
PASSWORD="testpass"

PASS=0
FAIL=0

pass() { echo "  PASS: $1"; PASS=$((PASS + 1)); }
fail() { echo "  FAIL: $1"; FAIL=$((FAIL + 1)); }

# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------

wait_for_url() {
  local url="$1" max="${2:-60}" i=0
  echo "Waiting for $url ..."
  while ! curl -sf --max-time 5 "$url" > /dev/null 2>&1; do
    ((i++))
    if [ "$i" -ge "$max" ]; then
      echo "ERROR: $url not reachable after ${max}s"
      exit 1
    fi
    sleep 1
  done
  echo "  $url is up."
}

get_token() {
  curl -sf --max-time 10 -X POST \
    "${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=password" \
    -d "client_id=${CLIENT_ID}" \
    -d "client_secret=${CLIENT_SECRET}" \
    -d "username=${USERNAME}" \
    -d "password=${PASSWORD}" \
    -d "scope=openid" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])"
}

# MCP streamable-http: send a JSON-RPC request and return the response body.
# Streamable-HTTP may respond with SSE (text/event-stream) or plain JSON.
# We use --max-time to avoid hanging on SSE streams.
mcp_call() {
  local token="$1" method="$2" params="$3"
  local body
  body=$(printf '{"jsonrpc":"2.0","id":1,"method":"%s","params":%s}' "$method" "$params")
  curl -s --max-time 15 -X POST "${MCP_URL}/mcp/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -H "Authorization: Bearer ${token}" \
    ${SESSION_ID:+-H "Mcp-Session-Id: ${SESSION_ID}"} \
    -d "$body" || true
}

# --------------------------------------------------------------------------
# Tests
# --------------------------------------------------------------------------

echo "============================================"
echo "  Integration Test: OAuth 2.1 + JWT Flow"
echo "============================================"
echo
echo "  KEYCLOAK_URL: $KEYCLOAK_URL"
echo "  MCP_URL:      $MCP_URL"
echo

SESSION_ID=""

# 1. Wait for services
wait_for_url "${KEYCLOAK_URL}/realms/${REALM}/.well-known/openid-configuration" 90
wait_for_url "${MCP_URL}/health" 90

# 2. Health endpoint
echo
echo "--- Test: Health endpoint ---"
HEALTH=$(curl -sf --max-time 5 "${MCP_URL}/health")
if echo "$HEALTH" | python3 -c "import sys,json; d=json.load(sys.stdin); assert d['status']=='healthy'" 2>/dev/null; then
  pass "Health endpoint returns healthy"
else
  fail "Health endpoint did not return healthy: $HEALTH"
fi

# 3. OAuth protected resource metadata: the route at the app root (oauth.py), the one the
#    provider advertises, not fastmcp's own under /mcp.
echo
echo "--- Test: OAuth protected resource metadata ---"
METADATA=$(curl -s --max-time 5 "${MCP_URL}/.well-known/oauth-protected-resource")
# The resource is MCP_BASE_URL + /mcp, which can differ from MCP_URL inside compose.
if echo "$METADATA" | python3 -c "import sys,json; d=json.load(sys.stdin); assert d['resource'].endswith('/mcp') and d['authorization_servers']" 2>/dev/null; then
  pass "OAuth protected resource metadata at the root advertises the /mcp resource and Keycloak"
else
  fail "OAuth protected resource metadata at the root returned: $METADATA"
fi

# 4. Get JWT token from Keycloak
echo
echo "--- Test: Obtain JWT from Keycloak ---"
TOKEN=$(get_token 2>/dev/null || true)
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  pass "Obtained JWT token from Keycloak"
  # Quick decode to verify claims
  PAYLOAD=$(echo "$TOKEN" | cut -d. -f2 | python3 -c "
import sys, base64, json
b = sys.stdin.read().strip()
b += '=' * (-len(b) % 4)
d = json.loads(base64.urlsafe_b64decode(b))
print(json.dumps({'sub': d.get('sub'), 'preferred_username': d.get('preferred_username'), 'aud': d.get('aud'), 'iss': d.get('iss')}, indent=2))
")
  echo "  Token claims: $PAYLOAD"
else
  fail "Could not obtain JWT token from Keycloak"
  echo "  Skipping remaining tests that require a token."
  echo
  echo "Results: $PASS passed, $FAIL failed"
  exit 1
fi

# 5. Authenticated MCP call: initialize + handshake
echo
echo "--- Test: MCP initialize (authenticated) ---"
# Capture both response body and headers from initialize
RESP_HEADERS=$(mktemp)
INIT_RESP=$(curl -s --max-time 15 -X POST "${MCP_URL}/mcp/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"0.1"}}}' \
  -D "$RESP_HEADERS" || true)

SESSION_ID=$(grep -i 'mcp-session-id' "$RESP_HEADERS" | tr -d '\r' | awk '{print $2}' || true)
rm -f "$RESP_HEADERS"

if echo "$INIT_RESP" | grep -q 'protocolVersion'; then
  pass "MCP initialize succeeded"
  if [ -n "$SESSION_ID" ]; then
    echo "  Session ID: ${SESSION_ID:0:20}..."
  fi
else
  fail "MCP initialize failed: $(echo "$INIT_RESP" | head -5)"
fi

# 5b. Send initialized notification (required by MCP protocol before tool calls)
echo
echo "--- Sending initialized notification ---"
curl -s --max-time 10 -X POST "${MCP_URL}/mcp/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer ${TOKEN}" \
  ${SESSION_ID:+-H "Mcp-Session-Id: ${SESSION_ID}"} \
  -d '{"jsonrpc":"2.0","method":"notifications/initialized"}' > /dev/null 2>&1 || true
echo "  Done."

# 6. Authenticated MCP tool call: read_query
echo
echo "--- Test: MCP tools/call read_query (authenticated) ---"
QUERY_RESP=$(mcp_call "$TOKEN" "tools/call" '{"name":"read_query","arguments":{"query":"SELECT * FROM test_db.users ORDER BY id"}}')
if echo "$QUERY_RESP" | grep -q "Alice"; then
  pass "read_query returned expected data (Alice found)"
else
  fail "read_query did not return expected data: $(echo "$QUERY_RESP" | head -5)"
fi

# 7. Unauthenticated request → should get 401
echo
echo "--- Test: Unauthenticated MCP request → 401 ---"
UNAUTH_STATUS=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "${MCP_URL}/mcp/" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"0.1"}}}')
if [ "$UNAUTH_STATUS" = "401" ]; then
  pass "Unauthenticated request correctly returned 401"
else
  fail "Unauthenticated request returned $UNAUTH_STATUS (expected 401)"
fi

# --------------------------------------------------------------------------
# Summary
# --------------------------------------------------------------------------
echo
echo "============================================"
echo "  Results: $PASS passed, $FAIL failed"
echo "============================================"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
