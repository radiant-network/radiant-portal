INSERT INTO project (code, name, tenant_code) VALUES
    ('PRAGMatIQ',        'PRAGMatIQ',        'qlin'),
    ('Care4Rare-Expand', 'Care4Rare-Expand', 'qlin')
ON CONFLICT (code, tenant_code) DO NOTHING;
