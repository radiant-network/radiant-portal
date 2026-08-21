INSERT INTO "obs_string" (id,
                                  case_id,
                                  patient_id,
                                  observation_code,
                                  value, tenant_code)
VALUES (1, 16, 44, 'phenotype', 'HP:0001263', 'radiant')
ON CONFLICT (id) DO NOTHING;

-- paraclinical exam fixture (case 74): everything an exam carries when there is no coded value —
-- normal, abnormal without a value (on the fetus), and the free-text "other", which by design
-- carries no interpretation.
INSERT INTO "obs_string" (id, case_id, patient_id, fetus_id, observation_code, value, interpretation_code, exam_code, tenant_code)
VALUES (2, 74, 65,   NULL, 'exam', 'normal',                     'normal',   'eeg',   'radiant'),
       (3, 74, 65,   NULL, 'exam', 'Ophthalmology consult 2026', NULL,       'other', 'radiant'),
       (4, 74, NULL, 4,    'exam', 'abnormal',                   'abnormal', 'eeg',   'radiant'),
       -- exam_code NULL: an FK guarantees a non-null code exists in the catalog, so this is the
       -- only way an exam row can have no matching exam — and it must still surface, unlabelled,
       -- rather than be dropped by the join.
       (5, 74, NULL, 4,    'exam', 'Bilateral ventriculomegaly', 'abnormal', NULL,    'radiant')
ON CONFLICT (id) DO NOTHING;

-- Clinical notes are per member: the mother and her fetus each carry their own.
INSERT INTO "obs_string" (id, case_id, patient_id, fetus_id, observation_code, value, interpretation_code, exam_code, tenant_code)
VALUES (6, 74, 65,   NULL, 'note',      'High-risk pregnancy follow-up', NULL, NULL, 'radiant'),
       (7, 74, NULL, 4,    'note',      'Findings on the second-trimester ultrasound', NULL, NULL, 'radiant')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE obs_string ALTER COLUMN id RESTART WITH 1000;
