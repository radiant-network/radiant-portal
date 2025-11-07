ALTER TABLE case_analysis RENAME TO analysis_catalog;
ALTER TABLE case_analysis_type RENAME TO case_type;

CREATE TABLE IF NOT EXISTS case_category
(
    code    TEXT PRIMARY KEY,
    name_en TEXT NOT NULL
);

INSERT INTO case_category(code, name_en) VALUES
    ('prenatal', 'Prenatal'),
    ('postnatal', 'postnatal');

CREATE TABLE IF NOT EXISTS resolution_status
(
    code    TEXT PRIMARY KEY,
    name_en TEXT NOT NULL
);

INSERT INTO resolution_status(code, name_en) VALUES
    ('solved', 'Solved'),
    ('unsolved', 'Unsolved'),
    ('inconclusive', 'Inconclusive');

ALTER TABLE cases 
    ADD COLUMN priority_code TEXT REFERENCES priority(code),
    ADD COLUMN case_type_code TEXT REFERENCES case_type(code),
    ADD COLUMN case_category_code TEXT REFERENCES case_category(code),
    ADD COLUMN condition_code_system TEXT,
    ADD COLUMN resolution_status_code TEXT REFERENCES resolution_status(code),
    ADD COLUMN ordering_physician TEXT,
    ADD COLUMN ordering_organization_id INTEGER REFERENCES organization(id);

ALTER TABLE cases RENAME COLUMN case_analysis_id TO analysis_catalog_id;
ALTER TABLE cases RENAME COLUMN performer_lab_id TO diagnosis_lab_id;

UPDATE cases SET priority_code = COALESCE(r.priority_code, 'routine') FROM request r WHERE request_id = r.id;
UPDATE cases SET case_type_code = a.type_code FROM analysis_catalog a WHERE analysis_catalog_id = a.id;
UPDATE cases SET case_category_code = 'postnatal';
UPDATE cases SET condition_code_system = 'mondo';
UPDATE cases SET resolution_status_code = 'unsolved';
UPDATE cases SET ordering_physician = r.ordering_physician FROM request r WHERE request_id = r.id;
UPDATE cases SET ordering_organization_id = r.ordering_organization_id FROM request r WHERE request_id = r.id;

ALTER TABLE cases DROP COLUMN request_id;

ALTER TABLE analysis_catalog DROP COLUMN type_code;

ALTER TABLE cases
    ALTER COLUMN priority_code set NOT NULL,
    ALTER COLUMN case_type_code set NOT NULL,
    ALTER COLUMN case_category_code set NOT NULL;
