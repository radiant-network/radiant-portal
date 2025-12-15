ALTER TABLE cases ADD COLUMN submitter_case_id TEXT;

UPDATE cases SET submitter_case_id = CONCAT(project_id, ':', id);

ALTER TABLE cases ALTER COLUMN submitter_case_id SET NOT NULL;

ALTER TABLE cases ADD CONSTRAINT UC_cases_submitter_case_id UNIQUE (submitter_case_id);
