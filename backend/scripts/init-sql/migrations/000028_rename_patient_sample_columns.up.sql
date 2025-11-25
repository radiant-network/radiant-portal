ALTER TABLE patient RENAME COLUMN organization_patient_id TO submitter_patient_id;
ALTER TABLE patient RENAME COLUMN organization_patient_id_type TO submitter_patient_id_type;
ALTER TABLE sample RENAME COLUMN submitter_organization_id TO organization_id;

