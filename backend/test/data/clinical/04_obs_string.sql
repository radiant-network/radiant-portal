INSERT INTO "obs_string" (id,
                                  case_id,
                                  patient_id,
                                  observation_code,
                                  value)
VALUES (1, 16, 44, 'phenotype', 'HP:0001263')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE obs_string ALTER COLUMN id RESTART WITH 1000;