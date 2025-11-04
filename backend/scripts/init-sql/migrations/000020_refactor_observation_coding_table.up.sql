INSERT INTO observation (code, name_en, category)
VALUES ('note', 'Clinical Note', 'activity'), --- replace ??? with appropriate category
       ('ancestry', 'Ancestry', 'social_history'),
       ('consanguinity', 'Consanguinity', 'activity') --- replace ??? with appropriate category
ON CONFLICT (code) DO NOTHING;

ALTER TABLE observation_coding RENAME TO obs_categorical;

ALTER TABLE obs_categorical ALTER COLUMN onset_code DROP NOT NULL;

UPDATE obs_categorical SET observation_code = 'ancestry' WHERE observation_code = 'ethnicity';

DELETE FROM observation WHERE code = 'ethnicity';