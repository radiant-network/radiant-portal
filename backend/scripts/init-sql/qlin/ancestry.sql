-- QLIN-specific ancestry codes, complementing the generalized set from migration 000015.
-- Applied per-instance (not part of radiant-portal's own seed flow).
INSERT INTO ancestry (code, name_en) VALUES
    ('CA-FR', 'French Canadian'),
    ('EU',    'European Caucasian')
ON CONFLICT (code) DO NOTHING;
