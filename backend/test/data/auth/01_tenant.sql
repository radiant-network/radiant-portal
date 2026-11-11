-- 'radiant' is already seeded by migration 000009 and owns the existing orgs.
-- tenant_b is a second tenant with no orgs of its own, used to prove that one
-- tenant's wildcard org expansion does not bleed into another tenant.
INSERT INTO tenant (code, name)
VALUES ('tenant_b', 'Tenant B')
ON CONFLICT (code) DO NOTHING;
