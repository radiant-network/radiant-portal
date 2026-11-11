INSERT INTO organization (code, name, category_code, tenant_code, notification_emails)
VALUES ('CHOP', 'Children Hospital of Philadelphia', 'healthcare_provider', 'radiant', NULL),
       ('UCSF', 'University of California San-Francisco', 'healthcare_provider', 'radiant', NULL),
       ('CHUSJ', 'Centre hospitalier universitaire Sainte-Justine', 'healthcare_provider', 'radiant', NULL),
       ('LDM-CHUSJ', 'Laboratoire de diagnostic moléculaire, CHU Sainte-Justine', 'diagnostic_laboratory', 'radiant', 'ldm-chusj@example.invalid,ldm-chusj-bis@example.invalid'),
       ('LDM-CHOP', 'Molecular Diagnostic Laboratory, CHOP', 'diagnostic_laboratory', 'radiant', 'ldm-chop@example.invalid'),
       ('CQGC', 'Quebec Clinical Genomic Center', 'sequencing_center', 'radiant', NULL)
ON CONFLICT (code, tenant_code) DO NOTHING;