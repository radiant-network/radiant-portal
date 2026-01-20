ALTER TABLE public.cases DROP CONSTRAINT IF EXISTS uc_cases_submitter_case_id;
ALTER TABLE public.cases ALTER COLUMN submitter_case_id DROP NOT NULL;

CREATE UNIQUE INDEX uc_cases_submitter_case_id_filtered
    ON public.cases (project_id, submitter_case_id)
    WHERE (submitter_case_id IS NOT NULL AND submitter_case_id <> '');
