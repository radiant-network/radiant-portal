ALTER TABLE sample ADD COLUMN patient_id INTEGER REFERENCES "patient" ("id");
ALTER TABLE sample ADD COLUMN submitter_organization_id INTEGER REFERENCES "organization" ("id");
ALTER TABLE sample DROP COLUMN category_code;
DROP TABLE sample_category;

UPDATE sample SET patient_id = (SELECT patient_id FROM sequencing_experiment where sample_id = sample.id) WHERE patient_id IS NULL;
UPDATE sample SET patient_id = (SELECT patient_id FROM sample s2 WHERE s2.parent_sample_id = sample.id) WHERE patient_id IS NULL;
UPDATE sample SET submitter_organization_id = (SELECT performer_lab_id FROM sequencing_experiment where sample_id = sample.id) WHERE submitter_organization_id IS NULL;
UPDATE sample SET submitter_organization_id = (SELECT submitter_organization_id FROM sample s2 where s2.parent_sample_id = sample.id) WHERE submitter_organization_id IS NULL;

ALTER TABLE sample ALTER COLUMN submitter_sample_id set NOT NULL;
ALTER TABLE sample ALTER COLUMN patient_id set NOT NULL;
ALTER TABLE sample ALTER COLUMN submitter_organization_id set NOT NULL;