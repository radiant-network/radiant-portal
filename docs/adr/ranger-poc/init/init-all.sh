#!/bin/bash
# =============================================================================
# Simplified model:
#   - 3 roles per tenant (no org suffix): role_{tenant}_submitter, _analyst, _tenant_manager
#   - Orgs stored as user attribute: otherAttributes.orgs = "'chop','seattle'"
#   - Column masking uses ${{USER.orgs}} dynamic expression
#   - Portal org-scoped enforcement checks user's orgs attribute
#
# To give a user access:
#   1. Add to a ROLE (controls what they can DO + which tenant)
#   2. Set ORGS attribute (controls which orgs' PII they can see)
#
# Test users:
#   user_alice  = submitter at CBTN, org: chop
#   user_bob    = analyst at CBTN, orgs: chop + seattle (multi-org)
#   user_carol  = analyst at CBTN, org: seattle
#   user_dave   = tenant_manager at CBTN, all orgs
# =============================================================================

set -e

RANGER_URL="http://ranger:6080"
RANGER_AUTH="admin:rangerR0cks!"

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
# Step 2: Register service definitions
# ---------------------------------------------------------------------------
echo ""
echo "=== Registering service definitions ==="
for DEF in ranger-servicedef-starrocks.json ranger-servicedef-portal.json; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
    -H "Accept: application/json" -H "Content-Type: application/json" \
    "${RANGER_URL}/service/plugins/definitions" -d @/init/${DEF})
  echo "  ${DEF}: HTTP ${HTTP_CODE}"
done
sleep 2

# ---------------------------------------------------------------------------
# Step 3: Create service instances
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating service instances ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  "${RANGER_URL}/service/public/v2/api/service" \
  -d '{"name":"starrocks","type":"starrocks","configs":{"username":"root","password":"","jdbc.driverClassName":"com.mysql.cj.jdbc.Driver","jdbc.url":"jdbc:mysql://starrocks:9030"}}')
echo "  starrocks: HTTP ${HTTP_CODE}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  "${RANGER_URL}/service/public/v2/api/service" \
  -d '{"name":"radiant_portal","type":"radiant_portal","configs":{}}')
echo "  radiant_portal: HTTP ${HTTP_CODE}"
sleep 2

# ---------------------------------------------------------------------------
# Step 4: Create users with org attributes
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating users with org attributes ==="

create_user() {
  local name=$1; local orgs=$2
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
    -H "Accept: application/json" -H "Content-Type: application/json" \
    "${RANGER_URL}/service/xusers/secure/users" \
    -d "{\"name\":\"${name}\",\"password\":\"Passw0rd!\",\"userRoleList\":[\"ROLE_USER\"],\"firstName\":\"${name}\",\"userSource\":0,\"otherAttributes\":\"{\\\"orgs\\\": \\\"${orgs}\\\"}\"}")
  echo "  ${name} (orgs: ${orgs}): HTTP ${HTTP_CODE}"
}

create_user "user_alice" "'chop'"                # submitter, CHOP only
create_user "user_bob"   "'chop','seattle'"      # analyst, CHOP + Seattle
create_user "user_carol" "'seattle'"             # analyst, Seattle only
create_user "user_dave"  "'chop','seattle'"      # tenant_manager, all orgs
sleep 2

# ---------------------------------------------------------------------------
# Step 5: Create roles (3 per tenant, NO org suffix)
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating roles (no org in role name) ==="

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/public/v2/api/roles" \
  -d '{"name":"role_cbtn_submitter","users":[{"name":"user_alice","isAdmin":false}]}')
echo "  role_cbtn_submitter (user_alice): HTTP ${HTTP_CODE}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/public/v2/api/roles" \
  -d '{"name":"role_cbtn_analyst","users":[{"name":"user_bob","isAdmin":false},{"name":"user_carol","isAdmin":false}]}')
echo "  role_cbtn_analyst (user_bob, user_carol): HTTP ${HTTP_CODE}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/public/v2/api/roles" \
  -d '{"name":"role_cbtn_tenant_manager","users":[{"name":"user_dave","isAdmin":false}]}')
echo "  role_cbtn_tenant_manager (user_dave): HTTP ${HTTP_CODE}"
sleep 2

# ---------------------------------------------------------------------------
# Step 6: Wait for default policies, then create StarRocks schema
# ---------------------------------------------------------------------------
echo ""
echo "=== Waiting for StarRocks to sync Ranger default policies (20s) ==="
sleep 20

echo ""
echo "=== Creating StarRocks database, tables, and users ==="
mysql -hstarrocks -P9030 -uroot < /init/init-starrocks.sql
echo "  Done."

# Create JWT Security Integration and a test JWT user.
# This requires SECURITY privilege which is granted via the security_admin built-in role.
# The Ranger default system policy grants 'operate' to root but not 'security'.
# We need to temporarily ensure root has security_admin role activated.
echo ""
echo "=== Setting up JWT authentication ==="
mysql -hstarrocks -P9030 -uroot -e "
  SET ROLE security_admin;
  CREATE SECURITY INTEGRATION IF NOT EXISTS jwt_auth
  PROPERTIES (
    'type' = 'authentication_jwt',
    'jwks_url' = 'jwks.json',
    'principal_field' = 'preferred_username'
  );
  CREATE USER IF NOT EXISTS user_jwt_bob IDENTIFIED WITH authentication_jwt AS '{\"security_integration\": \"jwt_auth\"}';
" 2>&1
echo "  Done. (errors expected if SECURITY privilege not available via Ranger)"
sleep 2

# =====================================================================
# STARROCKS POLICIES
# =====================================================================

# Access: SELECT on patients for all roles
echo ""
echo "=== [SR] Access policy ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "sr_select_patients", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {"catalog":{"values":["default_catalog"]},"database":{"values":["poc_db"]},"table":{"values":["patients"]},"column":{"values":["*"]}},
    "policyItems": [{"roles":["role_cbtn_submitter","role_cbtn_analyst","role_cbtn_tenant_manager"],"accesses":[{"type":"select","isAllowed":true}]}]
  }')
echo "  Response: HTTP ${HTTP_CODE}"

# Row-filter: submitter sees only their orgs, analyst/manager sees full tenant
echo ""
echo "=== [SR] Row-filter policy ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 2, "name": "sr_rowfilter_patients", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {"catalog":{"values":["default_catalog"]},"database":{"values":["poc_db"]},"table":{"values":["patients"]}},
    "rowFilterPolicyItems": [
      {
        "roles": ["role_cbtn_submitter"],
        "accesses": [{"type": "select", "isAllowed": true}],
        "rowFilterInfo": {"filterExpr": "tenant = '\''cbtn'\'' AND organization IN (${{USER.orgs}})"}
      },
      {
        "roles": ["role_cbtn_analyst", "role_cbtn_tenant_manager"],
        "accesses": [{"type": "select", "isAllowed": true}],
        "rowFilterInfo": {"filterExpr": "tenant = '\''cbtn'\''"}
      }
    ]
  }')
echo "  Response: HTTP ${HTTP_CODE}"

# Column mask: mrn — uses ${{USER.orgs}} dynamic expression
echo ""
echo "=== [SR] Column mask: mrn ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 1, "name": "sr_mask_mrn", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {"catalog":{"values":["default_catalog"]},"database":{"values":["poc_db"]},"table":{"values":["patients"]},"column":{"values":["mrn"]}},
    "dataMaskPolicyItems": [{
      "roles": ["role_cbtn_analyst"],
      "accesses": [{"type": "select", "isAllowed": true}],
      "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "CASE WHEN organization IN (${{USER.orgs}}) THEN {col} ELSE '\''***'\'' END"}
    }]
  }')
echo "  Response: HTTP ${HTTP_CODE}"

# Column mask: date_of_birth
echo ""
echo "=== [SR] Column mask: date_of_birth ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 1, "name": "sr_mask_dob", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {"catalog":{"values":["default_catalog"]},"database":{"values":["poc_db"]},"table":{"values":["patients"]},"column":{"values":["date_of_birth"]}},
    "dataMaskPolicyItems": [{
      "roles": ["role_cbtn_analyst"],
      "accesses": [{"type": "select", "isAllowed": true}],
      "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "CASE WHEN organization IN (${{USER.orgs}}) THEN {col} ELSE date_trunc('\''year'\'', {col}) END"}
    }]
  }')
echo "  Response: HTTP ${HTTP_CODE}"
sleep 2

# =====================================================================
# PORTAL POLICIES (tenant > resource — no organization level)
# Org-scoped enforcement is handled by the API via user orgs attribute.
# Policies only define WHAT a role can DO, not WHERE.
# =====================================================================
echo ""
echo "=== Creating portal policies ==="

# Case: submitter can create/edit/delete; analyst can do everything
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_case", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant":{"values":["cbtn"]},"resource":{"values":["case"]}},
    "policyItems": [
      {"roles":["role_cbtn_submitter"],"accesses":[{"type":"create","isAllowed":true},{"type":"edit","isAllowed":true},{"type":"delete","isAllowed":true}]},
      {"roles":["role_cbtn_analyst"],"accesses":[{"type":"create","isAllowed":true},{"type":"edit","isAllowed":true},{"type":"delete","isAllowed":true},{"type":"search","isAllowed":true},{"type":"view","isAllowed":true},{"type":"assign","isAllowed":true}]}
    ]
  }')
echo "  portal_case: HTTP ${HTTP_CODE}"

# Variant: analyst can interpret/comment
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_variant", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant":{"values":["cbtn"]},"resource":{"values":["variant"]}},
    "policyItems": [{"roles":["role_cbtn_analyst"],"accesses":[{"type":"interpret","isAllowed":true},{"type":"comment","isAllowed":true}]}]
  }')
echo "  portal_variant: HTTP ${HTTP_CODE}"

# Report + file: analyst can generate/download
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_report_file", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant":{"values":["cbtn"]},"resource":{"values":["report","file"]}},
    "policyItems": [{"roles":["role_cbtn_analyst"],"accesses":[{"type":"generate","isAllowed":true},{"type":"download","isAllowed":true}]}]
  }')
echo "  portal_report_file: HTTP ${HTTP_CODE}"

# KB: analyst can search/view
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_kb", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant":{"values":["cbtn"]},"resource":{"values":["kb"]}},
    "policyItems": [{"roles":["role_cbtn_analyst"],"accesses":[{"type":"search","isAllowed":true},{"type":"view","isAllowed":true}]}]
  }')
echo "  portal_kb: HTTP ${HTTP_CODE}"

# Tenant manager: admin actions
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_tenant_manager", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant":{"values":["cbtn"]},"resource":{"values":["project","user","codesystem","genepanel"]}},
    "policyItems": [{"roles":["role_cbtn_tenant_manager"],"accesses":[{"type":"create","isAllowed":true},{"type":"invite","isAllowed":true},{"type":"manage","isAllowed":true},{"type":"edit","isAllowed":true}]}]
  }')
echo "  portal_tenant_manager: HTTP ${HTTP_CODE}"

echo ""
echo "=========================================="
echo "  All done!"
echo "=========================================="
echo ""
echo "Test users:"
echo "  user_alice  = submitter, org: chop"
echo "  user_bob    = analyst, orgs: chop + seattle (sees all PII)"
echo "  user_carol  = analyst, org: seattle (chop PII masked)"
echo "  user_dave   = tenant_manager, all orgs"
echo ""
echo "StarRocks:"
echo "  mysql -h127.0.0.1 -P9030 -uuser_alice -palice123 -e 'SELECT id,first_name,mrn,date_of_birth,organization FROM poc_db.patients ORDER BY id;'"
echo "  mysql -h127.0.0.1 -P9030 -uuser_bob   -pbob123   -e 'SELECT id,first_name,mrn,date_of_birth,organization FROM poc_db.patients ORDER BY id;'"
echo "  mysql -h127.0.0.1 -P9030 -uuser_carol -pcarol123 -e 'SELECT id,first_name,mrn,date_of_birth,organization FROM poc_db.patients ORDER BY id;'"
echo ""
echo "POC API:"
echo "  curl -s -H 'X-User: user_bob' http://localhost:8080/cbtn/cases | jq"
echo "  curl -s -H 'X-User: user_bob' -X POST http://localhost:8080/cbtn/chop/cases | jq"
echo "  curl -s -H 'X-User: user_bob' -X POST http://localhost:8080/cbtn/seattle/cases | jq"
echo "  curl -s -H 'X-User: user_alice' -X POST http://localhost:8080/cbtn/chop/cases | jq"
echo "  curl -s -H 'X-User: user_alice' -X POST http://localhost:8080/cbtn/seattle/cases | jq"
echo ""
echo "Ranger Admin: http://localhost:6080 (admin / rangerR0cks!)"
