-- geneticist is an org-scoped domain role; researcher is tenant-scoped. Roles are
-- per-tenant (PK is tenant_code + code), so the same names exist in both tenants.
-- practitioner is a mixed-scope role: it maps both org-scoped and tenant-scoped actions.
INSERT INTO role (tenant_code, code, name)
VALUES ('radiant',  'geneticist',   'Geneticist'),
       ('radiant',  'researcher',   'Researcher'),
       ('radiant',  'practitioner', 'Practitioner'),
       ('tenant_b', 'geneticist',   'Geneticist'),
       ('tenant_b', 'researcher',   'Researcher')
ON CONFLICT (tenant_code, code) DO NOTHING;
