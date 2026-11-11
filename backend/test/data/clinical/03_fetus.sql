-- prenatal fixtures: solo (case 72) = fetus 1; twins (case 73) = fetus 2 (alive) and
-- fetus 3 (deceased); trio (case 74) = fetus 4. Dates illustrate the DDM-only / DPA-only /
-- no-date (deceased) shapes hybrid's gestational_method conversion will produce.
INSERT INTO fetus (id, submitter_fetus_id, mother_id, organization_code, life_status_code, sex_code, last_menstrual_period, estimated_due_date, tenant_code)
VALUES (1, 'F-72-1', 63, 'CHUSJ', 'alive',    'male',    '2026-02-01', NULL,         'radiant'),
       (2, 'F-73-1', 64, 'CHUSJ', 'alive',    'female',  NULL,         '2026-10-15', 'radiant'),
       (3, 'F-73-2', 64, 'CHUSJ', 'deceased', 'unknown', NULL,         NULL,         'radiant'),
       (4, 'F-74-1', 65, 'CHUSJ', 'alive',    'male',    '2026-03-01', NULL,         'radiant')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE fetus ALTER COLUMN id RESTART WITH 1000;
