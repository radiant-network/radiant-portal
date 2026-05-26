#!/bin/bash
# =============================================================================
# Auth-Tables POC init:
#   1. Register StarRocks service definition in Ranger
#   2. Create StarRocks service instance
#   3. Configure Keycloak (realm, client, users)
#   4. Create StarRocks schema + data (JWT-authenticated users)
#   5. Create Ranger roles (authenticated, cbtn_member, udn_member)
#   6. Create Ranger access policies (DB visibility via Ranger roles)
#      + auth_db self-access row-filters + column-mask policies on data tables.
# =============================================================================

set -e

RANGER_URL="http://ranger:6080"
RANGER_AUTH="admin:rangerR0cks!"

apt-get update -qq && apt-get install -y -qq curl > /dev/null 2>&1

# ---------------------------------------------------------------------------
# Helper: clean username from current_user() which returns 'user'@'%'
# This expression is interpolated into all Ranger policy filter/mask strings.
# ---------------------------------------------------------------------------
CU="replace(substring_index(current_user(), '@', 1), char(39), '')"

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
  -H "Accept: application/json" -H "Content-Type: application/json" \
  "${RANGER_URL}/service/plugins/definitions" \
  -d @/init/ranger-servicedef-starrocks.json)
echo "  Response: HTTP ${HTTP_CODE}"
sleep 2

# ---------------------------------------------------------------------------
# Step 3: Create StarRocks service instance
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating StarRocks service ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  "${RANGER_URL}/service/public/v2/api/service" \
  -d '{"name":"starrocks","type":"starrocks","configs":{"username":"root","password":"","jdbc.driverClassName":"com.mysql.cj.jdbc.Driver","jdbc.url":"jdbc:mysql://starrocks:9030"}}')
echo "  Response: HTTP ${HTTP_CODE}"
sleep 2

# ---------------------------------------------------------------------------
# Step 4: Configure Keycloak (realm, client, users)
# ---------------------------------------------------------------------------
echo ""
echo "=== Configuring Keycloak ==="
bash /init/init-keycloak.sh

# ---------------------------------------------------------------------------
# Step 5: Wait for default policies, then create StarRocks schema + data
# ---------------------------------------------------------------------------
echo ""
echo "=== Waiting for StarRocks to sync Ranger default policies (20s) ==="
sleep 20

echo ""
echo "=== Creating StarRocks databases, tables, users (JWT auth), and seed data ==="
mysql -hstarrocks -P9030 -uroot < /init/init-starrocks.sql
echo "  Done."
sleep 2

# ---------------------------------------------------------------------------
# Step 6: Verify current_user() expression (using root — JWT users need proxy)
# ---------------------------------------------------------------------------
echo ""
echo "=== Verifying current_user() cleanup expression ==="
RESULT=$(mysql -hstarrocks -P9030 -uroot -N -e "SELECT ${CU} AS clean_user;")
echo "  current_user() via root: '${RESULT}'"

# ---------------------------------------------------------------------------
# Step 7a: Ranger users
# Ranger refuses to add a user to a role unless the user record already
# exists. The password here is unused (StarRocks auth is JWT via Keycloak),
# but Ranger requires a password meeting its complexity rules.
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating Ranger users ==="

create_ranger_user() {
  local username="$1"
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
    -H "Content-Type: application/json" -H "Accept: application/json" \
    "${RANGER_URL}/service/xusers/secure/users" \
    -d "{\"name\":\"${username}\",\"firstName\":\"${username}\",\"emailAddress\":\"\",\"password\":\"Unused-P0c123!\",\"userRoleList\":[\"ROLE_USER\"]}")
  echo "  ${username}: HTTP ${HTTP_CODE}"
}

for u in jane alice bob carol dan admin1; do
  create_ranger_user "$u"
done

# ---------------------------------------------------------------------------
# Step 7b: Ranger roles — DB visibility is enforced via per-tenant roles.
# Initial membership mirrors the auth_db seed in init-starrocks.sql.
# The admin API (poc-api) maintains role membership on every grant/revoke.
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating Ranger roles ==="

create_role() {
  local role_name="$1"
  local users_json="$2"
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
    -H "Content-Type: application/json" -H "Accept: application/json" \
    "${RANGER_URL}/service/roles/roles" \
    -d "{\"name\": \"${role_name}\", \"users\": ${users_json}, \"createdByUser\": \"admin\"}")
  echo "  ${role_name}: HTTP ${HTTP_CODE}"
}

# authenticated: every user with any tenant assignment in auth_db.
create_role "authenticated" '[
  {"name":"jane","isAdmin":false},
  {"name":"alice","isAdmin":false},
  {"name":"bob","isAdmin":false},
  {"name":"carol","isAdmin":false},
  {"name":"dan","isAdmin":false},
  {"name":"admin1","isAdmin":false}
]'

# cbtn_member: users with any role at tenant cbtn.
create_role "cbtn_member" '[
  {"name":"jane","isAdmin":false},
  {"name":"alice","isAdmin":false},
  {"name":"bob","isAdmin":false},
  {"name":"carol","isAdmin":false},
  {"name":"dan","isAdmin":false},
  {"name":"admin1","isAdmin":false}
]'

# udn_member: users with any role at tenant udn.
create_role "udn_member" '[
  {"name":"carol","isAdmin":false},
  {"name":"admin1","isAdmin":false}
]'

# ---------------------------------------------------------------------------
# Step 8: Ranger access policies — bound to Ranger roles for DB visibility
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating Ranger access policies ==="

# Policy: SELECT on auth_db (everyone authenticated, for subquery lookups)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "sr_select_auth", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["auth_db"]},
      "table": {"values": ["*"]},
      "column": {"values": ["*"]}
    },
    "policyItems": [{
      "roles": ["authenticated"],
      "accesses": [{"type": "select", "isAllowed": true}]
    }]
  }')
echo "  sr_select_auth: HTTP ${HTTP_CODE}"

# Policy: SELECT on cbtn_db (members of Ranger role cbtn_member).
# Writes are not granted to end users — ETL runs as a service account and
# API writes go to PostgreSQL; for the POC, all StarRocks writes use root.
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "sr_select_cbtn", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["cbtn_db"]},
      "table": {"values": ["*"]},
      "column": {"values": ["*"]}
    },
    "policyItems": [{
      "roles": ["cbtn_member"],
      "accesses": [{"type": "select", "isAllowed": true}]
    }]
  }')
echo "  sr_select_cbtn: HTTP ${HTTP_CODE}"

# Policy: SELECT on udn_db (members of Ranger role udn_member).
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "sr_select_udn", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["udn_db"]},
      "table": {"values": ["*"]},
      "column": {"values": ["*"]}
    },
    "policyItems": [{
      "roles": ["udn_member"],
      "accesses": [{"type": "select", "isAllowed": true}]
    }]
  }')
echo "  sr_select_udn: HTTP ${HTTP_CODE}"

# ---------------------------------------------------------------------------
# Step 9: Row-filter policies on auth tables (users see only their own rows)
# These remain unchanged — they protect auth_db.* against self-introspection
# leakage when alice queries auth_db looking for someone else's assignments.
# Note: role, action, role_action, tenant, organization are reference data — no row filter needed.
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating auth-table row-filter policies ==="

# Row-filter on auth_db.user_tenant_role: users see only their own assignments
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 2, "name": "sr_rowfilter_user_tenant_role", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["auth_db"]},
      "table": {"values": ["user_tenant_role"]}
    },
    "rowFilterPolicyItems": [
      {"users": ["root"], "accesses": [{"type": "select", "isAllowed": true}], "rowFilterInfo": {"filterExpr": "1=1"}},
      {"users": ["{USER}"], "accesses": [{"type": "select", "isAllowed": true}], "rowFilterInfo": {"filterExpr": "username = '"${CU}"'"}}
    ]
  }')
echo "  sr_rowfilter_user_tenant_role: HTTP ${HTTP_CODE}"

# Row-filter on auth_db.user_org_role: users see only their own assignments
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 2, "name": "sr_rowfilter_user_org_role", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["auth_db"]},
      "table": {"values": ["user_org_role"]}
    },
    "rowFilterPolicyItems": [
      {"users": ["root"], "accesses": [{"type": "select", "isAllowed": true}], "rowFilterInfo": {"filterExpr": "1=1"}},
      {"users": ["{USER}"], "accesses": [{"type": "select", "isAllowed": true}], "rowFilterInfo": {"filterExpr": "username = '"${CU}"'"}}
    ]
  }')
echo "  sr_rowfilter_user_org_role: HTTP ${HTTP_CODE}"

# Row-filter on auth_db.users: users see only their own record
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 2, "name": "sr_rowfilter_users", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["auth_db"]},
      "table": {"values": ["users"]}
    },
    "rowFilterPolicyItems": [
      {"users": ["root"], "accesses": [{"type": "select", "isAllowed": true}], "rowFilterInfo": {"filterExpr": "1=1"}},
      {"users": ["{USER}"], "accesses": [{"type": "select", "isAllowed": true}], "rowFilterInfo": {"filterExpr": "username = '"${CU}"'"}}
    ]
  }')
echo "  sr_rowfilter_users: HTTP ${HTTP_CODE}"

# Note: auth_db.tenant and auth_db.organization are reference data — no row filter needed.

# Tenant scoping on data tables (sr_rowfilter_patients, sr_rowfilter_cases)
# is no longer needed: per-tenant DBs (cbtn_db, udn_db) plus the access
# policies above mean a non-member can't see the database at all. Org-level
# row filtering inside a tenant DB is intentionally out of scope; the PII
# column mask below already keys on org_id.

# ---------------------------------------------------------------------------
# Step 10: Column masking policies (PHI visibility via subquery)
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating column masking policies ==="

# Mask expression: show PHI if user has an org role with can_read_pii action.
# PII is strictly org-scoped — tenant roles never grant PII.
# Handles both specific org assignments and * (all orgs in tenant) via UNION.
PII_ORGS="SELECT uor.org_id FROM auth_db.user_org_role uor JOIN auth_db.role_action ra ON ra.tenant_id = uor.tenant_id AND ra.role_id = uor.role_id WHERE uor.username = ${CU} AND ra.action_id = 'can_read_pii' AND uor.org_id != '*' UNION SELECT o.org_id FROM auth_db.organization o JOIN auth_db.user_org_role uor ON uor.tenant_id = o.tenant_id AND uor.org_id = '*' JOIN auth_db.role_action ra ON ra.tenant_id = uor.tenant_id AND ra.role_id = uor.role_id WHERE uor.username = ${CU} AND ra.action_id = 'can_read_pii'"

MASK_MRN="CASE WHEN org_id IN (${PII_ORGS}) THEN {col} ELSE '***' END"
MASK_DOB="CASE WHEN org_id IN (${PII_ORGS}) THEN {col} ELSE date_trunc('year', {col}) END"
MASK_NAME="CASE WHEN org_id IN (${PII_ORGS}) THEN {col} ELSE '***' END"

# Mask: mrn
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 1, "name": "sr_mask_mrn", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["cbtn_db", "udn_db"]},
      "table": {"values": ["patients"]},
      "column": {"values": ["mrn"]}
    },
    "dataMaskPolicyItems": [
      {"users": ["root"], "accesses": [{"type": "select", "isAllowed": true}], "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "{col}"}},
      {"users": ["{USER}"], "accesses": [{"type": "select", "isAllowed": true}], "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "'"${MASK_MRN}"'"}}
    ]
  }')
echo "  sr_mask_mrn: HTTP ${HTTP_CODE}"

# Mask: first_name
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 1, "name": "sr_mask_first_name", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["cbtn_db", "udn_db"]},
      "table": {"values": ["patients"]},
      "column": {"values": ["first_name"]}
    },
    "dataMaskPolicyItems": [
      {"users": ["root"], "accesses": [{"type": "select", "isAllowed": true}], "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "{col}"}},
      {"users": ["{USER}"], "accesses": [{"type": "select", "isAllowed": true}], "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "'"${MASK_NAME}"'"}}
    ]
  }')
echo "  sr_mask_first_name: HTTP ${HTTP_CODE}"

# Mask: date_of_birth
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 1, "name": "sr_mask_dob", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["cbtn_db", "udn_db"]},
      "table": {"values": ["patients"]},
      "column": {"values": ["date_of_birth"]}
    },
    "dataMaskPolicyItems": [
      {"users": ["root"], "accesses": [{"type": "select", "isAllowed": true}], "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "{col}"}},
      {"users": ["{USER}"], "accesses": [{"type": "select", "isAllowed": true}], "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "'"${MASK_DOB}"'"}}
    ]
  }')
echo "  sr_mask_dob: HTTP ${HTTP_CODE}"

sleep 2

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo "=========================================="
echo "  Auth-Tables POC initialization complete!"
echo "=========================================="
echo ""
echo "=== Test via mysql-proxy (port 9031) with JWT tokens ==="
echo ""
echo "  # 1. Get a JWT token for jane from Keycloak:"
echo "  TOKEN=\$(curl -s -X POST http://localhost:8180/realms/starrocks/protocol/openid-connect/token \\"
echo "    -d 'client_id=starrocks&username=jane&password=janepass&grant_type=password' | jq -r '.access_token')"
echo ""
echo "  # 2. Connect via proxy with JWT as password (use --enable-cleartext-plugin):"
echo "  mysql -h127.0.0.1 -P9031 -ujane -p\"\${TOKEN}\" --enable-cleartext-plugin \\"
echo "    -e 'SELECT id, first_name, mrn, org_id FROM cbtn_db.patients ORDER BY id;'"
echo ""
echo "  # 3. Test API with Bearer token:"
echo "  curl -s -H \"Authorization: Bearer \${TOKEN}\" http://localhost:8080/cbtn/patients | jq"
echo ""
echo "Ranger Admin UI:  http://localhost:6080  (admin / rangerR0cks!)"
echo "Keycloak Admin:   http://localhost:8180  (admin / admin)"
echo "MySQL Proxy:      port 9031 (JWT as password)"
echo "StarRocks Direct: port 9030 (root only, native password)"
