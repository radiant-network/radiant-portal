/* ============================================================================
   02_starrocks_users.sql — StarRocks users for the multi-tenant masking demo.

   Run against StarRocks (MySQL protocol) as root, AFTER 02_starrocks_views.sql:
       mysql -h127.0.0.1 -P9030 -uroot < 02_starrocks_users.sql
   (StarRocks rejects `--` line comments when piped, so we use C-style comments.)

   Two kinds of identity:

     * alice / bob / wendy — authenticate with a Keycloak-issued JWT
       (IDENTIFIED WITH authentication_jwt). The StarRocks username MUST equal
       the token's principal_field (preferred_username), so current_user()
       stays '<login>'@'%' and the masks/row-filters in 02_starrocks_views.sql
       keep resolving the login exactly as before. Get a token + connect with
       ./connect.sh <user> (password radiant123!).

       - jwks_url       in-network host: StarRocks reaches Keycloak at keycloak:8080.
       - principal_field the JWT claim used as the StarRocks username.
       - required_issuer the host the *client* obtains the token from
                         (localhost:8080), which is what lands in the `iss` claim.
       required_audience is intentionally omitted: the `radiant` client has no
       audience mapper. To tighten, add an oidc-audience-mapper to `radiant` in
       backend/scripts/init-keycloak/cqdg.json and set
       "required_audience": "radiant" below.

     * svc_admin_api — platform/service admin on a regular password. Native auth, password adminpass1. It is a member of the
       Ranger admin_role (03_ranger_policies.py), so it bypasses masking.

   Idempotent (CREATE USER IF NOT EXISTS).
   ============================================================================ */

CREATE USER IF NOT EXISTS 'alice'@'%' IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/CQDG/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://localhost:8080/realms/CQDG"
}';

CREATE USER IF NOT EXISTS 'bob'@'%' IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/CQDG/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://localhost:8080/realms/CQDG"
}';

CREATE USER IF NOT EXISTS 'wendy'@'%' IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/CQDG/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://localhost:8080/realms/CQDG"
}';

/* Platform/service admin (native auth; demo-only password). */
CREATE USER IF NOT EXISTS 'svc_admin_api'@'%' IDENTIFIED BY 'adminpass1';

/* --- Sanity (as root) ---------------------------------------------------- */
SELECT '--- users ---' AS section;
SHOW USERS;
