-- Split the shared `public.status` dictionary into one dictionary per lifecycle.
--
-- `public.status` was FK-referenced from two unrelated columns — `cases.status_code` and
-- `sequencing_experiment.status_code` — so neither lifecycle could gain or lose a code without
-- leaking it into the other. The case lifecycle is about to gain codes that are meaningless for a
-- sequencing experiment (processing, in_review, reopened, …), so the dictionaries are separated
-- first.
--
-- Codes are carried over verbatim on both sides: this migration changes no case's and no
-- experiment's status. Labels and codes diverge in a follow-up.

CREATE TABLE IF NOT EXISTS public.case_status (
    code text NOT NULL,
    name_en text NOT NULL,
    name_fr text,
    CONSTRAINT case_status_pkey PRIMARY KEY (code)
);

CREATE TABLE IF NOT EXISTS public.sequencing_experiment_status (
    code text NOT NULL,
    name_en text NOT NULL,
    name_fr text,
    CONSTRAINT sequencing_experiment_status_pkey PRIMARY KEY (code)
);

-- Seed both from the shared dictionary
--
-- Copied from `public.status` rather than written out as a literal list: a deployment that added
-- codes of its own keeps them, so the FK repoint below cannot orphan an existing row. Each side
-- keeps the full set for now; trimming each dictionary to the codes its lifecycle actually uses
-- is a follow-up, and needs the referencing rows checked first.
INSERT INTO public.case_status (code, name_en)
SELECT code, name_en FROM public.status
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.sequencing_experiment_status (code, name_en)
SELECT code, name_en FROM public.status
ON CONFLICT (code) DO NOTHING;

-- Repoint the foreign keys
--
-- Both constraints have to be gone before `public.status` can be dropped, so the order here is
-- load-bearing. The new constraints follow the `<table>_<column>_fkey` convention used by the
-- rest of 000001 (the old `case_status_fkey` name predates it).
ALTER TABLE ONLY public.cases
    DROP CONSTRAINT IF EXISTS case_status_fkey;
ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_status_code_fkey FOREIGN KEY (status_code) REFERENCES public.case_status(code);

ALTER TABLE ONLY public.sequencing_experiment
    DROP CONSTRAINT IF EXISTS sequencing_experiment_status_fkey;
ALTER TABLE ONLY public.sequencing_experiment
    ADD CONSTRAINT sequencing_experiment_status_code_fkey FOREIGN KEY (status_code) REFERENCES public.sequencing_experiment_status(code);

-- Retire the shared dictionary
--
-- Deployment note: an environment that has already built per-tenant StarRocks views carries a
-- `<code>_tenant.status` view over this table. Views are CREATE OR REPLACE and are never
-- implicitly removed, and the refresh skips a table with no federatable columns, so that view
-- outlives the table and needs one manual `DROP VIEW IF EXISTS <code>_tenant.status` per tenant.
-- Both view flags (VIEW_REFRESH_ON_STARTUP_ENABLED, TENANT_VIEWS_READ_ENABLED) default to off, so
-- this does not apply to an environment that has never enabled them.
DROP TABLE public.status;
