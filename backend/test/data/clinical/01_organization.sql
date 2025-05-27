INSERT INTO organization (id, code, name, category)
VALUES (1, 'CHOP', 'Children Hospital of Philadelphia', 'healthcare_provider'),
       (2, 'UCSF', 'University of California San-Francisco', 'healthcare_provider'),
       (3, 'CHUSJ', 'Centre hospitalier universitaire Sainte-Justine', 'healthcare_provider'),
       (4, 'LDM-CHUSJ', 'Laboratoire de diagnostic moléculaire, CHU Sainte-Justine', 'diagnostic_laboratory'),
       (5, 'LDM-CHOP', 'Molecular Diagnostic Laboratory, CHOP', 'diagnostic_laboratory'),
       (6, 'CQGC', 'Quebec Clinical Genomic Center', 'sequencing_center')
ON CONFLICT (code) DO NOTHING;