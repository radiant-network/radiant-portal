-- radiant's orgs are seeded by the clinical fixtures. tenant_b needs its own org so
-- its wildcard ('*') grants resolve to a real, tenant-specific org list.
INSERT INTO organization (code, name, category_code, tenant_code)
VALUES ('TENANT_B_ORG', 'Tenant B Org', 'healthcare_provider', 'tenant_b')
ON CONFLICT (code, tenant_code) DO NOTHING;
