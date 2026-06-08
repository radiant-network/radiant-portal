/* ============================================================================
   02_starrocks_users.sql — the StarRocks service admin for the masking demo.

   Run against StarRocks (MySQL protocol) as root, AFTER 02_starrocks_views.sql:
       mysql -h127.0.0.1 -P9030 -uroot < 02_starrocks_users.sql
   (StarRocks rejects `--` line comments when piped, so we use C-style comments.)

   The regular JWT users (alice/bob/wendy) are NO LONGER created here. They are
   provisioned by the Go tool `cmd/createuser`, which creates each StarRocks user
   named by its Keycloak `sub` with authentication_jwt and "principal_field":
   "sub" (was preferred_username). This file now only creates the native-auth
   service admin, which is scaffolding, not a regular user.

     * svc_admin_api — platform/service admin on native auth (password
       adminpass1). It is a member of the Ranger admin_role
       (03_ranger_policies.py), so it bypasses masking.

   Idempotent (CREATE USER IF NOT EXISTS).
   ============================================================================ */

/* Platform/service admin (native auth; demo-only password). */
CREATE USER IF NOT EXISTS 'svc_admin_api'@'%' IDENTIFIED BY 'adminpass1';

/* --- Sanity (as root) ---------------------------------------------------- */
SELECT '--- users ---' AS section;
SHOW USERS;
