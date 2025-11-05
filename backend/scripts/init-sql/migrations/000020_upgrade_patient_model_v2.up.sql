CREATE TABLE IF NOT EXISTS life_status
(
    code    TEXT PRIMARY KEY,
    name_en TEXT NOT NULL
);

INSERT INTO life_status(code, name_en) VALUES
    ('alive', 'Alive'),
    ('deceased', 'Deceased'),
    ('unknown', 'Unknown');

ALTER TABLE patient
    ADD COLUMN life_status_code TEXT REFERENCES life_status(code),
    ADD COLUMN organization_patient_id TEXT,
    ADD COLUMN organization_patient_id_type TEXT,
    ADD COLUMN first_name TEXT,
    ADD COLUMN last_name TEXT,
    ADD COLUMN jhn TEXT;

ALTER TABLE patient RENAME COLUMN managing_organization_id TO organization_id;

UPDATE patient SET
    organization_patient_id = mrn,
    organization_patient_id_type = 'mrn',
    life_status_code = 'unknown';

ALTER TABLE patient
    ALTER COLUMN life_status_code set NOT NULL,
    ALTER COLUMN organization_patient_id set NOT NULL,
    ALTER COLUMN organization_patient_id_type set NOT NULL;

ALTER TABLE patient
    DROP COLUMN mrn;