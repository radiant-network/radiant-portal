#!/bin/bash
# =============================================================================
# Combined init:
#   1. Register StarRocks + Portal service definitions in Ranger
#   2. Create users (stubs in Ranger, real in StarRocks)
#   3. Create roles in Ranger (shared across both services)
#   4. Create StarRocks schema + data
#   5. Create StarRocks data policies (row-filter + column masking)
#   6. Create portal action policies
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
echo "=== Registering StarRocks service definition ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  "${RANGER_URL}/service/plugins/definitions" \
  -d @/init/ranger-servicedef-starrocks.json)
echo "  Response: HTTP ${HTTP_CODE}"

echo ""
echo "=== Registering Portal service definition ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  "${RANGER_URL}/service/plugins/definitions" \
  -d @/init/ranger-servicedef-portal.json)
echo "  Response: HTTP ${HTTP_CODE}"
sleep 2

# ---------------------------------------------------------------------------
# Step 3: Create service instances
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating StarRocks service ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  "${RANGER_URL}/service/public/v2/api/service" \
  -d '{"name":"starrocks","type":"starrocks","configs":{"username":"root","password":"","jdbc.driverClassName":"com.mysql.cj.jdbc.Driver","jdbc.url":"jdbc:mysql://starrocks:9030"}}')
echo "  Response: HTTP ${HTTP_CODE}"

echo ""
echo "=== Creating Portal service ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  "${RANGER_URL}/service/public/v2/api/service" \
  -d '{"name":"radiant_portal","type":"radiant_portal","configs":{}}')
echo "  Response: HTTP ${HTTP_CODE}"
sleep 2

# ---------------------------------------------------------------------------
# Step 4: Create user stubs in Ranger
# ---------------------------------------------------------------------------
echo ""
echo "=== Registering user stubs in Ranger ==="
for USER in user_cbtn_submitter_chop user_cbtn_analyst_chop user_cbtn_analyst_seattle user_cbtn_tenant_manager; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
    -H "Accept: application/json" -H "Content-Type: application/json" \
    "${RANGER_URL}/service/xusers/secure/users" \
    -d "{\"name\":\"${USER}\",\"password\":\"Passw0rd!\",\"userRoleList\":[\"ROLE_USER\"],\"firstName\":\"${USER}\",\"userSource\":0}")
  echo "  ${USER}: HTTP ${HTTP_CODE}"
done
sleep 2

# ---------------------------------------------------------------------------
# Step 5: Create Ranger roles and assign users
# Roles are shared across BOTH services (starrocks + radiant_portal)
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating Ranger roles ==="

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/public/v2/api/roles" \
  -d '{"name":"role_cbtn_submitter_chop","users":[{"name":"user_cbtn_submitter_chop","isAdmin":false}]}')
echo "  role_cbtn_submitter_chop: HTTP ${HTTP_CODE}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/public/v2/api/roles" \
  -d '{"name":"role_cbtn_analyst_chop","users":[{"name":"user_cbtn_analyst_chop","isAdmin":false}]}')
echo "  role_cbtn_analyst_chop: HTTP ${HTTP_CODE}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/public/v2/api/roles" \
  -d '{"name":"role_cbtn_analyst_seattle","users":[{"name":"user_cbtn_analyst_seattle","isAdmin":false}]}')
echo "  role_cbtn_analyst_seattle: HTTP ${HTTP_CODE}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/public/v2/api/roles" \
  -d '{"name":"role_cbtn_tenant_manager","users":[{"name":"user_cbtn_tenant_manager","isAdmin":false}]}')
echo "  role_cbtn_tenant_manager: HTTP ${HTTP_CODE}"
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
sleep 2

# ---------------------------------------------------------------------------
# Step 7: StarRocks data policies
# ---------------------------------------------------------------------------

# Access policy: SELECT on patients
echo ""
echo "=== Creating StarRocks access policy ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "sr_select_patients", "isEnabled": true, "isAuditEnabled": false,
    "service": "starrocks",
    "resources": {
      "catalog": {"values": ["default_catalog"]},
      "database": {"values": ["poc_db"]},
      "table": {"values": ["patients"]},
      "column": {"values": ["*"]}
    },
    "policyItems": [{
      "roles": ["role_cbtn_submitter_chop", "role_cbtn_analyst_chop", "role_cbtn_analyst_seattle", "role_cbtn_tenant_manager"],
      "accesses": [{"type": "select", "isAllowed": true}]
    }]
  }')
echo "  Response: HTTP ${HTTP_CODE}"

# Row-filter policy
echo ""
echo "=== Creating StarRocks row-filter policy ==="
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
    "rowFilterPolicyItems": [
      {
        "roles": ["role_cbtn_submitter_chop"],
        "accesses": [{"type": "select", "isAllowed": true}],
        "rowFilterInfo": {"filterExpr": "tenant = '\''cbtn'\'' AND organization = '\''chop'\''"}
      },
      {
        "roles": ["role_cbtn_analyst_chop", "role_cbtn_analyst_seattle", "role_cbtn_tenant_manager"],
        "accesses": [{"type": "select", "isAllowed": true}],
        "rowFilterInfo": {"filterExpr": "tenant = '\''cbtn'\''"}
      }
    ]
  }')
echo "  Response: HTTP ${HTTP_CODE}"

# Column masking: mrn
echo ""
echo "=== Creating StarRocks column mask: mrn ==="
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
    "dataMaskPolicyItems": [
      {
        "roles": ["role_cbtn_analyst_chop"],
        "accesses": [{"type": "select", "isAllowed": true}],
        "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "CASE WHEN organization = '\''chop'\'' THEN {col} ELSE '\''***'\'' END"}
      },
      {
        "roles": ["role_cbtn_analyst_seattle"],
        "accesses": [{"type": "select", "isAllowed": true}],
        "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "CASE WHEN organization = '\''seattle'\'' THEN {col} ELSE '\''***'\'' END"}
      }
    ]
  }')
echo "  Response: HTTP ${HTTP_CODE}"

# Column masking: date_of_birth
echo ""
echo "=== Creating StarRocks column mask: date_of_birth ==="
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
    "dataMaskPolicyItems": [
      {
        "roles": ["role_cbtn_analyst_chop"],
        "accesses": [{"type": "select", "isAllowed": true}],
        "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "CASE WHEN organization = '\''chop'\'' THEN {col} ELSE date_trunc('\''year'\'', {col}) END"}
      },
      {
        "roles": ["role_cbtn_analyst_seattle"],
        "accesses": [{"type": "select", "isAllowed": true}],
        "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": "CASE WHEN organization = '\''seattle'\'' THEN {col} ELSE date_trunc('\''year'\'', {col}) END"}
      }
    ]
  }')
echo "  Response: HTTP ${HTTP_CODE}"
sleep 2

# ---------------------------------------------------------------------------
# Step 8: Portal action policies
# Resources: tenant > organization > resource
# org-scoped actions use specific org (e.g. "chop")
# tenant-scoped actions use org = "*"
# ---------------------------------------------------------------------------
echo ""
echo "=== Creating portal policies ==="

# Org-scoped: submitter can create/edit/delete cases at their org only
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_case_org_write", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant": {"values": ["cbtn"]}, "organization": {"values": ["chop"]}, "resource": {"values": ["case"]}},
    "policyItems": [
      {
        "roles": ["role_cbtn_submitter_chop", "role_cbtn_analyst_chop"],
        "accesses": [
          {"type": "create", "isAllowed": true},
          {"type": "edit", "isAllowed": true},
          {"type": "delete", "isAllowed": true},
          {"type": "assign", "isAllowed": true}
        ]
      }
    ]
  }')
echo "  portal_case_org_write (chop): HTTP ${HTTP_CODE}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_case_org_write_seattle", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant": {"values": ["cbtn"]}, "organization": {"values": ["seattle"]}, "resource": {"values": ["case"]}},
    "policyItems": [
      {
        "roles": ["role_cbtn_analyst_seattle"],
        "accesses": [
          {"type": "create", "isAllowed": true},
          {"type": "edit", "isAllowed": true},
          {"type": "delete", "isAllowed": true},
          {"type": "assign", "isAllowed": true}
        ]
      }
    ]
  }')
echo "  portal_case_org_write (seattle): HTTP ${HTTP_CODE}"

# Tenant-scoped: analyst can search/view cases across the tenant (org=*)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_case_tenant_read", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant": {"values": ["cbtn"]}, "organization": {"values": ["*"]}, "resource": {"values": ["case"]}},
    "policyItems": [
      {
        "roles": ["role_cbtn_analyst_chop", "role_cbtn_analyst_seattle"],
        "accesses": [
          {"type": "search", "isAllowed": true},
          {"type": "view", "isAllowed": true}
        ]
      }
    ]
  }')
echo "  portal_case_tenant_read: HTTP ${HTTP_CODE}"

# Org-scoped: analyst can interpret/comment variants at their org only
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_variant_org_chop", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant": {"values": ["cbtn"]}, "organization": {"values": ["chop"]}, "resource": {"values": ["variant"]}},
    "policyItems": [{
      "roles": ["role_cbtn_analyst_chop"],
      "accesses": [{"type": "interpret", "isAllowed": true}, {"type": "comment", "isAllowed": true}]
    }]
  }')
echo "  portal_variant_org (chop): HTTP ${HTTP_CODE}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_variant_org_seattle", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant": {"values": ["cbtn"]}, "organization": {"values": ["seattle"]}, "resource": {"values": ["variant"]}},
    "policyItems": [{
      "roles": ["role_cbtn_analyst_seattle"],
      "accesses": [{"type": "interpret", "isAllowed": true}, {"type": "comment", "isAllowed": true}]
    }]
  }')
echo "  portal_variant_org (seattle): HTTP ${HTTP_CODE}"

# Org-scoped: analyst report/file/download at their org only
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_report_file_org_chop", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant": {"values": ["cbtn"]}, "organization": {"values": ["chop"]}, "resource": {"values": ["report", "file"]}},
    "policyItems": [{
      "roles": ["role_cbtn_analyst_chop"],
      "accesses": [{"type": "generate", "isAllowed": true}, {"type": "download", "isAllowed": true}]
    }]
  }')
echo "  portal_report_file_org (chop): HTTP ${HTTP_CODE}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_report_file_org_seattle", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant": {"values": ["cbtn"]}, "organization": {"values": ["seattle"]}, "resource": {"values": ["report", "file"]}},
    "policyItems": [{
      "roles": ["role_cbtn_analyst_seattle"],
      "accesses": [{"type": "generate", "isAllowed": true}, {"type": "download", "isAllowed": true}]
    }]
  }')
echo "  portal_report_file_org (seattle): HTTP ${HTTP_CODE}"

# Tenant-scoped: analyst can search/view knowledge base (org=*)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_kb_tenant", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant": {"values": ["cbtn"]}, "organization": {"values": ["*"]}, "resource": {"values": ["kb"]}},
    "policyItems": [{
      "roles": ["role_cbtn_analyst_chop", "role_cbtn_analyst_seattle"],
      "accesses": [{"type": "search", "isAllowed": true}, {"type": "view", "isAllowed": true}]
    }]
  }')
echo "  portal_kb_tenant: HTTP ${HTTP_CODE}"

# Tenant-scoped: tenant_manager admin actions (org=*)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -u "${RANGER_AUTH}" -X POST \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  "${RANGER_URL}/service/plugins/policies" \
  -d '{
    "policyType": 0, "name": "portal_tenant_manager", "isEnabled": true, "isAuditEnabled": false,
    "service": "radiant_portal",
    "resources": {"tenant": {"values": ["cbtn"]}, "organization": {"values": ["*"]}, "resource": {"values": ["project", "user", "codesystem", "genepanel"]}},
    "policyItems": [{
      "roles": ["role_cbtn_tenant_manager"],
      "accesses": [
        {"type": "create", "isAllowed": true},
        {"type": "invite", "isAllowed": true},
        {"type": "manage", "isAllowed": true},
        {"type": "edit", "isAllowed": true}
      ]
    }]
  }')
echo "  portal_tenant_manager: HTTP ${HTTP_CODE}"

echo ""
echo "=========================================="
echo "  All Ranger roles and policies created!"
echo "=========================================="
echo ""
echo "Test the POC API:"
echo ""
echo "  # Analyst searches cases (allowed, sees filtered+masked data)"
echo "  curl -s -H 'X-User: user_cbtn_analyst_chop' http://localhost:8080/cases | jq"
echo ""
echo "  # Submitter searches cases (denied)"
echo "  curl -s -H 'X-User: user_cbtn_submitter_chop' http://localhost:8080/cases | jq"
echo ""
echo "  # Analyst interprets variant (allowed)"
echo "  curl -s -H 'X-User: user_cbtn_analyst_chop' http://localhost:8080/cases/1/interpret | jq"
echo ""
echo "  # Submitter interprets variant (denied)"
echo "  curl -s -H 'X-User: user_cbtn_submitter_chop' http://localhost:8080/cases/1/interpret | jq"
echo ""
echo "  # Tenant manager invites user (allowed)"
echo "  curl -s -X POST -H 'X-User: user_cbtn_tenant_manager' http://localhost:8080/users/invite | jq"
echo ""
echo "  # Analyst invites user (denied)"
echo "  curl -s -X POST -H 'X-User: user_cbtn_analyst_chop' http://localhost:8080/users/invite | jq"
echo ""
echo "Ranger Admin UI: http://localhost:6080  (admin / rangerR0cks!)"
