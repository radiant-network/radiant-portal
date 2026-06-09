#!/bin/bash
# =============================================================================
# connect.sh — authenticate a demo user against Keycloak and open a StarRocks
# (MySQL protocol) session as that user, using the MySQL OIDC client plugin.
#
#     ./connect.sh <user> ["SQL"]
#     ./connect.sh alice
#     ./connect.sh bob "SELECT id, submitter_patient_id FROM tenant_b.patient ORDER BY id"
#
# JWT users (alice/bob/wendy): a token is fetched from Keycloak via the ROPC
# flow (password radiant123!), written to a temp file, and handed to the mysql
# `authentication_openid_connect_client` plugin via
# --authentication-openid-connect-client-id-token-file. The token file (not
# -p"$TOKEN") is the StarRocks-recommended path and avoids the mysql password
# length limit. TLS is auto-negotiated by the default --ssl-mode=PREFERRED,
# which the OIDC plugin requires.
#
# The service admin svc_admin_api uses native auth (no plugin):
#     mysql -h127.0.0.1 -P9030 -usvc_admin_api -padminpass1
#
# Requires an Oracle MySQL client 8.4+/9.x that ships the OIDC client plugin
# (MariaDB's client does not). python3 (stdlib) parses the token JSON.
# =============================================================================

set -euo pipefail

KC_URL="${KC_URL:-http://localhost:8080}"
REALM="${REALM:-CQDG}"
CLIENT_ID="${CLIENT_ID:-radiant}"
CLIENT_SECRET="${CLIENT_SECRET:-ShutThisIsASecret!}"
USER_PASSWORD="${USER_PASSWORD:-radiant123!}"
SR_HOST="${SR_HOST:-127.0.0.1}"
SR_PORT="${SR_PORT:-9030}"

USER="${1:-alice}"
SQL="${2:-}"

if [ "${USER}" = "svc_admin_api" ]; then
  echo "=== svc_admin_api uses native auth (password adminpass1) ===" >&2
  if [ -n "${SQL}" ]; then
    exec mysql -h"${SR_HOST}" -P"${SR_PORT}" -usvc_admin_api -padminpass1 -e "${SQL}"
  else
    exec mysql -h"${SR_HOST}" -P"${SR_PORT}" -usvc_admin_api -padminpass1
  fi
fi

echo "=== Fetching JWT for '${USER}' from ${KC_URL}/realms/${REALM} ===" >&2
TOKEN=$(curl -s -X POST "${KC_URL}/realms/${REALM}/protocol/openid-connect/token" \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}" \
  -d "username=${USER}" \
  -d "password=${USER_PASSWORD}" \
  -d "grant_type=password" \
  | python3 -c "
import sys, json
d = json.load(sys.stdin)
tok = d.get('access_token')
if not tok:
    sys.stderr.write('token error: ' + json.dumps(d) + '\n'); sys.exit(1)
print(tok)
")

TOKEN_FILE=$(mktemp)
chmod 600 "${TOKEN_FILE}"
trap 'rm -f "${TOKEN_FILE}"' EXIT
printf '%s' "${TOKEN}" > "${TOKEN_FILE}"

# principal_field=sub: the StarRocks username is the token's `sub` claim, not the
# human handle. Decode the JWT payload to get it.
LOGIN=$(printf '%s' "${TOKEN}" | python3 -c "
import sys, json, base64
tok = sys.stdin.read().strip()
p = tok.split('.')[1]; p += '=' * (-len(p) % 4)
sub = json.loads(base64.urlsafe_b64decode(p)).get('sub', '')
if not sub:
    sys.stderr.write('failed to extract sub from token\n'); sys.exit(1)
print(sub)
")

echo "=== Connecting to StarRocks ${SR_HOST}:${SR_PORT} as '${USER}' (sub=${LOGIN}, OIDC) ===" >&2
echo "Use SSL Mode PREFERRED -> use cert but no validation to accept auto signing cert"
MYSQL_ARGS=(
  -h"${SR_HOST}" -P"${SR_PORT}" -u"${LOGIN}"
  --ssl-mode=PREFERRED
  --authentication-openid-connect-client-id-token-file="${TOKEN_FILE}"
  --default-auth=authentication_openid_connect_client
)
if [ -n "${SQL}" ]; then
  mysql "${MYSQL_ARGS[@]}" -e "${SQL}"
else
  mysql "${MYSQL_ARGS[@]}"
fi
