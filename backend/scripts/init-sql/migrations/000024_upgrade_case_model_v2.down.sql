ALTER TABLE analysis_catalog RENAME TO case_analysis;
ALTER TABLE case_type RENAME TO case_analysis_type;

ALTER TABLE cases
    ADD COLUMN request_id INTEGER REFERENCES request(id),
    RENAME COLUMN analysis_catalog_id TO case_analysis_id,
    RENAME COLUMN diagnosis_lab_id TO diagnosis_lab_id;

ALTER TABLE case_analysis ADD COLUMN type_code TEXT NOT NULL REFERENCES case_analysis_type(code);

UPDATE case_analysis a SET a.type_code = c.case_type_code FROM cases c WHERE c.case_analysis_id = a.id;

UPDATE cases c SET c.request_id = r.id FROM request r WHERE c.priority_code = r.priority_code AND c.ordering_physician = r.ordering_physician AND c.ordering_organization_id = r.ordering_organization_id;

ALTER TABLE cases
    DROP COLUMN priority_code,
    DROP COLUMN case_type_code,
    DROP COLUMN case_category_code,
    DROP COLUMN condition_code_system,
    DROP COLUMN resolution_status_code,
    DROP COLUMN ordering_physician,
    DROP COLUMN ordering_organization_id;

DROP TABLE IF EXISTS resolution_status;
DROP TABLE IF EXISTS case_category;
