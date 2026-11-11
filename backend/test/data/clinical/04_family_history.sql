INSERT INTO "family_history" (id,
                                  case_id,
                                  patient_id,
                                  family_member_code,
                                  condition, tenant_code)
VALUES (1, 16, 44, 'uncle', 'Diabetes', 'radiant')
ON CONFLICT (id) DO NOTHING;


-- Family history for the prenatal trio's proband. Two entries so ordering is observable, and none
-- on the fetus: the table has no fetus_id, a history can only be reported for a real patient.
INSERT INTO "family_history" (id, case_id, patient_id, family_member_code, condition, tenant_code)
VALUES (2, 74, 65, 'mother', 'Myotonic dystrophy', 'radiant'),
       (3, 74, 65, 'brother', 'Epilepsy', 'radiant')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE family_history ALTER COLUMN id RESTART WITH 1000;
