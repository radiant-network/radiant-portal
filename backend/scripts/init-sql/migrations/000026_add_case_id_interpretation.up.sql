ALTER TABLE interpretation_germline ADD COLUMN case_id TEXT;
ALTER TABLE interpretation_germline_history ADD COLUMN case_id TEXT;
ALTER TABLE interpretation_somatic ADD COLUMN case_id TEXT;
ALTER TABLE interpretation_somatic_history ADD COLUMN case_id TEXT;
