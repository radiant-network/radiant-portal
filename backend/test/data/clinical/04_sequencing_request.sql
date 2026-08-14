-- Case 1 ordered a genome sequencing for its trio. The proband's request (id 1) is already
-- fulfilled by sequencing experiment 1 (sample 1 -> patient 3); the parents' requests stay
-- pending, which is the state that had no representation before this table.
-- service_id is resolved by code because the sequencing rows are seeded by migration 000023 and
-- their ids depend on the identity sequence.
INSERT INTO "sequencing_request" (id, service_id, case_id, patient_id, status_code,
                                  submitter_sequencing_request_id, tenant_code, created_on, updated_on)
VALUES (1, (SELECT id FROM service_catalog WHERE code = '75022' AND tenant_code = 'radiant'), 1, 3, 'completed', 'SR-1-PROBAND', 'radiant', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       (2, (SELECT id FROM service_catalog WHERE code = '75022' AND tenant_code = 'radiant'), 1, 1, 'submitted', 'SR-1-MOTHER', 'radiant', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       (3, (SELECT id FROM service_catalog WHERE code = '75020' AND tenant_code = 'radiant'), 1, 2, 'draft', 'SR-1-FATHER', 'radiant', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00')
ON CONFLICT (id) DO NOTHING;

UPDATE "sequencing_experiment" SET sequencing_request_id = 1 WHERE id = 1;

ALTER TABLE sequencing_request ALTER COLUMN id RESTART WITH 1000;
