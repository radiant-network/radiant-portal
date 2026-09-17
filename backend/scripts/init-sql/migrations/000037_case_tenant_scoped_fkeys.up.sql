-- Make cases.project_id and cases.analysis_catalog_id tenant-consistent.
--
-- CLIN-6157 scoped the worker's patient/fetus lookups to the batch's tenant; the follow-up scoped
-- the rest (project, analysis_catalog, organization, sample, sequencing_experiment, document,
-- cases). This migration closes the door at the schema level for the two references nothing else
-- guards: case_project_id_fkey and case_case_analysis_id_fkey target a bare surrogate id, so a
-- case could point at another tenant's project or analysis catalog and the database would accept
-- it. organization already gets this treatment from migration 000009's compound FKs.
--
-- project and analysis_catalog keep their integer PK, so the compound FK needs a UNIQUE
-- (id, tenant_code) to target. It is redundant with the PK for uniqueness purposes and exists
-- solely as an FK target.
--
-- The FKs are added NOT VALID on purpose: an environment that already ran cross-tenant batches
-- may hold offending rows, and a failed constraint here would block startup (migrations run on
-- boot). NOT VALID still enforces the constraint on every INSERT/UPDATE from now on. Once a
-- deployment has confirmed its existing rows are consistent, run:
--   ALTER TABLE public.cases VALIDATE CONSTRAINT cases_project_tenant_fkey;
--   ALTER TABLE public.cases VALIDATE CONSTRAINT cases_analysis_catalog_tenant_fkey;

ALTER TABLE public.project
    ADD CONSTRAINT project_id_tenant_key UNIQUE (id, tenant_code);
ALTER TABLE public.analysis_catalog
    ADD CONSTRAINT analysis_catalog_id_tenant_key UNIQUE (id, tenant_code);

ALTER TABLE public.cases
    ADD CONSTRAINT cases_project_tenant_fkey
        FOREIGN KEY (project_id, tenant_code)
        REFERENCES public.project(id, tenant_code)
        NOT VALID;
ALTER TABLE public.cases
    ADD CONSTRAINT cases_analysis_catalog_tenant_fkey
        FOREIGN KEY (analysis_catalog_id, tenant_code)
        REFERENCES public.analysis_catalog(id, tenant_code)
        NOT VALID;
