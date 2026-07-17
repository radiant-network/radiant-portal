-- Auth grants for the QLIN tenant service accounts.
--
-- The clin-system M2M account (the qlin→radiant bridge in clin-qlin-me-hybrid) needs:
--   data_manager — can_ingest_data: POST/PUT/PATCH /{tenant}/*/batch (create/update mirroring)
--   member       — can_search_case: POST /{tenant}/cases/search (create-vs-update resolution
--                  in RadiantService.caseExists; replaced the removed GET /{tenant}/cases lookup)
--
-- user_id = the Keycloak `sub` of the clin-system client's service account in THIS environment's
-- Keycloak (client_credentials token .sub). It is environment-specific — replace the placeholder
-- below with the real sub before running:
--   curl -s -X POST <keycloak>/realms/<realm>/protocol/openid-connect/token \
--     -d grant_type=client_credentials -d client_id=clin-system -d client_secret=... \
--     | jq -r '.access_token | split(".")[1] | @base64d | fromjson | .sub'
--
-- Roles/role_action for tenant 'qlin' are seeded in ../insert_clinical_data.sql.

INSERT INTO users (user_id) VALUES ('<clin-system-sub>')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_role (user_id, tenant_code, org_code, role_code) VALUES
    ('<clin-system-sub>', 'qlin', '*', 'data_manager'),
    ('<clin-system-sub>', 'qlin', '*', 'member')
ON CONFLICT DO NOTHING;
