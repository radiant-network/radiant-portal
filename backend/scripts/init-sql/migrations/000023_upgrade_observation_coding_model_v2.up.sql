INSERT INTO observation (code, name_en)
VALUES ('note', 'Clinical Note'),
       ('ancestry', 'Ancestry'),
       ('consanguinity', 'Consanguinity')
ON CONFLICT (code) DO NOTHING;

ALTER TABLE observation_coding RENAME TO obs_categorical;

ALTER TABLE obs_categorical ALTER COLUMN onset_code DROP NOT NULL;

UPDATE obs_categorical SET observation_code = 'ancestry' WHERE observation_code = 'ethnicity';

DELETE FROM observation WHERE code = 'ethnicity';