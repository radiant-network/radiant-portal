ALTER TABLE sequencing_experiment
ALTER COLUMN run_date TYPE date USING run_date::date;