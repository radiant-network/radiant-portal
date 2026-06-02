-- Actions are seeded by migration 000009. Org-scoped actions go to the geneticist
-- role, tenant-scoped actions to the researcher role, in each tenant.
INSERT INTO role_action (tenant_code, role_code, action_code)
VALUES ('radiant',  'geneticist', 'can_read_pii'),
       ('radiant',  'geneticist', 'can_interpret_variant'),
       ('radiant',  'researcher', 'can_search_case'),
       ('radiant',  'researcher', 'can_view_kb'),
       ('tenant_b', 'geneticist', 'can_read_pii'),
       ('tenant_b', 'geneticist', 'can_interpret_variant'),
       ('tenant_b', 'researcher', 'can_search_case'),
       ('tenant_b', 'researcher', 'can_view_kb')
ON CONFLICT (tenant_code, role_code, action_code) DO NOTHING;
