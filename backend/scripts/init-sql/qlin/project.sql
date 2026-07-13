-- QLIN-specific clinical projects, complementing the generic RADIANT seed (N1/N2/QLIN).
-- tenant_code has no default (migration 000013), so it must be set explicitly.
-- Applied per-instance (not part of radiant-portal's own seed flow).
INSERT INTO project (code, name, tenant_code) VALUES
    ('PRAGMatIQ',        'PRAGMatIQ',        'radiant'),
    ('Care4Rare-Expand', 'Care4Rare-Expand', 'radiant')
ON CONFLICT (code, tenant_code) DO NOTHING;
