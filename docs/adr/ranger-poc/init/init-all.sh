#!/bin/bash
# =============================================================================
# Auth-Tables POC init:
#   1. Register StarRocks service definition in Ranger (no portal service)
#   2. Create StarRocks service instance
#   3. Create user stubs in Ranger
#   4. Wait for default policies, then run StarRocks DDL
#   5. Verify current_user() expression
#   6. Create generic Ranger policies (subquery-based row-filter + column mask)
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
# Step 4: Create user stubs in Ranger
# ---------------------------------------------------------------------------
echo ""
echo "=== Registering user stubs in Ranger ==="
for USER in jane alice bob carol dan; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
    -H "Accept: application/json" -H "Content-Type: application/json" \
    "${RANGER_URL}/service/xusers/secure/users" \
    -d "{\"name\":\"${USER}\",\"password\":\"Passw0rd!\",\"userRoleList\":[\"ROLE_USER\"],\"firstName\":\"${USER}\",\"userSource\":0}")
  echo "  ${USER}: HTTP ${HTTP_CODE}"
done
sleep 2

# ---------------------------------------------------------------------------
# Step 5: Create Ranger role for all authenticated users
# Ranger groups do NOT work with StarRocks Ranger plugin.
# We use a single role containing all users for generic policies.
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating role_authenticated (all users) ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/public/v2/api/roles" \
  -d '{"name":"role_authenticated","users":[
    {"name":"jane","isAdmin":false},
    {"name":"alice","isAdmin":false},
    {"name":"bob","isAdmin":false},
    {"name":"carol","isAdmin":false},
    {"name":"dan","isAdmin":false}
  ]}')
echo "  role_authenticated: HTTP ${HTTP_CODE}"
sleep 2

# ---------------------------------------------------------------------------
# Step 6: Wait for default policies, then create StarRocks schema + data
# ---------------------------------------------------------------------------
echo ""
echo "=== Waiting for StarRocks to sync Ranger default policies (20s) ==="
sleep 20

echo ""
echo "=== Creating StarRocks databases, tables, users, and seed data ==="
mysql -hstarrocks -P9030 -uroot < /init/init-starrocks.sql
echo "  Done."
sleep 2

# ---------------------------------------------------------------------------
# Step 6: Verify current_user() expression
# ---------------------------------------------------------------------------
echo ""
echo "=== Verifying current_user() cleanup expression ==="
RESULT=$(mysql -hstarrocks -P9030 -uroot -N -e "SELECT ${CU} AS clean_user;")
echo "  current_user() via root: '${RESULT}'"
RESULT=$(mysql -hstarrocks -P9030 -ujane -pjanepass -N -e "SELECT ${CU} AS clean_user;")
echo "  current_user() via jane: '${RESULT}'"

# ---------------------------------------------------------------------------
# Step 7: Ranger access policies (what users can SELECT/INSERT)
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating Ranger access policies ==="

# Policy 1: SELECT on auth_db (all users need this for subqueries)
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
      "roles": ["role_authenticated"],
      "accesses": [{"type": "select", "isAllowed": true}]
    }]
  }')
echo "  sr_select_auth: HTTP ${HTTP_CODE}"

# Policy 2: SELECT on poc_db (clinical data, read-only)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "sr_select_clinical", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["poc_db"]},
      "table": {"values": ["*"]},
      "column": {"values": ["*"]}
    },
    "policyItems": [{
      "roles": ["role_authenticated"],
      "accesses": [{"type": "select", "isAllowed": true}]
    }]
  }')
echo "  sr_select_clinical: HTTP ${HTTP_CODE}"

# Policy 3: SELECT + INSERT on operational_db (cases, writable)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "sr_access_operational", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["operational_db"]},
      "table": {"values": ["*"]},
      "column": {"values": ["*"]}
    },
    "policyItems": [{
      "roles": ["role_authenticated"],
      "accesses": [
        {"type": "select", "isAllowed": true},
        {"type": "insert", "isAllowed": true}
      ]
    }]
  }')
echo "  sr_access_operational: HTTP ${HTTP_CODE}"

# ---------------------------------------------------------------------------
# Step 8: Row-filter policies on auth tables (users see only their own rows)
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
    "rowFilterPolicyItems": [{
      "roles": ["role_authenticated"],
      "accesses": [{"type": "select", "isAllowed": true}],
      "rowFilterInfo": {
        "filterExpr": "username = '"${CU}"'"
      }
    }]
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
    "rowFilterPolicyItems": [{
      "roles": ["role_authenticated"],
      "accesses": [{"type": "select", "isAllowed": true}],
      "rowFilterInfo": {
        "filterExpr": "username = '"${CU}"'"
      }
    }]
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
    "rowFilterPolicyItems": [{
      "roles": ["role_authenticated"],
      "accesses": [{"type": "select", "isAllowed": true}],
      "rowFilterInfo": {
        "filterExpr": "username = '"${CU}"'"
      }
    }]
  }')
echo "  sr_rowfilter_users: HTTP ${HTTP_CODE}"

# Note: auth_db.tenant and auth_db.organization are reference data — no row filter needed.

# ---------------------------------------------------------------------------
# Step 9: Row-filter policies on data tables (tenant isolation via subquery)
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating data row-filter policies ==="

# Row-filter on poc_db.patients: user sees only rows from their tenant(s)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 2, "name": "sr_rowfilter_patients", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["poc_db"]},
      "table": {"values": ["patients"]}
    },
    "rowFilterPolicyItems": [{
      "roles": ["role_authenticated"],
      "accesses": [{"type": "select", "isAllowed": true}],
      "rowFilterInfo": {
        "filterExpr": "tenant_id IN (SELECT utr.tenant_id FROM auth_db.user_tenant_role utr WHERE utr.username = '"${CU}"')"
      }
    }]
  }')
echo "  sr_rowfilter_patients: HTTP ${HTTP_CODE}"

# Row-filter on operational_db.cases: same tenant isolation
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 2, "name": "sr_rowfilter_cases", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["operational_db"]},
      "table": {"values": ["cases"]}
    },
    "rowFilterPolicyItems": [{
      "roles": ["role_authenticated"],
      "accesses": [{"type": "select", "isAllowed": true}],
      "rowFilterInfo": {
        "filterExpr": "tenant_id IN (SELECT utr.tenant_id FROM auth_db.user_tenant_role utr WHERE utr.username = '"${CU}"')"
      }
    }]
  }')
echo "  sr_rowfilter_cases: HTTP ${HTTP_CODE}"

# ---------------------------------------------------------------------------
# Step 10: Column masking policies (PHI visibility via subquery)
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating column masking policies ==="

# Mask expression: show PHI if user has org role at that org OR tenant_admin/tenant_owner at tenant
# This single expression replaces all per-role mask policies!
MASK_MRN="CASE WHEN org_id IN (SELECT uor.org_id FROM auth_db.user_org_role uor WHERE uor.username = ${CU}) OR tenant_id IN (SELECT utr.tenant_id FROM auth_db.user_tenant_role utr WHERE utr.username = ${CU} AND utr.role IN ('tenant_admin', 'tenant_owner')) THEN {col} ELSE '***' END"

MASK_DOB="CASE WHEN org_id IN (SELECT uor.org_id FROM auth_db.user_org_role uor WHERE uor.username = ${CU}) OR tenant_id IN (SELECT utr.tenant_id FROM auth_db.user_tenant_role utr WHERE utr.username = ${CU} AND utr.role IN ('tenant_admin', 'tenant_owner')) THEN {col} ELSE date_trunc('year', {col}) END"

MASK_NAME="CASE WHEN org_id IN (SELECT uor.org_id FROM auth_db.user_org_role uor WHERE uor.username = ${CU}) OR tenant_id IN (SELECT utr.tenant_id FROM auth_db.user_tenant_role utr WHERE utr.username = ${CU} AND utr.role IN ('tenant_admin', 'tenant_owner')) THEN {col} ELSE '***' END"

# Mask: mrn
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 1, "name": "sr_mask_mrn", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["poc_db"]},
      "table": {"values": ["patients"]},
      "column": {"values": ["mrn"]}
    },
    "dataMaskPolicyItems": [{
      "roles": ["role_authenticated"],
      "accesses": [{"type": "select", "isAllowed": true}],
      "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "'"${MASK_MRN}"'"}
    }]
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
      "database": {"values": ["poc_db"]},
      "table": {"values": ["patients"]},
      "column": {"values": ["first_name"]}
    },
    "dataMaskPolicyItems": [{
      "roles": ["role_authenticated"],
      "accesses": [{"type": "select", "isAllowed": true}],
      "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "'"${MASK_NAME}"'"}
    }]
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
      "database": {"values": ["poc_db"]},
      "table": {"values": ["patients"]},
      "column": {"values": ["date_of_birth"]}
    },
    "dataMaskPolicyItems": [{
      "roles": ["role_authenticated"],
      "accesses": [{"type": "select", "isAllowed": true}],
      "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "'"${MASK_DOB}"'"}
    }]
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
echo "=== Test: Full matrix from design doc ==="
echo ""
echo "  # Jane (org_member at ALL cbtn orgs) - sees CBTN, full PHI everywhere"
echo "  mysql -h127.0.0.1 -P9030 -ujane -pjanepass \\"
echo "    -e 'SELECT id, first_name, mrn, tenant_id, org_id FROM poc_db.patients ORDER BY id;'"
echo ""
echo "  # Alice (org_member at CHOP only) - sees CBTN, CHOP full, BCH masked"
echo "  mysql -h127.0.0.1 -P9030 -ualice -palicepass \\"
echo "    -e 'SELECT id, first_name, mrn, tenant_id, org_id FROM poc_db.patients ORDER BY id;'"
echo ""
echo "  # Bob (tenant_owner CBTN) - sees CBTN, full PHI everywhere"
echo "  mysql -h127.0.0.1 -P9030 -ubob -pbobpass \\"
echo "    -e 'SELECT id, first_name, mrn, tenant_id, org_id FROM poc_db.patients ORDER BY id;'"
echo ""
echo "  # Carol (tenant_member CBTN+UDN, org_member CHOP) - sees CBTN+UDN, CHOP full, rest masked"
echo "  mysql -h127.0.0.1 -P9030 -ucarol -pcarolpass \\"
echo "    -e 'SELECT id, first_name, mrn, tenant_id, org_id FROM poc_db.patients ORDER BY id;'"
echo ""
echo "  # Dan (tenant_member CBTN, no org roles) - sees CBTN, all masked"
echo "  mysql -h127.0.0.1 -P9030 -udan -pdanpass \\"
echo "    -e 'SELECT id, first_name, mrn, tenant_id, org_id FROM poc_db.patients ORDER BY id;'"
echo ""
echo "Ranger Admin UI: http://localhost:6080  (admin / rangerR0cks!)"
