ALTER TABLE interpretation_germline
ADD metadata JSONB;

ALTER TABLE interpretation_germline_history
ADD metadata JSONB;

ALTER TABLE interpretation_somatic
ADD metadata JSONB;

ALTER TABLE interpretation_somatic_history
ADD metadata JSONB;