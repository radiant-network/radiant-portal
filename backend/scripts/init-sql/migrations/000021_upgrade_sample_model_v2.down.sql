ALTER TABLE sample DROP COLUMN patient_id;
ALTER TABLE sample DROP COLUMN submitter_organization_id;
ALTER TABLE sample ALTER COLUMN submitter_sample_id DROP NOT NULL;

CREATE TABLE IF NOT EXISTS "sample_category"
(
    "code"    TEXT PRIMARY KEY,
    "name_en" TEXT NOT NULL
);
INSERT INTO "sample_category" ("code", "name_en")
VALUES ('specimen', 'Specimen'),
       ('sample', 'Sample')
ON CONFLICT (code) DO NOTHING;

ALTER TABLE sample ADD COLUMN category_code TEXT REFERENCES "sample_category" ("code");

UPDATE sample SET category_code = 'sample' where type_code = 'dna' or type_code = 'rna';
UPDATE sample SET category_code = 'specimen' where type_code = 'blood' or type_code = 'solid_tissue';

ALTER TABLE sample ALTER COLUMN category_code set NOT NULL;