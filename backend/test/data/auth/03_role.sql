-- geneticist is an org-scoped domain role; researcher is tenant-scoped. Roles are
-- per-tenant (PK is tenant_code + code), so the same names exist in both tenants.
-- practitioner is a mixed-scope role: it maps both org-scoped and tenant-scoped actions.
--
-- The radiant `geneticist` role is NOT defined here: it is seeded as a real role by
-- migration 000012. These tests reuse that seeded role (and its action set) rather than redefining it
-- tenant_b keeps its own geneticist because tenant_b is a test-only tenant the migration doesn't seed.
INSERT INTO role (tenant_code, code, name)
VALUES ('radiant',  'researcher',   'Researcher'),
       ('radiant',  'practitioner', 'Practitioner'),
       ('tenant_b', 'geneticist',   'Geneticist'),
       ('tenant_b', 'researcher',   'Researcher')
ON CONFLICT (tenant_code, code) DO NOTHING;
