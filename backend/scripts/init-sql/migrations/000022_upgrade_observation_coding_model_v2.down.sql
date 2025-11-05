DROP TABLE IF EXISTS "consanguinity";

DROP TABLE IF EXISTS "family_history";

DROP TABLE IF EXISTS "obs_string";

INSERT INTO observation (code, name_en)
VALUES ('ethnicity', 'Ethnicity')
ON CONFLICT (code) DO NOTHING;

ALTER TABLE obs_categorical RENAME TO observation_coding;

UPDATE observation_coding SET observation_code = 'ethnicity' WHERE observation_code = 'ancestry';

ALTER TABLE observation_coding ALTER COLUMN onset_code SET NOT NULL;

DELETE FROM observation WHERE code IN ('note', 'ancestry', 'consanguinity');

CREATE TABLE IF NOT EXISTS "observation_category"
(
    "code"    TEXT PRIMARY KEY,
    "name_en" TEXT NOT NULL
);

INSERT INTO "observation_category" ("code", "name_en")
VALUES ('social_history', 'Social History'),
       ('vital_sign', 'Vital Sign'),
       ('imaging', 'Imaging'),
       ('laboratory', 'Laboratory'),
       ('procedure', 'Procedure'),
       ('survey', 'Survey'),
       ('exam', 'Exam'),
       ('therapy', 'Therapy'),
       ('activity', 'Activity')
ON CONFLICT (code) DO NOTHING;

ALTER TABLE "observation" ADD COLUMN "category" TEXT REFERENCES "observation_category" ("code");

UPDATE "observation" SET "category" = 'exam' WHERE "code" IN ('phenotype', 'condition');
UPDATE "observation" SET "category" = 'social_history' WHERE "code" = 'ethnicity';

ALTER TABLE "observation" ALTER COLUMN "category" SET NOT NULL;