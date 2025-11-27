ALTER TABLE sequencing_experiment
ALTER COLUMN run_date TYPE timestamptz USING run_date::timestamptz;