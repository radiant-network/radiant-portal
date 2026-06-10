-- Grants covering each org_code shape, plus a user in two tenants. Orgs are the
-- existing radiant orgs (CHOP, CHUSJ, ...); tenant_b has no orgs of its own.
--   alice: specific-org geneticist (CHOP) + tenant-wide researcher (NULL)   [radiant]
--   wendy: wildcard geneticist ('*') over every radiant org                 [radiant]
--   dan:   specific-org geneticist (CHUSJ)                                   [radiant]
--   carol: wildcard geneticist [radiant] + wildcard geneticist & researcher [tenant_b]
--   pat:   mixed-scope practitioner at a specific org (CHUSJ)                 [radiant]
--   tw:    mixed-scope practitioner granted tenant-wide (org_code NULL)       [radiant]
--   mike:  wildcard member ('*') — search cases + download files             [radiant]
--   gabe:  wildcard data_manager ('*') — ingest data                         [radiant]
-- mike/gabe use the seeded radiant roles (migration 000012) to give a grantee for the
-- can_download_file and can_ingest_data actions, which no other fixture user holds.
-- user_id values are the uuids seeded in 05_users.sql.
INSERT INTO user_role (user_id, tenant_code, org_code, role_code)
VALUES ('25286548-fbef-4e93-b3c4-c659e6169396', 'radiant',  'CHOP',  'geneticist'),   -- alice
       ('25286548-fbef-4e93-b3c4-c659e6169396', 'radiant',  NULL,    'researcher'),   -- alice
       ('79a8855e-3782-4dc8-be2a-8afdb34d6359', 'radiant',  '*',     'geneticist'),   -- wendy
       ('e10fee0b-063b-4dcd-b086-90d1c9eb239d', 'radiant',  'CHUSJ', 'geneticist'),   -- dan
       ('b6e6d0dd-7aa5-4018-ae03-1f5076801360', 'radiant',  '*',     'geneticist'),   -- carol
       ('b6e6d0dd-7aa5-4018-ae03-1f5076801360', 'tenant_b', '*',     'geneticist'),   -- carol
       ('b6e6d0dd-7aa5-4018-ae03-1f5076801360', 'tenant_b', NULL,    'researcher'),   -- carol
       ('6c330322-c746-4436-bb76-efd2cd943686', 'radiant',  'CHUSJ', 'practitioner'), -- pat
       ('4a330f72-24a1-4d37-8ad7-ff9989245fd3', 'radiant',  NULL,    'practitioner'), -- tw
       ('9f1d2c3b-4a5e-4f60-8c71-2d3e4f5a6b7c', 'radiant',  '*',     'member'),       -- mike
       ('0a1b2c3d-4e5f-4061-8273-849506a7b8c9', 'radiant',  '*',     'data_manager'); -- gabe
