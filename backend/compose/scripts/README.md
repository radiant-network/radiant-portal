# Multi-tenant PII masking — StarRocks + Ranger simulation

Demonstrates per-tenant patient data with **column masking driven by the real
auth model**: a user sees a patient's PII only if they hold the `can_read_pii`
action for that patient's organization (migration `000009`). Runs against the
local `backend/compose` stack (StarRocks + Postgres + Ranger).

## ⚠️ Status

- **Masking — works and is the deliverable.** PII (`mrn`, `first_name`,
  `last_name`, `date_of_birth`→year) is masked per `can_read_pii`.
- **Tenant *access* isolation — NOT enforced yet.** StarRocks bug
  [#72910](https://github.com/StarRocks/starrocks/issues/72910): Ranger
  authorization is bypassed for **views and materialized views**. The patient
  objects here are views, so the access policies (`mtm_access_*`) are inert —
  any connected user can *read* any tenant's view (masked, but readable). Access
  control is enforced only on **base tables**.
  **Do not ship this to a real multi-tenant environment until #72910 is fixed**
  (then re-verify; the secured object would need to be a native/base table).
  `04_verify.py` includes a tripwire that fails when the bug is fixed.

## Prerequisites

```bash
cd backend/compose && docker compose up -d   # StarRocks :9030, Postgres :5432, Ranger :6080
```
Host needs the `mysql` client and `python3` (stdlib only — no pip installs).

## Run order

```bash
cd backend/compose/scripts

# 1. Seed Postgres: 2 tenants, orgs, patients, auth roles/grants/users.
PGPASSWORD=radiant psql -h localhost -U radiant -d radiant -p 5432 -f 01_seed_postgres.sql

# 2. StarRocks: auth.pii_grant view + per-tenant patient views + demo users.
mysql -h127.0.0.1 -P9030 -uroot < 02_starrocks_views.sql

# 3. Ranger: roles + access / row-filter / mask policies.
python3 03_ranger_policies.py

# wait ~10s for StarRocks to poll Ranger, then:
# 4. Verify masking matrix + can_read_pii flag + #72910 tripwire (18 checks).
python3 04_verify.py
```
All four are idempotent; re-running converges to the same state.

## How it fits together

```
radiant_jdbc (Postgres federation)
   public.patient, user_role, role_action, organization, users
        │
        ├─ auth.pii_grant  (view) ── single source of truth: (login, tenant, org)
        │     where login = users.user_id and role grants can_read_pii;
        │     the '*' org wildcard is pre-expanded to concrete orgs.
        │
        └─ tenant_a.patient / tenant_b.patient (views, filtered by tenant)
              expose a per-row  can_read_pii  column computed from auth.pii_grant
                 │
                 └─ Ranger mask:  CASE WHEN can_read_pii THEN {col} ELSE '***' END
```

- **Identity bridge:** StarRocks usernames can't contain `@`, so they are
  `users.user_id` (the Keycloak `sub`/login), never the email. The mask/filter
  extract the login from `current_user()` (`'<login>'@'%'`).
- **`can_read_pii` column:** doubles as a user-facing flag — `1` = this row is
  visible to me, `0` = masked. (For admins it reads `0` while they still see
  clear data, because the flag tracks the *action*, not the `admin_role` bypass.)

## Role model

| Ranger role | Members | Meaning |
|---|---|---|
| `admin_role` | platform admins (`dora`) | full access to every tenant; never masked; sees all `pii_grant` |
| `tenant_a_user` / `tenant_b_user` | that tenant's users | access to that tenant DB |
| `user_role` | *(nested: contains the tenant roles)* | the masking + row-filter subject |

`user_role` contains the per-tenant roles as sub-roles, so assigning a tenant
role transitively makes the user a masking subject — assign once, masked for
free. Admins are **not** in `user_role`, so they're unmasked and unfiltered by
the "no matching item → pass through" behavior of Ranger mask/row-filter policies
(no explicit admin/root item needed).

## Demo users (password `Demo12345!`, except `root`)

| login | role | can_read_pii grant |
|---|---|---|
| `dora`  | admin_role | — (sees all via bypass) |
| `alice` | tenant_a_user | `ORG_A1` |
| `wendy` | tenant_a_user | `*` (all tenant_a orgs) |
| `bob`   | tenant_b_user | `ORG_B1` |

Example — expected masking on `tenant_a.patient` (`1001/1002`=ORG_A1, `1003`=ORG_A2):

| login | 1001 | 1002 | 1003 |
|---|---|---|---|
| `dora` / `root` | clear | clear | clear |
| `alice` | clear | clear | **masked** |
| `wendy` | clear | clear | clear |
| `bob` | masked | masked | masked |

## Ranger policies (service `starrocks`)

| Policy | Type | Rule |
|---|---|---|
| `mtm_access_admin` | access | `admin_role` → SELECT on `tenant_*` |
| `mtm_access_tenant_a` / `_b` | access | tenant role → SELECT on its DB |
| `mtm_access_auth_grant` | access | `user_role`+`admin_role` → SELECT on `auth.pii_grant` |
| `mtm_rowfilter_auth_grant` | row-filter | `user_role` → own rows only |
| `mtm_mask_pii_redact` | mask | `user_role` → `***` on `mrn`/`first_name`/`last_name` unless `can_read_pii` |
| `mtm_mask_dob` | mask | `user_role` → year-only on `date_of_birth` unless `can_read_pii` |

Masks target `tenant_*` (one policy covers every current and future tenant DB).
