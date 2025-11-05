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