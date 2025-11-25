ALTER TABLE patient RENAME COLUMN submitter_patient_id TO organization_patient_id;
ALTER TABLE patient RENAME COLUMN submitter_patient_id_type TO organization_patient_id_type;
ALTER TABLE sample RENAME COLUMN organization_id TO submitter_organization_id;

