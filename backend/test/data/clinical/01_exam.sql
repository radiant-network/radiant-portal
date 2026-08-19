-- The 'other' code is seeded by migration 000017; these two add a label-bearing exam of each
-- shape the case read has to render — HPO-coded values (emg) and interpretation-only (eeg).
INSERT INTO exam (code, name_en, name_fr, tenant_code)
VALUES ('eeg', 'Electroencephalogram (EEG)', 'Électroencéphalogramme (EEG)', 'radiant'),
       ('emg', 'Electromyography (EMG)', 'Électromyographie (EMG)', 'radiant')
ON CONFLICT (code, tenant_code) DO NOTHING;
