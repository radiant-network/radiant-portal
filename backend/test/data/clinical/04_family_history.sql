INSERT INTO "family_history" (id,
                                  case_id,
                                  patient_id,
                                  family_member_code,
                                  condition)
VALUES (1, 16, 44, 'uncle', 'Diabetes')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE family_history ALTER COLUMN id RESTART WITH 1000;