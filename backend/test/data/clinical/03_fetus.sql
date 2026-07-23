-- CLIN-6117 prenatal fixtures: at most one fetus per case. Solo (case 72) = fetus 1; twin
-- pregnancy = 2 cases sharing the same mother, fetus 2 (case 73, alive) and fetus 3 (case 75,
-- deceased); trio (case 74) = fetus 4. Dates illustrate the DDM-only / DPA-only / no-date
-- (deceased) shapes hybrid's gestational_method conversion will produce.
INSERT INTO fetus (id, mother_id, life_status_code, sex_code, last_menstrual_period, estimated_due_date, tenant_code)
VALUES (1, 63, 'alive',    'male',    '2026-02-01', NULL,         'radiant'),
       (2, 64, 'alive',    'female',  NULL,         '2026-10-15', 'radiant'),
       (3, 64, 'deceased', 'unknown', NULL,         NULL,         'radiant'),
       (4, 65, 'alive',    'male',    '2026-03-01', NULL,         'radiant')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE fetus ALTER COLUMN id RESTART WITH 1000;
