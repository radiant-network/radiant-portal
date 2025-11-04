INSERT INTO observation (code, name_en, category)
VALUES ('ethnicity', 'Ethnicity', 'social_history')
ON CONFLICT (code) DO NOTHING;

ALTER TABLE obs_categorical RENAME TO observation_coding;

UPDATE observation_coding SET observation_code = 'ethnicity' WHERE observation_code = 'ancestry';

ALTER TABLE observation_coding ALTER COLUMN onset_code SET NOT NULL;

DELETE FROM observation WHERE code = 'note';
DELETE FROM observation WHERE code = 'ancestry';
DELETE FROM observation WHERE code = 'consanguinity';