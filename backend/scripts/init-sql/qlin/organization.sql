INSERT INTO organization (code, name, category_code, tenant_code, notification_emails) VALUES
    ('CUSM',      'Centre universitaire de santé McGill',                      'healthcare_provider',   'qlin', NULL),
    ('CHUS',      'Centre hospitalier universitaire de Sherbrooke',            'healthcare_provider',   'qlin', NULL),
    ('CHUSJ',     'Centre hospitalier universitaire Sainte-Justine',           'healthcare_provider',   'qlin', NULL),
    ('CHUM',      'Centre hospitalier de l''Université de Montréal',           'healthcare_provider',   'qlin', NULL),
    ('CHUQ',      'CHU de Québec - Université Laval',                          'healthcare_provider',   'qlin', NULL),
    ('HMR',       'Hôpital Maisonneuve-Rosemont',                              'healthcare_provider',   'qlin', NULL),
    ('LDM-CHUSJ', 'Laboratoire de diagnostic moléculaire, CHU Sainte-Justine', 'diagnostic_laboratory', 'qlin', 'ldm-chusj@localstack.invalid'),
    ('LDM-CHUS',  'Service de génétique médicale, CIUSSSE-CHUS',               'diagnostic_laboratory', 'qlin', 'ldm-chus@localstack.invalid'),
    ('LDM-CHUQ',  'Laboratoire de diagnostic moléculaire, CHU de Québec',      'diagnostic_laboratory', 'qlin', 'ldm-chuq@localstack.invalid'),
    ('LDM-CHUSM', 'Laboratoire de diagnostic moléculaire, CUSM',               'diagnostic_laboratory', 'qlin', 'ldm-chusm@localstack.invalid'),
    ('LDM-HMR',   'Laboratoire Central Hôpital Maisonneuve-Rosemont',          'diagnostic_laboratory', 'qlin', 'ldm-hmr@localstack.invalid'),
    ('LDM-CHUM',  'Laboratoire de diagnostic moléculaire, CHU Montréal',        'diagnostic_laboratory', 'qlin', 'ldm-chum@localstack.invalid'),
    ('CQGC',      'Quebec Clinical Genomic Center',                            'sequencing_center',     'qlin', NULL)
-- Existing stacks: fill the list once, never overwrite one edited through the API.
ON CONFLICT (code, tenant_code) DO UPDATE SET notification_emails = EXCLUDED.notification_emails
WHERE organization.notification_emails IS NULL;
