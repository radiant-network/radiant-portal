-- Grants covering each org_code shape, plus a user in two tenants. Orgs are the
-- existing radiant orgs (CHOP, CHUSJ, ...); tenant_b has no orgs of its own.
--   alice: specific-org geneticist (CHOP) + tenant-wide researcher (NULL)   [radiant]
--   wendy: wildcard geneticist ('*') over every radiant org                 [radiant]
--   dan:   specific-org geneticist (CHUSJ)                                   [radiant]
--   carol: wildcard geneticist [radiant] + wildcard geneticist & researcher [tenant_b]
--   pat:   mixed-scope practitioner at a specific org (CHUSJ)                 [radiant]
--   tw:    mixed-scope practitioner granted tenant-wide (org_code NULL)       [radiant]
INSERT INTO user_role (email, tenant_code, org_code, role_code)
VALUES ('alice@test.authz', 'radiant',  'CHOP',  'geneticist'),
       ('alice@test.authz', 'radiant',  NULL,    'researcher'),
       ('wendy@test.authz', 'radiant',  '*',     'geneticist'),
       ('dan@test.authz',   'radiant',  'CHUSJ', 'geneticist'),
       ('carol@test.authz', 'radiant',  '*',     'geneticist'),
       ('carol@test.authz', 'tenant_b', '*',     'geneticist'),
       ('carol@test.authz', 'tenant_b', NULL,    'researcher'),
       ('pat@test.authz',   'radiant',  'CHUSJ', 'practitioner'),
       ('tw@test.authz',    'radiant',  NULL,    'practitioner');
