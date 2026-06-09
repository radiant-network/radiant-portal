/* ============================================================================
   02_starrocks_views.sql — per-tenant StarRocks DBs/views + auth view

   Run against StarRocks (MySQL protocol) as root:
       mysql -h127.0.0.1 -P9030 -uroot < 02_starrocks_views.sql
   (StarRocks rejects `--` line comments when piped, so we use C-style comments,
    matching init_starrocks.sql.)

   StarRocks users (JWT for alice/bob/wendy, native for svc_admin_api) live in
   02_starrocks_admin_user.sql — run it after this file.

   Views use the DEFAULT security mode (no SECURITY clause). Note: in StarRocks
   + Ranger, logical views are NOT an access-control boundary at any security
   mode — access is enforced only on base tables. So these views give per-tenant
   ergonomics + column masking; tenant isolation must be enforced elsewhere
   (row-filter on the base table).

   Creates:
     * auth.pii_grant   single source of truth for "who can read PII where",
                        pre-joined + wildcard-expanded. Keyed by `user_id`
                        (the StarRocks/IdP identity = the Keycloak sub). Since
                        user_role now carries user_id directly, no bridge to the
                        users table is needed.
     * tenant_a/tenant_b.patient   one logical view per tenant over the JDBC
                        catalog, filtered to its tenant. Exposes every patient
                        column verbatim plus the can_read_pii flag.
   The mask extracts the user_id from current_user() ('<user_id>'@'%'); StarRocks
   usernames equal users.user_id (= the JWT principal_field, preferred_username).
   Idempotent.
   ============================================================================ */

/* --- auth.pii_grant ------------------------------------------------------ */
CREATE DATABASE IF NOT EXISTS auth;
DROP VIEW IF EXISTS auth.pii_grant;
CREATE VIEW auth.pii_grant AS
SELECT ur.user_id, ur.tenant_code, ur.org_code           /* specific-org grants */
FROM radiant_jdbc.public.user_role ur
JOIN radiant_jdbc.public.role_action ra
  ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
WHERE ra.action_code = 'can_read_pii' AND ur.org_code <> '*'
UNION
SELECT ur.user_id, o.tenant_code, o.code                 /* '*' expanded to all orgs in tenant */
FROM radiant_jdbc.public.user_role ur
JOIN radiant_jdbc.public.role_action ra
  ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
JOIN radiant_jdbc.public.organization o
  ON o.tenant_code = ur.tenant_code
WHERE ra.action_code = 'can_read_pii' AND ur.org_code = '*';

/* --- Per-tenant patient views -------------------------------------------- */
CREATE DATABASE IF NOT EXISTS tenant_a;
DROP VIEW IF EXISTS tenant_a.patient;
CREATE VIEW tenant_a.patient AS
SELECT id,
       sex_code,
       date_of_birth,
       life_status_code,
       submitter_patient_id,
       submitter_patient_id_type,
       first_name,
       last_name,
       jhn,
       tenant_code,
       organization_code,
       /* convenience flag: does the current user_id hold can_read_pii for this
          row's org? Same condition as the mask, so 1 = PII visible (this row is
          unmasked for me), 0 = masked. NB: reflects the can_read_pii *action*;
          admins see clear via admin_role bypass and will read 0 here. */
       EXISTS (SELECT 1 FROM auth.pii_grant g
               WHERE g.user_id = substring_index(substr(current_user(), 2), char(39), 1)
                 AND g.tenant_code = 'tenant_a'
                 AND g.org_code = organization_code) AS can_read_pii
FROM radiant_jdbc.public.patient
WHERE tenant_code = 'tenant_a';

CREATE DATABASE IF NOT EXISTS tenant_b;
DROP VIEW IF EXISTS tenant_b.patient;
CREATE VIEW tenant_b.patient AS
SELECT id,
       sex_code,
       date_of_birth,
       life_status_code,
       submitter_patient_id,
       submitter_patient_id_type,
       first_name,
       last_name,
       jhn,
       tenant_code,
       organization_code,
       EXISTS (SELECT 1 FROM auth.pii_grant g
               WHERE g.user_id = substring_index(substr(current_user(), 2), char(39), 1)
                 AND g.tenant_code = 'tenant_b'
                 AND g.org_code = organization_code) AS can_read_pii
FROM radiant_jdbc.public.patient
WHERE tenant_code = 'tenant_b';

/* --- Sanity (as root) ---------------------------------------------------- */
SELECT '--- auth.pii_grant ---' AS section;
SELECT * FROM auth.pii_grant ORDER BY user_id, tenant_code, org_code;
SELECT '--- tenant_a.patient ---' AS section;
SELECT id, submitter_patient_id, first_name, organization_code, tenant_code FROM tenant_a.patient ORDER BY id;
SELECT '--- tenant_b.patient ---' AS section;
SELECT id, submitter_patient_id, first_name, organization_code, tenant_code FROM tenant_b.patient ORDER BY id;
