INSERT INTO organization (code, name, category_code, tenant_code) VALUES
    ('CUSM',      'Centre universitaire de santé McGill',                      'healthcare_provider',   'qlin'),
    ('CHUS',      'Centre hospitalier universitaire de Sherbrooke',            'healthcare_provider',   'qlin'),
    ('CHUSJ',     'Centre hospitalier universitaire Sainte-Justine',           'healthcare_provider',   'qlin'),
    ('CHUM',      'Centre hospitalier de l''Université de Montréal',           'healthcare_provider',   'qlin'),
    ('CHUQ',      'CHU de Québec - Université Laval',                          'healthcare_provider',   'qlin'),
    ('HMR',       'Hôpital Maisonneuve-Rosemont',                              'healthcare_provider',   'qlin'),
    ('LDM-CHUSJ', 'Laboratoire de diagnostic moléculaire, CHU Sainte-Justine', 'diagnostic_laboratory', 'qlin'),
    ('LDM-CHUS',  'Service de génétique médicale, CIUSSSE-CHUS',               'diagnostic_laboratory', 'qlin'),
    ('LDM-CHUQ',  'Laboratoire de diagnostic moléculaire, CHU de Québec',      'diagnostic_laboratory', 'qlin'),
    ('LDM-CHUSM', 'Laboratoire de diagnostic moléculaire, CUSM',               'diagnostic_laboratory', 'qlin'),
    ('LDM-HMR',   'Laboratoire Central Hôpital Maisonneuve-Rosemont',          'diagnostic_laboratory', 'qlin'),
    ('LDM-CHUM',  'Laboratoire de diagnostic moléculaire, CHU Montéal',        'diagnostic_laboratory', 'qlin'),
    ('CQGC',      'Quebec Clinical Genomic Center',                            'sequencing_center',     'qlin')
ON CONFLICT (code, tenant_code) DO NOTHING;
