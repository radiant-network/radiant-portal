#!/usr/bin/env python3
"""
03_ranger_policies.py — Ranger roles + access/row-filter/mask policies for the
multi-tenant PII-masking simulation. Stdlib only (urllib); idempotent.

    python3 03_ranger_policies.py

ROLE ORGANISATION (the design we settled on)
  admin_role      platform admins. Full access to every tenant DB; NEVER masked.
  tenant_a_user   access to the tenant_a DB.
  tenant_b_user   access to the tenant_b DB.
  user_role       "non-admin" marker = the subject of masking. It does NOT list
                  users directly; instead it CONTAINS the tenant_* roles as
                  sub-roles, so anyone in a tenant role is transitively a
                  user_role member (assign the tenant role once, the mask marker
                  comes for free). admins are not in user_role -> never masked.

POLICIES (service `starrocks`)
  access     mtm_access_admin      admin_role  -> SELECT on tenant_*   (wildcard)
  access     mtm_access_tenant_a   tenant_a_user -> SELECT on tenant_a
  access     mtm_access_tenant_b   tenant_b_user -> SELECT on tenant_b
  access     mtm_access_auth_grant user_role   -> SELECT on auth.pii_grant
  rowfilter  mtm_rowfilter_auth_grant           any user sees only their own rows
  mask       mtm_mask_pii_redact   CUSTOM '***' mask on mrn/first_name/last_name
  mask       mtm_mask_dob          CUSTOM year-only mask on date_of_birth
                                   - user_role : PII only where the login has
                                     can_read_pii for the row's (tenant, org).
                                   No item for root/admin_role is needed: Ranger
                                   returns a column UNMASKED when the user matches
                                   no mask item, and neither root nor admin_role
                                   is in user_role -> they see raw values by default.

ONE masking policy per column covers EVERY tenant via the `tenant_*` wildcard —
add tenant_c later and it's masked automatically, no new policy.
"""

import base64
import json
import os
import sys
import urllib.error
import urllib.request

RANGER_URL = os.environ.get("RANGER_URL", "http://localhost:6080")
RANGER_USER = os.environ.get("RANGER_ADMIN_USER", "admin")
RANGER_PASS = os.environ.get("RANGER_ADMIN_PASSWORD", "rangerR0cks!")
SERVICE = "starrocks"

# login -> which tenant role they belong to ; plus the admin
TENANT_MEMBERS = {"tenant_a_user": ["alice", "wendy"], "tenant_b_user": ["bob"]}
ADMINS = ["svc_admin_api"]
ALL_LOGINS = [u for members in TENANT_MEMBERS.values() for u in members] + ADMINS

_AUTH = "Basic " + base64.b64encode(f"{RANGER_USER}:{RANGER_PASS}".encode()).decode()


def _request(method, path, body=None):
    url = f"{RANGER_URL}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", _AUTH)
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()
    except urllib.error.URLError as e:
        print(f"  !! cannot reach Ranger at {RANGER_URL}: {e}", file=sys.stderr)
        sys.exit(1)


# --- Ranger users (must exist before being added to a role) -----------------
def ensure_user(login):
    body = {"name": login, "firstName": login, "emailAddress": "",
            "password": "Unused-P0c123!", "userRoleList": ["ROLE_USER"]}
    status, _ = _request("POST", "/service/xusers/secure/users", body)
    # 400 == already exists -> fine
    print(f"  user {login}: HTTP {status}")


# --- Ranger roles (upsert by name: PUT if present, else POST) ---------------
def upsert_role(name, users=None, sub_roles=None):
    role = {
        "name": name, "createdByUser": "admin",
        "users": [{"name": u, "isAdmin": False} for u in (users or [])],
        "roles": [{"name": r, "isAdmin": False} for r in (sub_roles or [])],
    }
    status, payload = _request("GET", f"/service/roles/roles/name/{name}")
    if status == 200:
        rid = json.loads(payload).get("id")
        role["id"] = rid
        status, payload = _request("PUT", f"/service/roles/roles/{rid}", role)
    else:
        status, payload = _request("POST", "/service/roles/roles", role)
    ok = status in (200, 201)
    print(f"  role {name}: HTTP {status}" + ("" if ok else f"  {payload[:200]}"))
    return ok


# --- policies (delete-by-name then create) ----------------------------------
def upsert_policy(policy):
    name = policy["name"]
    _request("DELETE", f"/service/public/v2/api/policy?servicename={SERVICE}&policyname={name}")
    status, payload = _request("POST", "/service/plugins/policies", policy)
    ok = status in (200, 201)
    print(f"  policy {name}: HTTP {status}" + ("" if ok else f"  {payload[:300]}"))
    return ok


# --- mask expression --------------------------------------------------------
# current_user() -> "'<login>'@'%'": drop leading quote, take up to next quote.
# Used by the auth.pii_grant row-filter below.
LOGIN = "substring_index(substr(current_user(), 2), char(39), 1)"
# The patient views expose a can_read_pii column (1 when the current login holds
# can_read_pii for that row's org — same condition, computed once in the view).
# The masks just reference it, so the rule lives in exactly one place.
MASK_REDACT = "CASE WHEN can_read_pii THEN {col} ELSE '***' END"
MASK_DOB = "CASE WHEN can_read_pii THEN {col} ELSE cast(date_trunc('year', {col}) as date) END"


def access_policy(name, databases, tables, roles):
    return {
        "policyType": 0, "name": name, "isEnabled": True, "isAuditEnabled": False,
        "service": SERVICE,
        "resources": {
            "catalog": {"values": ["default_catalog"]},
            "database": {"values": databases},
            "table": {"values": tables},
            "column": {"values": ["*"]},
        },
        "policyItems": [{"roles": roles,
                         "accesses": [{"type": "select", "isAllowed": True}]}],
    }


def mask_policy(name, columns, value_expr):
    # `columns` may list several columns that share the SAME mask — Ranger
    # substitutes {col} per-column, so one policy covers them all.
    return {
        "policyType": 1, "name": name, "isEnabled": True, "isAuditEnabled": False,
        "service": SERVICE,
        "resources": {
            "catalog": {"values": ["default_catalog"]},
            "database": {"values": ["tenant_*"]},   # ONE policy, every tenant
            "table": {"values": ["patient"]},
            "column": {"values": columns},
        },
        "dataMaskPolicyItems": [
            # Only user_role is masked. No match (root, admin_role, anyone else)
            # => Ranger returns the column unmasked. So admins/root need no item.
            {"roles": ["user_role"],
             "accesses": [{"type": "select", "isAllowed": True}],
             "dataMaskInfo": {"dataMaskType": "CUSTOM", "valueExpr": value_expr}},
        ],
    }


def main():
    print(f"Target: service '{SERVICE}' on {RANGER_URL}\n")

    print("Ranger users:")
    for login in ALL_LOGINS:
        ensure_user(login)

    print("\nRanger roles:")
    for role, members in TENANT_MEMBERS.items():
        upsert_role(role, users=members)
    upsert_role("admin_role", users=ADMINS)
    # user_role contains the tenant roles -> tenant members are masking subjects
    upsert_role("user_role", sub_roles=list(TENANT_MEMBERS.keys()))

    # Drop policies that earlier revisions created but we no longer use, so a
    # re-run converges to exactly the current set.
    for old in ("mtm_mask_mrn", "mtm_mask_first_name", "mtm_mask_last_name"):
        _request("DELETE", f"/service/public/v2/api/policy?servicename={SERVICE}&policyname={old}")

    print("\nPolicies:")
    policies = [
        access_policy("mtm_access_admin", ["tenant_*"], ["*"], ["admin_role"]),
        access_policy("mtm_access_tenant_a", ["tenant_a"], ["*"], ["tenant_a_user"]),
        access_policy("mtm_access_tenant_b", ["tenant_b"], ["*"], ["tenant_b_user"]),
        # admin_role too: the patient view's can_read_pii column reads pii_grant,
        # so admins selecting it would otherwise hit access-denied.
        access_policy("mtm_access_auth_grant", ["auth"], ["pii_grant"], ["user_role", "admin_role"]),
        {
            "policyType": 2, "name": "mtm_rowfilter_auth_grant", "isEnabled": True,
            "isAuditEnabled": False, "service": SERVICE,
            "resources": {
                "catalog": {"values": ["default_catalog"]},
                "database": {"values": ["auth"]},
                "table": {"values": ["pii_grant"]},
            },
            # Only user_role is row-filtered to its own rows. No match (root,
            # admin_role) => Ranger applies no filter => they see all rows. So
            # admins/root need no explicit item, same as the mask policy.
            "rowFilterPolicyItems": [
                {"roles": ["user_role"], "accesses": [{"type": "select", "isAllowed": True}],
                 "rowFilterInfo": {"filterExpr": f"login = {LOGIN}"}},
            ],
        },
        mask_policy("mtm_mask_pii_redact", ["mrn", "first_name", "last_name"], MASK_REDACT),
        mask_policy("mtm_mask_dob", ["date_of_birth"], MASK_DOB),
    ]
    failures = sum(0 if upsert_policy(p) else 1 for p in policies)
    if failures:
        print(f"\n{failures} policy/policies failed.", file=sys.stderr)
        sys.exit(1)
    print("\nDone. StarRocks polls Ranger every ~10s — wait before testing.")


if __name__ == "__main__":
    main()
