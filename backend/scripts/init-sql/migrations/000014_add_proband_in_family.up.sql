INSERT INTO family_relationship (code, name_en) VALUES ('proband', 'Proband');

INSERT INTO family (case_id, family_member_id, relationship_to_proband_code, affected_status_code)
SELECT id, proband_id, 'proband', 'affected'
FROM cases;