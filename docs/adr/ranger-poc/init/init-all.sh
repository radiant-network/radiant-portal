#!/bin/bash
# =============================================================================
# Combined init: register Ranger service + create roles/users + SR schema + policies
#
# Users are prefixed with user_ (exist in both StarRocks and Ranger).
# Roles are prefixed with role_ (exist only in Ranger).
# Policies reference roles. Users are assigned to roles.
# =============================================================================

set -e

RANGER_URL="http://ranger:6080"
RANGER_AUTH="admin:rangerR0cks!"
SERVICE_NAME="starrocks"

# Install curl (not present in starrocks image)
apt-get update -qq && apt-get install -y -qq curl > /dev/null 2>&1

# ---------------------------------------------------------------------------
# Step 1: Wait for Ranger Admin
# ---------------------------------------------------------------------------
echo "=== Waiting for Ranger Admin ==="
until curl -sf "${RANGER_URL}/login.jsp" > /dev/null 2>&1; do
  echo "  Ranger not ready, retrying in 5s..."
  sleep 5
done
echo "  Ranger Admin is up."
sleep 10

# ---------------------------------------------------------------------------
# Step 2: Register StarRocks service definition
# ---------------------------------------------------------------------------
echo ""
echo "=== Registering StarRocks service definition ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  "${RANGER_URL}/service/plugins/definitions" \
  -d @/init/ranger-servicedef-starrocks.json)
echo "  Response: HTTP ${HTTP_CODE}"
sleep 2

# ---------------------------------------------------------------------------
# Step 3: Create the StarRocks service instance
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating StarRocks service ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  "${RANGER_URL}/service/public/v2/api/service" \
  -d "{
    \"name\": \"${SERVICE_NAME}\",
    \"type\": \"starrocks\",
    \"configs\": {
      \"username\": \"root\",
      \"password\": \"\",
      \"jdbc.driverClassName\": \"com.mysql.cj.jdbc.Driver\",
      \"jdbc.url\": \"jdbc:mysql://starrocks:9030\"
    }
  }")
echo "  Response: HTTP ${HTTP_CODE}"

# ---------------------------------------------------------------------------
# Step 4: Register user stubs in Ranger (prefixed with user_)
# These are NOT real accounts -- authentication happens in StarRocks.
# Ranger just needs the names so they can be assigned to roles.
# ---------------------------------------------------------------------------
echo ""
echo "=== Registering user stubs in Ranger ==="
for USER in user_cbtn_all user_cbtn_chop user_cbtn_seattle user_udp_all; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    "${RANGER_URL}/service/xusers/secure/users" \
    -d "{\"name\": \"${USER}\", \"password\": \"Passw0rd!\", \"userRoleList\": [\"ROLE_USER\"], \"firstName\": \"${USER}\", \"userSource\": 0}")
  echo "  ${USER}: HTTP ${HTTP_CODE}"
done
sleep 2

# ---------------------------------------------------------------------------
# Step 5: Create Ranger roles (prefixed with role_) and assign users
# Roles exist ONLY in Ranger. Policies reference roles, not users directly.
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating Ranger roles and assigning users ==="

# role_cbtn_all: full access to all CBTN data (no masking)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/public/v2/api/roles" \
  -d '{"name": "role_cbtn_all", "users": [{"name": "user_cbtn_all", "isAdmin": false}]}')
echo "  role_cbtn_all: HTTP ${HTTP_CODE}"

# role_cbtn_chop: CBTN tenant, identified for chop org, masked for others
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/public/v2/api/roles" \
  -d '{"name": "role_cbtn_chop", "users": [{"name": "user_cbtn_chop", "isAdmin": false}]}')
echo "  role_cbtn_chop: HTTP ${HTTP_CODE}"

# role_cbtn_seattle: CBTN tenant, seattle org only
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/public/v2/api/roles" \
  -d '{"name": "role_cbtn_seattle", "users": [{"name": "user_cbtn_seattle", "isAdmin": false}]}')
echo "  role_cbtn_seattle: HTTP ${HTTP_CODE}"

# role_udp_all: full access to all UDP data
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/public/v2/api/roles" \
  -d '{"name": "role_udp_all", "users": [{"name": "user_udp_all", "isAdmin": false}]}')
echo "  role_udp_all: HTTP ${HTTP_CODE}"
sleep 2

# Ranger auto-creates default policies granting root full access.
# Wait for StarRocks FE to poll and sync these policies.
echo ""
echo "=== Waiting for StarRocks to sync Ranger default policies (20s) ==="
sleep 20

# ---------------------------------------------------------------------------
# Step 6: Run StarRocks DDL (root has access via Ranger default policies)
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating StarRocks database, tables, and users ==="
mysql -hstarrocks -P9030 -uroot < /init/init-starrocks.sql
echo "  Done."
sleep 2

# ---------------------------------------------------------------------------
# Step 7: Access policy -- grant SELECT on patients to all roles
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating access policy: allow SELECT for all roles ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d "{
    \"policyType\": 0,
    \"name\": \"poc_select_patients\",
    \"isEnabled\": true,
    \"isAuditEnabled\": false,
    \"service\": \"${SERVICE_NAME}\",
    \"resources\": {
      \"catalog\": { \"values\": [\"default_catalog\"] },
      \"database\": { \"values\": [\"poc_db\"] },
      \"table\": { \"values\": [\"patients\"] },
      \"column\": { \"values\": [\"*\"] }
    },
    \"policyItems\": [
      {
        \"roles\": [\"role_cbtn_all\", \"role_cbtn_chop\", \"role_cbtn_seattle\", \"role_udp_all\"],
        \"accesses\": [{ \"type\": \"select\", \"isAllowed\": true }]
      }
    ]
  }")
echo "  Response: HTTP ${HTTP_CODE}"
sleep 2

# ---------------------------------------------------------------------------
# Step 8: Row-filter policy (one policy, filter items per role)
#
# role_cbtn_all     -> tenant = 'cbtn'                              (all CBTN)
# role_cbtn_chop    -> tenant = 'cbtn'                              (all CBTN, masking handles per-org PII)
# role_cbtn_seattle -> tenant = 'cbtn' AND organization = 'seattle' (seattle only)
# role_udp_all      -> tenant = 'udp'                               (all UDP)
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating row-filter policy ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d "{
    \"policyType\": 2,
    \"name\": \"row_filter_patients\",
    \"isEnabled\": true,
    \"isAuditEnabled\": false,
    \"service\": \"${SERVICE_NAME}\",
    \"resources\": {
      \"catalog\": { \"values\": [\"default_catalog\"] },
      \"database\": { \"values\": [\"poc_db\"] },
      \"table\": { \"values\": [\"patients\"] }
    },
    \"rowFilterPolicyItems\": [
      {
        \"roles\": [\"role_cbtn_all\", \"role_cbtn_chop\"],
        \"accesses\": [{ \"type\": \"select\", \"isAllowed\": true }],
        \"rowFilterInfo\": { \"filterExpr\": \"tenant = 'cbtn'\" }
      },
      {
        \"roles\": [\"role_cbtn_seattle\"],
        \"accesses\": [{ \"type\": \"select\", \"isAllowed\": true }],
        \"rowFilterInfo\": { \"filterExpr\": \"tenant = 'cbtn' AND organization = 'seattle'\" }
      },
      {
        \"roles\": [\"role_udp_all\"],
        \"accesses\": [{ \"type\": \"select\", \"isAllowed\": true }],
        \"rowFilterInfo\": { \"filterExpr\": \"tenant = 'udp'\" }
      }
    ]
  }")
echo "  Response: HTTP ${HTTP_CODE}"
sleep 2

# ---------------------------------------------------------------------------
# Step 9: Column masking policies (CUSTOM conditional masks)
#
# role_cbtn_chop sees all CBTN rows, but:
#   - chop organization:    mrn = full,  date_of_birth = full
#   - other organizations:  mrn = '***', date_of_birth = year only
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating conditional column mask: mrn ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d "{
    \"policyType\": 1,
    \"name\": \"conditional_mask_mrn\",
    \"isEnabled\": true,
    \"isAuditEnabled\": false,
    \"service\": \"${SERVICE_NAME}\",
    \"resources\": {
      \"catalog\": { \"values\": [\"default_catalog\"] },
      \"database\": { \"values\": [\"poc_db\"] },
      \"table\": { \"values\": [\"patients\"] },
      \"column\": { \"values\": [\"mrn\"] }
    },
    \"dataMaskPolicyItems\": [
      {
        \"roles\": [\"role_cbtn_chop\"],
        \"accesses\": [{ \"type\": \"select\", \"isAllowed\": true }],
        \"dataMaskInfo\": {
          \"dataMaskType\": \"CUSTOM\",
          \"valueExpr\": \"CASE WHEN organization = 'chop' THEN {col} ELSE '***' END\"
        }
      }
    ]
  }")
echo "  Response: HTTP ${HTTP_CODE}"
sleep 2

echo ""
echo "=== Creating conditional column mask: date_of_birth ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d "{
    \"policyType\": 1,
    \"name\": \"conditional_mask_dob\",
    \"isEnabled\": true,
    \"isAuditEnabled\": false,
    \"service\": \"${SERVICE_NAME}\",
    \"resources\": {
      \"catalog\": { \"values\": [\"default_catalog\"] },
      \"database\": { \"values\": [\"poc_db\"] },
      \"table\": { \"values\": [\"patients\"] },
      \"column\": { \"values\": [\"date_of_birth\"] }
    },
    \"dataMaskPolicyItems\": [
      {
        \"roles\": [\"role_cbtn_chop\"],
        \"accesses\": [{ \"type\": \"select\", \"isAllowed\": true }],
        \"dataMaskInfo\": {
          \"dataMaskType\": \"CUSTOM\",
          \"valueExpr\": \"CASE WHEN organization = 'chop' THEN {col} ELSE date_trunc('year', {col}) END\"
        }
      }
    ]
  }")
echo "  Response: HTTP ${HTTP_CODE}"

echo ""
echo "=========================================="
echo "  All Ranger roles and policies created!"
echo "=========================================="
echo ""
echo "Wait ~15s for StarRocks to sync, then test:"
echo ""
echo "  mysql -h127.0.0.1 -P9030 -uroot                -e 'SELECT id, first_name, mrn, date_of_birth, tenant, organization FROM poc_db.patients ORDER BY id;'"
echo "  mysql -h127.0.0.1 -P9030 -uuser_cbtn_all      -pcbtnallpass     -e 'SELECT id, first_name, mrn, date_of_birth, tenant, organization FROM poc_db.patients ORDER BY id;'"
echo "  mysql -h127.0.0.1 -P9030 -uuser_cbtn_chop     -pcbtnchoppass    -e 'SELECT id, first_name, mrn, date_of_birth, tenant, organization FROM poc_db.patients ORDER BY id;'"
echo "  mysql -h127.0.0.1 -P9030 -uuser_cbtn_seattle  -pcbtnseattlepass -e 'SELECT id, first_name, mrn, date_of_birth, tenant, organization FROM poc_db.patients ORDER BY id;'"
echo "  mysql -h127.0.0.1 -P9030 -uuser_udp_all       -pudpallpass      -e 'SELECT id, first_name, mrn, date_of_birth, tenant, organization FROM poc_db.patients ORDER BY id;'"
echo ""
echo "Ranger Admin UI: http://localhost:6080  (admin / rangerR0cks!)"
