INSERT INTO organization (code, name, category_code, tenant_code)
VALUES ('CHOP', 'Children Hospital of Philadelphia', 'healthcare_provider', 'radiant'),
       ('UCSF', 'University of California San-Francisco', 'healthcare_provider', 'radiant'),
       ('CHUSJ', 'Centre hospitalier universitaire Sainte-Justine', 'healthcare_provider', 'radiant'),
       ('LDM-CHUSJ', 'Laboratoire de diagnostic moléculaire, CHU Sainte-Justine', 'diagnostic_laboratory', 'radiant'),
       ('LDM-CHOP', 'Molecular Diagnostic Laboratory, CHOP', 'diagnostic_laboratory', 'radiant'),
       ('CQGC', 'Quebec Clinical Genomic Center', 'sequencing_center', 'radiant')
ON CONFLICT (code, tenant_code) DO NOTHING;