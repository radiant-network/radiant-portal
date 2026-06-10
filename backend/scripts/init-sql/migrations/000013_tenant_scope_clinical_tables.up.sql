-- Tenant-scope the remaining PostgreSQL transactional tables.
--
-- Migration 000009 added tenant_code to the org-linked "root" tables
-- (organization, cases, patient, sample, sequencing_experiment) via compound FKs
-- to organization(code, tenant_code). This migration finishes the job: it adds
-- tenant_code to every other tenant-scoped table so the Go API can scope queries
-- to the active tenant (set by the SJRA-1444 middleware) in a follow-up.
--
-- This ticket is ADDITIVE ONLY — no Go query changes. See the DEFAULT note below.
--
-- Decisions (documented per ticket):
--   * FK references public.tenant(code) directly. tenant lives in the same schema
--   * NOT NULL DEFAULT 'radiant' (the launch tenant seeded in 000009)
--   * History tables get the column (+ NOT NULL + index) but NO FK. They are
--     append-only audit snapshots populated by tp_history_func via `SELECT ..., $5.*`
--     (positional), so the column MUST be appended last to both the live table and
--     its _history twin to keep the column order aligned; an FK on an audit log is
--     unusual and the trigger swallows foreign_key_violation, which would silently
--     drop history rows — so the FK belongs only on the live table.
--   * Pure junction tables (case_has_sequencing_experiment, task_context,
--     task_has_document) are intentionally NOT scoped: they are always reached via a
--     tenant-scoped parent, so a tenant_code there is redundant denormalization.
--     000009 set the same precedent (it touched no junctions).
--   * Shared reference/catalog dictionaries (sample_type, status, panel, ...),
--     user-scoped tables (saved_filter, user_preference, user_set*), and the auth
--     model (tenant, users, role, action, role_action, user_role) are NOT
--     tenant-scoped and are left untouched.

-- =============================================================================
-- 1. Clinical + operational tables: add tenant_code (NOT NULL, FK, indexed).
--    ADD COLUMN ... NOT NULL DEFAULT backfills existing rows to 'radiant' in one
--    step and keeps inserts that omit the column working.
-- =============================================================================

-- File references
ALTER TABLE public.document
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant' REFERENCES public.tenant(code);
CREATE INDEX ix_document_tenant_code ON public.document (tenant_code);

-- Clinical children of cases
ALTER TABLE public.family
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant' REFERENCES public.tenant(code);
CREATE INDEX ix_family_tenant_code ON public.family (tenant_code);

ALTER TABLE public.family_history
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant' REFERENCES public.tenant(code);
CREATE INDEX ix_family_history_tenant_code ON public.family_history (tenant_code);

ALTER TABLE public.obs_categorical
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant' REFERENCES public.tenant(code);
CREATE INDEX ix_obs_categorical_tenant_code ON public.obs_categorical (tenant_code);

ALTER TABLE public.obs_string
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant' REFERENCES public.tenant(code);
CREATE INDEX ix_obs_string_tenant_code ON public.obs_string (tenant_code);

-- Variant annotations on occurrences
ALTER TABLE public.occurrence_note
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant' REFERENCES public.tenant(code);
CREATE INDEX ix_occurrence_note_tenant_code ON public.occurrence_note (tenant_code);

ALTER TABLE public.occurrence_flag
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant' REFERENCES public.tenant(code);
CREATE INDEX ix_occurrence_flag_tenant_code ON public.occurrence_flag (tenant_code);

-- Operational tables (tenant-owned: a tenant's projects, pipeline tasks, batches)
ALTER TABLE public.project
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant' REFERENCES public.tenant(code);
CREATE INDEX ix_project_tenant_code ON public.project (tenant_code);

ALTER TABLE public.task
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant' REFERENCES public.tenant(code);
CREATE INDEX ix_task_tenant_code ON public.task (tenant_code);

ALTER TABLE public.batch
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant' REFERENCES public.tenant(code);
CREATE INDEX ix_batch_tenant_code ON public.batch (tenant_code);

-- =============================================================================
-- 2. Interpretations (highest-traffic clinical writes) + their history twins.
--    Composite (tenant_code, case_id) on the live tables — interpretations are
--    looked up by case. The leading tenant_code also serves tenant-only scans, so
--    no separate plain (tenant_code) index is needed on these two.
--    History tables: column appended last to match the live table's column order
--    (tp_history_func copies positionally via `$5.*`); NO FK (see header).
-- =============================================================================
ALTER TABLE public.interpretation_germline
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant' REFERENCES public.tenant(code);
CREATE INDEX ix_interpretation_germline_tenant_case
    ON public.interpretation_germline (tenant_code, case_id);

ALTER TABLE public.interpretation_germline_history
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant';
CREATE INDEX ix_interpretation_germline_history_tenant_code
    ON public.interpretation_germline_history (tenant_code);

ALTER TABLE public.interpretation_somatic
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant' REFERENCES public.tenant(code);
CREATE INDEX ix_interpretation_somatic_tenant_case
    ON public.interpretation_somatic (tenant_code, case_id);

ALTER TABLE public.interpretation_somatic_history
    ADD COLUMN tenant_code varchar(50) NOT NULL DEFAULT 'radiant';
CREATE INDEX ix_interpretation_somatic_history_tenant_code
    ON public.interpretation_somatic_history (tenant_code);

-- =============================================================================
-- 3. Indexes for the tables 000009 gave a tenant_code column but no index.
--    The acceptance criterion is "every tenant-scoped table has tenant_code with
--    an index"; 000009 added the columns but omitted the indexes.
--
--    cases is the highest-traffic table. Rather than add a standalone composite,
--    fold tenant_code into the existing partial unique index
--    uc_cases_submitter_case_id_filtered (000003): submitter_case_id uniqueness
--    becomes per-tenant, and with tenant_code leading the index doubles as the
--    required (tenant_code, <filter>) composite — its leftmost prefix also serves
--    tenant-only scans, so cases needs no extra tenant_code index.
-- =============================================================================
DROP INDEX public.uc_cases_submitter_case_id_filtered;
CREATE UNIQUE INDEX uc_cases_submitter_case_id_filtered
    ON public.cases (tenant_code, project_id, submitter_case_id)
    WHERE (submitter_case_id IS NOT NULL AND submitter_case_id <> '');

CREATE INDEX ix_patient_tenant_code ON public.patient (tenant_code);
CREATE INDEX ix_sample_tenant_code ON public.sample (tenant_code);
CREATE INDEX ix_sequencing_experiment_tenant_code ON public.sequencing_experiment (tenant_code);
CREATE INDEX ix_organization_tenant_code ON public.organization (tenant_code);
