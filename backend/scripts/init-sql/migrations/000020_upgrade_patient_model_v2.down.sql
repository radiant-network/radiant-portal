ALTER TABLE patient ADD COLUMN mrn TEXT;

UPDATE patient SET mrn = organization_patient_id;

ALTER TABLE patient RENAME COLUMN organization_id TO managing_organization_id;

ALTER TABLE patient
    DROP column jhn,
    DROP column last_name,
    DROP column first_name,
    DROP column organization_patient_id_type,
    DROP column organization_patient_id,
    DROP column life_status_code;

DROP TABLE IF EXISTS "life_status";