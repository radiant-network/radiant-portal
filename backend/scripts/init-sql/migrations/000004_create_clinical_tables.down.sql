-- Value Sets ---------------------------------------------------------------
DROP TABLE sexe;
DROP TABLE observation_category;
DROP TABLE case_type;
DROP TABLE status;
DROP TABLE priority;
DROP TABLE experimental_strategy;
DROP TABLE platform;
DROP TABLE family_relationship;
DROP TABLE obs_interpretation;
DROP TABLE sample_category;
DROP TABLE sample_type;
DROP TABLE histology_type;
DROP TABLE affected_status;
DROP TABLE data_category;
DROP TABLE observation;
DROP TABLE onset;
DROP TABLE data_type;
DROP TABLE file_format;
DROP TABLE task_type;
DROP TABLE organization_category;
DROP TABLE observation_category;

-- Patients ---------------------------------------------------------------
DROP TABLE organization;
DROP TABLE patient;

-- Cases ---------------------------------------------------------------
DROP TABLE request;
DROP INDEX idx_request_status;
DROP INDEX idx_request_priority;
DROP INDEX idx_request_created_on;
DROP TABLE project;
DROP TABLE case;
DROP INDEX idx_case_proband_id;
DROP INDEX idx_case_project_id;
DROP INDEX idx_case_type;
DROP INDEX idx_case_status;
DROP INDEX idx_case_primary_condition;
DROP INDEX idx_case_panel_id;
DROP INDEX idx_case_created_on;
DROP TABLE family;
DROP INDEX idx_family_case_id;

--Observations ---------------------------------------------------------------
DROP TABLE observation_coding;
DROP INDEX idx_observation_case_id;
DROP INDEX idx_observation_patient_id;

-- Samples & Sequencing -------------------------------------------------------
DROP TABLE sample;
DROP INDEX idx_sample_parent_id;
DROP TABLE sequencing_experiment;
DROP INDEX idx_sequencing_experiment_case_id;
DROP INDEX idx_sequencing_experiment_patient_id;
DROP INDEX idx_sequencing_experiment_sample_id;

-- Tasks and Documents -------------------------------------------------------------------------
DROP TABLE pipeline;
DROP TABLE task;
DROP INDEX idx_task_type;
DROP TABLE task_has_sequencing_experiments;
DROP TABLE task_has_related_tasks;
DROP TABLE document;
DROP INDEX idx_document_name;
DROP INDEX idx_document_data_type;
DROP INDEX idx_document_format;
DROP TABLE task_has_documents;
DROP TABLE document_has_patients;
